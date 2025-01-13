import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log('Payout webhook function initialized')

serve(async (req) => {
  // Log every incoming request
  console.log('Received payout webhook request:', {
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
    if (payload.event !== 'payout.success' && payload.event !== 'payout.failed') {
      console.log('Event ignored:', payload.event)
      return new Response(JSON.stringify({ message: 'Event ignored' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    const payoutData = payload.data
    console.log('Payout data:', payoutData)

    // Mettre à jour le statut du payout
    const { error: payoutError } = await supabaseClient
      .from('payouts')
      .update({
        status: payload.event === 'payout.success' ? 'completed' : 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('moneroo_payout_id', payoutData.id)

    if (payoutError) {
      console.error('Error updating payout:', payoutError)
      throw payoutError
    }

    // Si le payout est réussi, mettre à jour le wallet
    if (payload.event === 'payout.success') {
      // Récupérer le payout
      const { data: payout, error: getPayoutError } = await supabaseClient
        .from('payouts')
        .select('user_id, amount')
        .eq('moneroo_payout_id', payoutData.id)
        .single()

      if (getPayoutError) {
        console.error('Error fetching payout:', getPayoutError)
        throw getPayoutError
      }

      // Mettre à jour le wallet
      const { error: walletError } = await supabaseClient
        .from('wallets')
        .update({
          available: supabaseClient.sql`available - ${payout.amount}`,
          validated: supabaseClient.sql`validated + ${payout.amount}`,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', payout.user_id)

      if (walletError) {
        console.error('Error updating wallet:', walletError)
        throw walletError
      }

      // Mettre à jour les statistiques utilisateur
      const { error: statsError } = await supabaseClient
        .from('user_stats')
        .update({
          available_balance: supabaseClient.sql`available_balance - ${payout.amount}`,
          validated_requests: supabaseClient.sql`validated_requests + 1`,
          pending_requests: supabaseClient.sql`pending_requests - 1`,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', payout.user_id)

      if (statsError) {
        console.error('Error updating user stats:', statsError)
        throw statsError
      }
    }

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