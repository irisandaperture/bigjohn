
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const BotControls = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const { toast } = useToast();

  const toggleBot = async () => {
    try {
      const response = await supabase.functions.invoke(
        isRunning ? 'stop-bot' : 'start-bot',
        { body: { notifications } }
      );
      
      if (response.error) throw response.error;
      
      setIsRunning(!isRunning);
      toast({
        title: "Success",
        description: `Trading bot ${isRunning ? 'stopped' : 'started'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Trading Bot Controls</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">SMS/Email Notifications</Label>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
        <Button
          onClick={toggleBot}
          variant={isRunning ? "destructive" : "default"}
          className="w-full"
        >
          {isRunning ? "Stop Trading Bot" : "Launch Trading Bot"}
        </Button>
      </div>
    </Card>
  );
};
