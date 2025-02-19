
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const BINANCE_API_KEY = Deno.env.get('BINANCE_API_KEY')
    const BINANCE_SECRET_KEY = Deno.env.get('BINANCE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!BINANCE_API_KEY || !BINANCE_SECRET_KEY) {
      throw new Error('Missing Binance API credentials')
    }

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch trading pairs from Binance
    const response = await fetch('https://api.binance.us/api/v3/exchangeInfo')
    const data = await response.json()

    // Filter for USDT pairs
    const usdtPairs = data.symbols.filter(
      (symbol: any) => symbol.status === 'TRADING' && symbol.quoteAsset === 'USDT'
    )

    console.log(`Found ${usdtPairs.length} USDT trading pairs`)

    // Store pairs in the database
    for (const pair of usdtPairs) {
      const { error } = await supabase
        .from('trading_pairs')
        .upsert(
          { 
            symbol: pair.symbol,
            last_updated: new Date().toISOString()
          },
          { 
            onConflict: 'symbol'
          }
        )
      
      if (error) {
        console.error('Error storing pair:', pair.symbol, error)
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Trading pairs retrieved and stored successfully',
        count: usdtPairs.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error: any) {
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
