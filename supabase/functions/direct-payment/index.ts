import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  amount: number;
  description: string;
  customer_email?: string;
  customer_phone?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, description, customer_email, customer_phone } = await req.json() as PaymentRequest
    
    console.log('Initiating direct payment:', { amount, description })

    const masterKey = Deno.env.get('PAYDUNYA_MASTER_KEY')
    const privateKey = Deno.env.get('PAYDUNYA_PRIVATE_KEY')
    const token = Deno.env.get('PAYDUNYA_TOKEN')

    if (!masterKey || !privateKey || !token) {
      throw new Error('Configuration PayDunya manquante')
    }

    const paymentData = {
      "invoice": {
        "total_amount": amount,
        "description": description
      },
      "store": {
        "name": "Adedara Pro"
      },
      "custom_data": {
        customer_email,
        customer_phone
      }
    }

    console.log('Calling PayDunya API with data:', paymentData)

    const response = await fetch('https://app.paydunya.com/api/v1/direct-pay/credit-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': masterKey,
        'PAYDUNYA-PRIVATE-KEY': privateKey,
        'PAYDUNYA-TOKEN': token
      },
      body: JSON.stringify(paymentData)
    })

    const paydunyaResponse = await response.json()
    console.log('PayDunya API response:', paydunyaResponse)

    if (!response.ok) {
      throw new Error(paydunyaResponse.response_text || 'Erreur PayDunya')
    }

    return new Response(
      JSON.stringify(paydunyaResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Payment error:', error)
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