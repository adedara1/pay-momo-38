import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaydunyaSetupRequest {
  amount: number
  description: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { amount, description } = await req.json() as PaydunyaSetupRequest
    
    console.log('Creating payment link for amount:', amount, 'description:', description)

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user ID from the request
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader ?? '')
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Setup Paydunya request for production
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
        "user_id": user.id
      }
    }

    // Call Paydunya API in production mode
    const response = await fetch('https://app.paydunya.com/api/v1/checkout-invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': Deno.env.get('PAYDUNYA_MASTER_KEY') ?? '',
        'PAYDUNYA-PRIVATE-KEY': Deno.env.get('Clé Privée') ?? '',
        'PAYDUNYA-TOKEN': Deno.env.get('Token') ?? ''
      },
      body: JSON.stringify(paydunyaSetup)
    })

    const paydunyaResponse = await response.json()
    console.log('Paydunya response:', paydunyaResponse)

    if (paydunyaResponse.response_code !== "00") {
      throw new Error(paydunyaResponse.response_text)
    }

    // Create payment link in database
    const { data: paymentLink, error: dbError } = await supabaseClient
      .from('payment_links')
      .insert({
        user_id: user.id,
        amount: amount,
        description: description,
        paydunya_token: paydunyaResponse.token
      })
      .select()
      .single()

    if (dbError) {
      console.error('Error creating payment link:', dbError)
      throw dbError
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_url: paydunyaResponse.response_text,
        token: paydunyaResponse.token
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})