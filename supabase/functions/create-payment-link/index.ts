import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CustomerInfo {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

interface PaymentRequest {
  amount: number;
  description: string;
  payment_type: string;
  currency?: string;
  redirect_url?: string | null;
  customer?: CustomerInfo;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting payment link creation with Moneroo...')
    const { 
      amount, 
      description, 
      payment_type, 
      currency = "XOF",
      redirect_url,
      customer = {}
    } = await req.json() as PaymentRequest
    
    console.log('Request payload:', { 
      amount, 
      description, 
      payment_type, 
      currency,
      redirect_url,
      customer 
    })

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Initialize payment with Moneroo
    const monerooPayload = {
      amount: amount,
      currency: currency,
      description: description,
      customer: {
        email: customer.email || "guest@example.com",
        first_name: customer.first_name || "Guest",
        last_name: customer.last_name || "User",
        phone: customer.phone
      },
      return_url: redirect_url || `${Deno.env.get('SUPABASE_URL')}/products`,
      metadata: {
        payment_type: payment_type,
      }
    }

    console.log('Initializing Moneroo payment:', monerooPayload)

    const monerooToken = Deno.env.get('MONEROO_SECRET_KEY')
    if (!monerooToken) {
      console.error('Missing Moneroo configuration')
      throw new Error('Configuration Moneroo manquante')
    }

    console.log('Moneroo token present:', !!monerooToken)

    const monerooResponse = await fetch('https://api.moneroo.io/v1/payments/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${monerooToken}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(monerooPayload)
    })

    let monerooData
    const responseText = await monerooResponse.text()
    console.log('Raw Moneroo response:', responseText)

    try {
      monerooData = JSON.parse(responseText)
    } catch (e) {
      console.error('Error parsing Moneroo response:', e)
      throw new Error(`Erreur Moneroo: Réponse invalide - ${responseText}`)
    }

    if (!monerooResponse.ok) {
      console.error('Moneroo error response:', monerooData)
      throw new Error(`Erreur Moneroo: ${monerooData.message || 'Erreur inconnue'}`)
    }

    if (!monerooData.data?.id || !monerooData.data?.checkout_url) {
      console.error('Invalid Moneroo response format:', monerooData)
      throw new Error('Format de réponse Moneroo invalide')
    }

    console.log('Moneroo response data:', monerooData)

    // Create payment link in database
    const { data: paymentLink, error: dbError } = await supabaseClient
      .from('payment_links')
      .insert({
        amount: amount,
        description: description,
        payment_type: payment_type,
        moneroo_token: monerooData.data.id,
        status: 'pending'
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Erreur lors de la sauvegarde du lien')
    }

    console.log('Payment link created in database:', paymentLink)

    return new Response(
      JSON.stringify({
        success: true,
        payment_url: monerooData.data.checkout_url,
        token: monerooData.data.id,
        payment_link_id: paymentLink.id
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
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