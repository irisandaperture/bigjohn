
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "./ui/card";

const data = [
  { time: "00:00", price: 40000, vwap: 39800 },
  { time: "01:00", price: 40500, vwap: 40200 },
  { time: "02:00", price: 41000, vwap: 40600 },
  { time: "03:00", price: 40800, vwap: 40700 },
  { time: "04:00", price: 41200, vwap: 40900 },
  { time: "05:00", price: 41500, vwap: 41100 },
  { time: "06:00", price: 41300, vwap: 41200 },
  { time: "07:00", price: 41600, vwap: 41300 },
];

export const PriceChart = () => {
  return (
    <Card className="p-6 trading-card animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">BTC/USDT</h2>
        <span className="text-sm text-muted-foreground">VWAP Strategy</span>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.8)",
                border: "none",
                borderRadius: "8px",
                backdropFilter: "blur(4px)",
              }}
              itemStyle={{ color: "#E2E8F0" }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#8B5CF6"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
            <Area
              type="monotone"
              dataKey="vwap"
              stroke="#E2E8F0"
              strokeDasharray="5 5"
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
