
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const TradingPairSelector = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchTradingPairs = async () => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('fetch-trading-pairs');
      if (response.error) throw response.error;
      
      // Refresh the trading pairs data
      await queryClient.invalidateQueries({ queryKey: ['trading-pairs'] });
      
      toast({
        title: "Success",
        description: "Trading pairs retrieved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Trading Pair Selection</h2>
      <Button 
        onClick={fetchTradingPairs} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Retrieving Pairs..." : "Fetch USDT Trading Pairs"}
      </Button>
    </Card>
  );
};
