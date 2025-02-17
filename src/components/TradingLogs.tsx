
import { Card } from "./ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TradingLog {
  id: number;
  action: string;
  price: number;
  quantity: number;
  timestamp: string;
  status: string;
  message: string;
}

export const TradingLogs = () => {
  const [logs, setLogs] = useState<TradingLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from('trading_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (!error && data) {
        setLogs(data);
      }
    };

    fetchLogs();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('trading_logs_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trading_logs',
        },
        (payload) => {
          setLogs(prevLogs => [payload.new as TradingLog, ...prevLogs].slice(0, 50));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Trading Activity Log</h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-3 bg-muted rounded-lg text-sm"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium">{log.action}</span>
              <span className="text-muted-foreground">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="text-muted-foreground">
              Price: {log.price} | Quantity: {log.quantity}
            </div>
            {log.message && (
              <div className="mt-1 text-muted-foreground">{log.message}</div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
