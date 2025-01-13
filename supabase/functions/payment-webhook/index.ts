import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Payment webhook function initialized')

serve(async (req) => {
  // Log every incoming request
  console.log('Received webhook request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  })

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request')
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log('Webhook payload received:', JSON.stringify(payload, null, 2))

    // Créer le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Vérifier si le paiement est réussi
    if (payload.event !== 'payment.success') {
      console.log('Event ignored:', payload.event)
      return new Response(JSON.stringify({ message: 'Event ignored' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    const paymentData = payload.data
    console.log('Payment data:', paymentData)

    // Récupérer le lien de paiement
    const { data: paymentLink, error: paymentLinkError } = await supabaseClient
      .from('payment_links')
      .select('user_id, amount')
      .eq('moneroo_token', paymentData.id)
      .single()

    if (paymentLinkError) {
      console.error('Error fetching payment link:', paymentLinkError)
      throw paymentLinkError
    }

    console.log('Payment link found:', paymentLink)

    // Récupérer les informations de l'utilisateur
    const { data: userProfile, error: userError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', paymentLink.user_id)
      .single()

    if (userError) {
      console.error('Error fetching user profile:', userError)
      throw userError
    }

    console.log('User profile found:', userProfile)

    // Récupérer les paramètres de frais
    const { data: settings, error: settingsError } = await supabaseClient
      .from('settings')
      .select('product_fee_percentage')
      .eq('user_id', paymentLink.user_id)
      .single()

    if (settingsError) {
      console.error('Error fetching settings:', settingsError)
      throw settingsError
    }

    console.log('Settings found:', settings)

    // Calculer le montant net après frais
    const feePercentage = settings?.product_fee_percentage || 0
    const netAmount = paymentLink.amount - (paymentLink.amount * feePercentage / 100)

    // Si le transfert automatique est activé
    if (userProfile.auto_transfer && userProfile.momo_number && userProfile.momo_provider) {
      console.log('Initiating automatic transfer')

      // Initier le transfert via l'API Moneroo en utilisant la clé de payout
      const monerooResponse = await fetch('https://api.moneroo.io/v1/payouts/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('MONEROO_PAYOUT_KEY')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(netAmount),
          currency: "XOF",
          method: userProfile.momo_provider,
          customer: {
            phone: userProfile.momo_number,
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            email: userProfile.company_email || 'no-email@example.com'
          },
          metadata: {
            payment_id: paymentData.id,
            user_id: userProfile.id
          }
        })
      })

      const monerooData = await monerooResponse.json()
      console.log('Moneroo payout response:', monerooData)

      if (!monerooResponse.ok) {
        throw new Error(`Moneroo payout error: ${monerooData.message || 'Unknown error'}`)
      }

      // Créer l'enregistrement du payout
      const { data: payout, error: payoutError } = await supabaseClient
        .from('payouts')
        .insert({
          user_id: userProfile.id,
          amount: Math.round(netAmount),
          currency: "XOF",
          status: 'pending',
          description: `Automatic transfer for payment ${paymentData.id}`,
          customer_email: userProfile.company_email || 'no-email@example.com',
          customer_first_name: userProfile.first_name,
          customer_last_name: userProfile.last_name,
          customer_phone: userProfile.momo_number,
          method: userProfile.momo_provider,
          moneroo_payout_id: monerooData.data.id
        })
        .select()
        .single()

      if (payoutError) {
        console.error('Error creating payout record:', payoutError)
        throw payoutError
      }

      console.log('Payout record created:', payout)
    }

    // Créer l'enregistrement de la transaction
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: userProfile.id,
        amount: paymentLink.amount,
        status: 'completed',
        moneroo_reference: paymentData.id,
        type: 'payment',
        customer_name: `${paymentData.customer.first_name} ${paymentData.customer.last_name}`,
        customer_contact: paymentData.customer.phone || paymentData.customer.email
      })
      .select()
      .single()

    if (transactionError) {
      console.error('Error creating transaction record:', transactionError)
      throw transactionError
    }

    console.log('Transaction record created:', transaction)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})