
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import twilio from 'npm:twilio'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { notifications } = await req.json()
    
    const BINANCE_API_KEY = Deno.env.get('BINANCE_API_KEY')
    const BINANCE_SECRET_KEY = Deno.env.get('BINANCE_SECRET_KEY')
    const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
    const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!BINANCE_API_KEY || !BINANCE_SECRET_KEY) {
      throw new Error('Missing Binance API credentials')
    }

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    // Get the best performing pair from backtest results
    const { data: bestPair, error: pairError } = await supabase
      .from('backtest_results')
      .select('*, trading_pairs(*)')
      .order('profit_percentage', { ascending: false })
      .limit(1)
      .single()

    if (pairError) throw pairError

    // Log bot start
    await supabase
      .from('trading_logs')
      .insert({
        trading_pair_id: bestPair.trading_pair_id,
        action: 'BOT_START',
        message: `Starting trading bot for ${bestPair.trading_pairs.symbol}`
      })

    if (notifications && TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      await twilioClient.messages.create({
        body: `Trading bot started for ${bestPair.trading_pairs.symbol}`,
        to: '+16156533833',  // User's phone number
        from: '+18334070795' // Twilio phone number
      })
    }

    return new Response(
      JSON.stringify({ 
        message: 'Trading bot started successfully',
        pair: bestPair.trading_pairs.symbol
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
