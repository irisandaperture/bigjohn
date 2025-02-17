
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

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch trading pairs from our database
    const { data: tradingPairs, error: pairsError } = await supabase
      .from('trading_pairs')
      .select('*')

    if (pairsError) throw pairsError

    // For each pair, fetch historical data and run backtest
    for (const pair of tradingPairs) {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - 1) // Last month of data

      // Fetch historical data from Binance
      const klines = await fetch(
        `https://api.binance.us/api/v3/klines?symbol=${pair.symbol}&interval=1h&startTime=${startDate.getTime()}`
      )
      const klinesData = await klines.json()

      // Simple example strategy: Buy if price increases by 1%, sell if decreases by 1%
      let balance = 1000 // Starting with $1000 USDT
      let position = 0
      let trades = 0
      let wins = 0

      for (let i = 1; i < klinesData.length; i++) {
        const prevClose = parseFloat(klinesData[i-1][4])
        const currentClose = parseFloat(klinesData[i][4])
        const priceChange = (currentClose - prevClose) / prevClose

        if (priceChange >= 0.01 && position === 0) { // Buy signal
          position = balance / currentClose
          balance = 0
          trades++
        } else if (priceChange <= -0.01 && position > 0) { // Sell signal
          balance = position * currentClose
          if (balance > 1000) wins++
          position = 0
          trades++
        }
      }

      // Calculate final results
      const finalBalance = balance + (position * parseFloat(klinesData[klinesData.length-1][4]))
      const profitPercentage = ((finalBalance - 1000) / 1000) * 100
      const winRate = trades > 0 ? (wins / trades) * 100 : 0

      // Save backtest results
      await supabase
        .from('backtest_results')
        .insert({
          trading_pair_id: pair.id,
          start_date: startDate.toISOString(),
          end_date: new Date().toISOString(),
          profit_percentage: profitPercentage,
          total_trades: trades,
          win_rate: winRate
        })

      console.log(`Completed backtest for ${pair.symbol}:`, {
        profitPercentage,
        trades,
        winRate
      })
    }

    return new Response(
      JSON.stringify({ message: 'Backtesting completed successfully' }),
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
