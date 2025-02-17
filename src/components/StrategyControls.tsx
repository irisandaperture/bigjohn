
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export const StrategyControls = () => {
  return (
    <Card className="trading-card animate-fade-in">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Strategy Controls</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="vwap-strategy">VWAP Strategy</Label>
          <Switch id="vwap-strategy" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-trade">Auto Trading</Label>
          <Switch id="auto-trade" />
        </div>
        <div className="mt-6 space-y-2">
          <Button className="w-full bg-trading-accent hover:bg-trading-accent/90">
            Start Trading
          </Button>
          <Button
            variant="outline"
            className="w-full border-trading-accent/20 hover:bg-trading-accent/10"
          >
            Stop Trading
          </Button>
        </div>
      </div>
    </Card>
  );
};
