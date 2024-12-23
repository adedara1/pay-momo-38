import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  amount: number
  description: string
  payment_type: string
  product_id?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting payment link creation...')
    const { amount, description, payment_type, product_id } = await req.json() as PaymentRequest
    
    console.log('Request payload:', { amount, description, payment_type, product_id })

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user ID from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header')
      throw new Error('Not authenticated')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      throw new Error('Not authenticated')
    }

    // Vérifier que la clé PawaPay est présente
    const pawapayToken = Deno.env.get('PAWAPAY_SANDBOX_TOKEN')
    if (!pawapayToken) {
      console.error('Missing PawaPay configuration')
      throw new Error('Configuration PawaPay manquante')
    }

    console.log('PawaPay token present:', !!pawapayToken)

    // Créer un ID unique pour le paiement
    const payoutId = crypto.randomUUID();
    console.log('Generated payoutId:', payoutId);

    // Create payment link in database first
    const { data: paymentLink, error: dbError } = await supabaseClient
      .from('payment_links')
      .insert({
        user_id: user.id,
        amount: amount,
        description: description,
        payment_type: payment_type,
        paydunya_token: payoutId,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Erreur lors de la sauvegarde du lien');
    }

    console.log('Payment link created in database:', paymentLink)

    // If it's a product payment, update the product with the payment link ID
    if (product_id && payment_type === 'product') {
      const { error: updateError } = await supabaseClient
        .from('products')
        .update({ payment_link_id: paymentLink.id })
        .eq('id', product_id);

      if (updateError) {
        console.error('Error updating product:', updateError);
      }
    }

    // Return success response with payment link info
    return new Response(
      JSON.stringify({
        success: true,
        payment_url: `${Deno.env.get('SUPABASE_URL')}/products/${product_id || paymentLink.id}`,
        token: payoutId,
        payment_link_id: paymentLink.id
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Une erreur est survenue',
        details: error
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});