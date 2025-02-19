
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

    if (!BINANCE_API_KEY || !BINANCE_SECRET_KEY) {
      throw new Error('Missing Binance API credentials')
    }

    // Implement Binance API call to fetch USDT trading pairs
    const response = await fetch('https://api.binance.us/api/v3/exchangeInfo')
    const data = await response.json()

    // Filter for USDT pairs
    const usdtPairs = data.symbols.filter(
      (symbol: any) => symbol.status === 'TRADING' && symbol.quoteAsset === 'USDT'
    )

    console.log(`Found ${usdtPairs.length} USDT trading pairs`)

    return new Response(
      JSON.stringify({ pairs: usdtPairs }),
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
