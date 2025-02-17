
import { TradingPairSelector } from "@/components/TradingPairSelector";
import { BacktestControls } from "@/components/BacktestControls";
import { BotControls } from "@/components/BotControls";
import { TradingLogs } from "@/components/TradingLogs";
import { TradingResults } from "@/components/TradingResults";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Trading Bot Dashboard</h1>
          <p className="text-muted-foreground">Automated Trading System</p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <TradingPairSelector />
          </div>
          <div>
            <BacktestControls />
          </div>
          <div>
            <BotControls />
          </div>
        </div>

        <div>
          <TradingResults />
        </div>

        <div>
          <TradingLogs />
        </div>
      </div>
    </div>
  );
};

export default Index;
