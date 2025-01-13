import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Payout initiation function initialized')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { payoutId, amount, currency, description, recipient } = await req.json()
    console.log('Initiating payout:', { payoutId, amount, currency, description, recipient })

    const monerooPayoutKey = Deno.env.get('MONEROO_PAYOUT_KEY')
    if (!monerooPayoutKey) {
      throw new Error('MONEROO_PAYOUT_KEY is not configured')
    }

    // Updated to use the correct Moneroo API endpoint
    const monerooResponse = await fetch('https://api.moneroo.io/api/v1/payouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${monerooPayoutKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency,
        description,
        recipient: {
          firstName: recipient.firstName,
          lastName: recipient.lastName,
          email: recipient.email,
          phone: recipient.phone,
          provider: recipient.provider
        },
        metadata: {
          payoutId
        }
      })
    })

    if (!monerooResponse.ok) {
      const errorData = await monerooResponse.json()
      console.error('Moneroo API error:', errorData)
      throw new Error(`Moneroo API error: ${errorData.message || 'Unknown error'}`)
    }

    const data = await monerooResponse.json()
    console.log('Moneroo payout initiated:', data)

    return new Response(
      JSON.stringify({ payoutId: data.id }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error processing payout:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})