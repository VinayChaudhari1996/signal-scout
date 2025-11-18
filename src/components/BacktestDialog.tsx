import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Trade {
  buy_time: string;
  buy_price: number;
  sell_time: string;
  sell_price: number;
  quantity: number;
  pnl: number;
}

interface BacktestResult {
  ticker: string;
  summary: {
    total_trades: number;
    profit: number;
  };
  advanced_kpis: {
    "max_drawdown_%": number;
  };
  trades: Trade[];
  descriptive_report: string;
}

interface BacktestResponse {
  status: string;
  data_source: string;
  total_stocks: number;
  successful_stocks: number;
  failed_stocks: number;
  results: BacktestResult[];
  aggregate_summary: {
    total_profit: number;
  };
}

interface BacktestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticker: string | null;
  data: BacktestResponse | null;
  isLoading: boolean;
}

export const BacktestDialog = ({
  open,
  onOpenChange,
  ticker,
  data,
  isLoading,
}: BacktestDialogProps) => {
  const result = data?.results?.[0];

  // Only calculate data if result and trades exist
  const cumulativePnLData = result?.trades ? result.trades.reduce((acc, trade, idx) => {
    const prevTotal = idx > 0 ? acc[idx - 1].cumulative : 0;
    acc.push({
      trade: `T${idx + 1}`,
      cumulative: prevTotal + trade.pnl,
    });
    return acc;
  }, [] as Array<{ trade: string; cumulative: number }>) : [];

  // Calculate win/loss ratio data only if trades exist
  const winningTrades = result?.trades?.filter(t => t.pnl > 0).length || 0;
  const losingTrades = result?.trades?.filter(t => t.pnl <= 0).length || 0;
  
  const winLossData = [
    { name: "Winning", value: winningTrades, color: "rgb(34, 197, 94)" },
    { name: "Losing", value: losingTrades, color: "rgb(239, 68, 68)" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-[17px] font-semibold">
            Backtest Report: {ticker}
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            {data?.data_source}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : result ? (
          <ScrollArea className="h-[calc(85vh-120px)]">
            <div className="space-y-6 pr-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-[12px] text-muted-foreground mb-1">
                    Total Trades
                  </div>
                  <div className="text-[20px] font-semibold font-mono">
                    {result.summary.total_trades}
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-[12px] text-muted-foreground mb-1">
                    Total P&L
                  </div>
                  <div
                    className={`text-[20px] font-semibold font-mono ${
                      result.summary.profit >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    ₹{result.summary.profit.toFixed(2)}
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-[12px] text-muted-foreground mb-1">
                    Max Drawdown
                  </div>
                  <div className="text-[20px] font-semibold font-mono text-danger">
                    {result.advanced_kpis?.["max_drawdown_%"] != null 
                      ? `${result.advanced_kpis["max_drawdown_%"].toFixed(2)}%`
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              {result?.trades && result.trades.length > 0 && cumulativePnLData.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Cumulative P&L Chart */}
                  <div className="bg-muted/20 rounded-lg p-4">
                    <h3 className="text-[14px] font-semibold mb-3">Cumulative P&L</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={cumulativePnLData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                        <XAxis 
                          dataKey="trade" 
                          tick={{ fontSize: 11, fill: "rgb(156, 163, 175)" }}
                        />
                        <YAxis 
                          tick={{ fontSize: 11, fill: "rgb(156, 163, 175)" }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "rgba(0, 0, 0, 0.8)", 
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "12px"
                          }}
                          formatter={(value: any) => `₹${value.toFixed(2)}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cumulative" 
                          stroke="rgb(99, 102, 241)" 
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Win/Loss Ratio Chart */}
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
                            backgroundColor: "rgba(0, 0, 0, 0.8)", 
                            border: "none",
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
              )}

              {/* Descriptive Report */}
              {result.descriptive_report && (
                <div className="bg-muted/20 rounded-lg p-4">
                  <h3 className="text-[14px] font-semibold mb-2">Analysis</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {result.descriptive_report}
                  </p>
                </div>
              )}

              {/* Trades Table */}
              {result.trades && result.trades.length > 0 && (
                <div>
                  <h3 className="text-[14px] font-semibold mb-3">
                    Trade History
                  </h3>
                  <div className="border border-border/50 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-[12px]">
                        <thead>
                          <tr className="bg-muted/30 border-b border-border/50">
                            <th className="text-left p-3 font-medium">Buy Time</th>
                            <th className="text-right p-3 font-medium">Buy Price</th>
                            <th className="text-left p-3 font-medium">Sell Time</th>
                            <th className="text-right p-3 font-medium">Sell Price</th>
                            <th className="text-center p-3 font-medium">Qty</th>
                            <th className="text-right p-3 font-medium">P&L</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.trades.map((trade, idx) => (
                            <tr
                              key={idx}
                              className="border-b border-border/30 hover:bg-muted/20"
                            >
                              <td className="p-3 font-mono text-[11px]">
                                {new Date(trade.buy_time).toLocaleString("en-IN", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </td>
                              <td className="p-3 text-right font-mono">
                                ₹{trade.buy_price.toFixed(2)}
                              </td>
                              <td className="p-3 font-mono text-[11px]">
                                {new Date(trade.sell_time).toLocaleString("en-IN", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })}
                              </td>
                              <td className="p-3 text-right font-mono">
                                ₹{trade.sell_price.toFixed(2)}
                              </td>
                              <td className="p-3 text-center font-mono">
                                {trade.quantity}
                              </td>
                              <td
                                className={`p-3 text-right font-mono font-semibold ${
                                  trade.pnl >= 0 ? "text-success" : "text-danger"
                                }`}
                              >
                                {trade.pnl >= 0 ? "+" : ""}₹{trade.pnl.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12 text-muted-foreground text-[13px]">
            No backtest data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
