import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
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
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6 pr-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-[12px] text-muted-foreground mb-1">Total Trades</div>
                  <div className="text-[20px] font-semibold font-mono">
                    {result.summary.total_trades}
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-[12px] text-muted-foreground mb-1">Total P&L</div>
                  <div className={`text-[20px] font-semibold font-mono ${
                    result.summary.profit >= 0 ? "text-success" : "text-danger"
                  }`}>
                    ₹{result.summary.profit.toFixed(2)}
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="text-[12px] text-muted-foreground mb-1">Max Drawdown</div>
                  <div className="text-[20px] font-semibold font-mono text-danger">
                    {result.advanced_kpis["max_drawdown_%"]?.toFixed(2)}%
                  </div>
                </div>
              </div>

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
                  <h3 className="text-[14px] font-semibold mb-3">Trade History</h3>
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
                                {new Date(trade.buy_time).toLocaleString('en-IN', {
                                  dateStyle: 'short',
                                  timeStyle: 'short'
                                })}
                              </td>
                              <td className="p-3 text-right font-mono">₹{trade.buy_price.toFixed(2)}</td>
                              <td className="p-3 font-mono text-[11px]">
                                {new Date(trade.sell_time).toLocaleString('en-IN', {
                                  dateStyle: 'short',
                                  timeStyle: 'short'
                                })}
                              </td>
                              <td className="p-3 text-right font-mono">₹{trade.sell_price.toFixed(2)}</td>
                              <td className="p-3 text-center font-mono">{trade.quantity}</td>
                              <td className={`p-3 text-right font-mono font-semibold ${
                                trade.pnl >= 0 ? "text-success" : "text-danger"
                              }`}>
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
