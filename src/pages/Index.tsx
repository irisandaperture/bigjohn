
import { PriceChart } from "@/components/PriceChart";
import { OrderBook } from "@/components/OrderBook";
import { StrategyControls } from "@/components/StrategyControls";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Trading Dashboard</h1>
          <p className="text-muted-foreground">VWAP Strategy Bot</p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2">
            <PriceChart />
          </div>
          <div className="space-y-6">
            <OrderBook />
            <StrategyControls />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
