
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const BacktestControls = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startBacktest = async () => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('run-backtest');
      if (response.error) throw response.error;
      
      // Refresh the backtest results data
      await queryClient.invalidateQueries({ queryKey: ['backtest-results'] });
      
      toast({
        title: "Success",
        description: "Backtesting completed successfully",
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
      <h2 className="text-lg font-semibold mb-4">Backtesting Controls</h2>
      <Button 
        onClick={startBacktest} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Running Backtest..." : "Start Backtesting"}
      </Button>
    </Card>
  );
};
