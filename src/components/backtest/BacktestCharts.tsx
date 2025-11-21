import { Trade } from "@/types/backtest";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface BacktestChartsProps {
  trades: Trade[];
}

export const BacktestCharts = ({ trades }: BacktestChartsProps) => {
  const cumulativePnLData = trades.reduce((acc, trade, idx) => {
    const prevTotal = idx > 0 ? acc[idx - 1].cumulative : 0;
    acc.push({
      trade: `T${idx + 1}`,
      cumulative: prevTotal + trade.pnl,
    });
    return acc;
  }, [] as Array<{ trade: string; cumulative: number }>);

  const winningTrades = trades.filter(t => t.pnl > 0).length;
  const losingTrades = trades.filter(t => t.pnl <= 0).length;
  
  const winLossData = [
    { name: "Winning", value: winningTrades, color: "hsl(var(--success))" },
    { name: "Losing", value: losingTrades, color: "hsl(var(--danger))" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-muted/20 rounded-lg p-4">
        <h3 className="text-[14px] font-semibold mb-3">Cumulative P&L</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={cumulativePnLData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="trade" 
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px"
              }}
              formatter={(value: any) => (typeof value === 'number' ? `₹${value.toFixed(2)}` : `${value}`)}
            />
            <Line 
              type="monotone" 
              dataKey="cumulative" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-muted/20 rounded-lg p-4">
        <h3 className="text-[14px] font-semibold mb-3">Win/Loss Ratio</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={winLossData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {winLossData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--popover))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px"
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: "12px", paddingTop: "15px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
