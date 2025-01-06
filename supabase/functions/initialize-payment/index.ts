import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  amount: number;
  description: string;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  payment_method: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, description, customer, payment_method } = await req.json() as PaymentRequest
    console.log('Initializing payment with Moneroo:', { amount, description, customer, payment_method })

    const monerooToken = Deno.env.get('MONEROO_SECRET_KEY')
    if (!monerooToken) {
      console.error('Missing Moneroo configuration')
      throw new Error('Configuration Moneroo manquante')
    }

    // Initialiser le paiement avec Moneroo
    const monerooResponse = await fetch('https://api.moneroo.io/v1/payments/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${monerooToken}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        currency: "XOF",
        description: description,
        customer: customer,
        method: payment_method
      })
    })

    const responseText = await monerooResponse.text()
    console.log('Raw Moneroo response:', responseText)

    let monerooData
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

    return new Response(
      JSON.stringify(monerooData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Payment initialization error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})