import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaydunyaSetupRequest {
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
    // Get the request body
    const { amount, description, payment_type, product_id } = await req.json() as PaydunyaSetupRequest
    
    console.log('Creating payment link for:', { amount, description, payment_type, product_id })

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
    console.log('Got auth token:', token.substring(0, 10) + '...')

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      throw new Error('Not authenticated')
    }

    console.log('Authenticated as user:', user.id)

    // Vérifier que toutes les clés PayDunya sont présentes
    const masterKey = Deno.env.get('PAYDUNYA_MASTER_KEY')
    const privateKey = Deno.env.get('PAYDUNYA_PRIVATE_KEY')
    const token_paydunya = Deno.env.get('PAYDUNYA_TOKEN')

    if (!masterKey || !privateKey || !token_paydunya) {
      console.error('Missing PayDunya configuration')
      throw new Error('Configuration PayDunya manquante')
    }

    // Setup Paydunya request
    const paydunyaSetup = {
      "invoice": {
        "total_amount": amount,
        "description": description
      },
      "store": {
        "name": "Adedara Pro"
      },
      "actions": {
        "cancel_url": "https://app.adedara.pro/cancel",
        "return_url": "https://app.adedara.pro/success",
        "callback_url": "https://app.adedara.pro/webhook"
      },
      "custom_data": {
        "user_id": user.id,
        "payment_type": payment_type,
        "product_id": product_id
      }
    }

    console.log('PayDunya setup:', paydunyaSetup)
    console.log('Using PayDunya configuration with master key:', masterKey.substring(0, 5) + '...')

    // Use the production URL instead of sandbox
    const response = await fetch('https://app.paydunya.com/api/v1/checkout-invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': masterKey,
        'PAYDUNYA-PRIVATE-KEY': privateKey,
        'PAYDUNYA-TOKEN': token_paydunya
      },
      body: JSON.stringify(paydunyaSetup)
    })

    const paydunyaResponse = await response.json()
    console.log('PayDunya API response:', paydunyaResponse)

    if (!response.ok || !paydunyaResponse.token) {
      console.error('PayDunya error:', paydunyaResponse)
      throw new Error(paydunyaResponse.response_text || 'Erreur PayDunya')
    }

    // Create payment link in database
    const { data: paymentLink, error: dbError } = await supabaseClient
      .from('payment_links')
      .insert({
        user_id: user.id,
        amount: amount,
        description: description,
        payment_type: payment_type,
        paydunya_token: paydunyaResponse.token
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Erreur lors de la sauvegarde du lien')
    }

    // If this is a product payment, update the product with the payment link ID
    if (product_id && payment_type === 'product') {
      const { error: updateError } = await supabaseClient
        .from('products')
        .update({ payment_link_id: paymentLink.id })
        .eq('id', product_id)

      if (updateError) {
        console.error('Error updating product:', updateError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_url: paydunyaResponse.response_text,
        token: paydunyaResponse.token,
        payment_link_id: paymentLink.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Une erreur est survenue',
        details: error
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})