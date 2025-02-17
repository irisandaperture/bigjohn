
import { Card } from "./ui/card";

const orders = [
  { price: 41500, size: 2.5, type: "buy" },
  { price: 41400, size: 1.8, type: "buy" },
  { price: 41300, size: 3.2, type: "buy" },
  { price: 41600, size: 1.5, type: "sell" },
  { price: 41700, size: 2.1, type: "sell" },
  { price: 41800, size: 1.7, type: "sell" },
];

export const OrderBook = () => {
  return (
    <Card className="trading-card animate-slide-in">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Order Book</h2>
      <div className="space-y-2">
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded bg-white/5"
          >
            <span
              className={`font-medium ${
                order.type === "buy" ? "text-trading-success" : "text-trading-error"
              }`}
            >
              ${order.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">{order.size} BTC</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
