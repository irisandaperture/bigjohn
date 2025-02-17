
import { Card } from "./ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { useState } from "react";

export const TradingResults = () => {
  const [selectedPairId, setSelectedPairId] = useState<number | null>(null);

  const { data: tradingPairs } = useQuery({
    queryKey: ['trading-pairs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trading_pairs')
        .select('*')
      if (error) throw error;
      return data;
    }
  });

  const { data: backtestResults } = useQuery({
    queryKey: ['backtest-results'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('backtest_results')
        .select(`
          *,
          trading_pairs (
            symbol
          )
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Trading Pairs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {tradingPairs?.map((pair) => (
              <Button
                key={pair.id}
                variant={selectedPairId === pair.id ? "default" : "outline"}
                onClick={() => setSelectedPairId(pair.id)}
                className="w-full"
              >
                {pair.symbol}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Backtest Results</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trading Pair</TableHead>
                  <TableHead>Profit %</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead>Total Trades</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backtestResults?.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.trading_pairs?.symbol}</TableCell>
                    <TableCell>{result.profit_percentage?.toFixed(2)}%</TableCell>
                    <TableCell>{result.win_rate?.toFixed(2)}%</TableCell>
                    <TableCell>{result.total_trades}</TableCell>
                    <TableCell>
                      {new Date(result.created_at!).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Card>
  );
};
