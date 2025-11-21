import { useState } from "react";
import { Trade } from "@/types/backtest";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TradesListProps {
  trades: Trade[];
}

export const TradesList = ({ trades }: TradesListProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (idx: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx);
    } else {
      newExpanded.add(idx);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div>
      <h3 className="text-[14px] font-semibold mb-3">Trade History</h3>
      <div className="border border-border/50 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="text-left p-3 font-medium w-8"></th>
                <th className="text-left p-3 font-medium">Buy Time</th>
                <th className="text-right p-3 font-medium">Buy Price</th>
                <th className="text-left p-3 font-medium">Sell Time</th>
                <th className="text-right p-3 font-medium">Sell Price</th>
                <th className="text-center p-3 font-medium">Qty</th>
                <th className="text-right p-3 font-medium">Gross P&L</th>
                <th className="text-right p-3 font-medium">Fees</th>
                <th className="text-right p-3 font-medium">Net P&L</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, idx) => (
                <>
                  <tr
                    key={idx}
                    className={cn(
                      "border-b border-border/30 hover:bg-muted/20 cursor-pointer transition-colors",
                      trade.fees_breakdown && "cursor-pointer"
                    )}
                    onClick={() => trade.fees_breakdown && toggleRow(idx)}
                  >
                    <td className="p-3">
                      {trade.fees_breakdown && (
                        expandedRows.has(idx) ? 
                          <ChevronDown className="w-4 h-4 text-muted-foreground" /> : 
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      {new Date(trade.buy_time).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="p-3 text-right font-mono">
                      ₹{trade.buy_price?.toFixed(2)}
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      {new Date(trade.sell_time).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="p-3 text-right font-mono">
                      ₹{trade.sell_price?.toFixed(2)}
                    </td>
                    <td className="p-3 text-center font-mono">
                      {trade.quantity}
                    </td>
                    <td className={cn(
                      "p-3 text-right font-mono font-semibold",
                      trade.gross_pnl && trade.gross_pnl >= 0 ? "text-success" : "text-danger"
                    )}>
                      {trade.gross_pnl ? `₹${trade.gross_pnl.toFixed(2)}` : "—"}
                    </td>
                    <td className="p-3 text-right font-mono text-muted-foreground">
                      {trade.fees_total ? `₹${trade.fees_total.toFixed(2)}` : "—"}
                    </td>
                    <td className={cn(
                      "p-3 text-right font-mono font-semibold",
                      trade.pnl >= 0 ? "text-success" : "text-danger"
                    )}>
                      {trade.pnl >= 0 ? "+" : ""}₹{trade.pnl?.toFixed(2)}
                    </td>
                  </tr>
                  {expandedRows.has(idx) && trade.fees_breakdown && (
                    <tr className="bg-muted/10">
                      <td colSpan={9} className="p-4">
                        <div className="text-[11px]">
                          <div className="font-semibold mb-2 text-muted-foreground">Fee Breakdown</div>
                          <div className="grid grid-cols-5 gap-3">
                            <div>
                              <div className="text-muted-foreground mb-0.5">Brokerage (Buy)</div>
                              <div className="font-mono">₹{trade.fees_breakdown.brokerage_buy.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-0.5">Brokerage (Sell)</div>
                              <div className="font-mono">₹{trade.fees_breakdown.brokerage_sell.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-0.5">STT</div>
                              <div className="font-mono">₹{trade.fees_breakdown.stt.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-0.5">Transaction</div>
                              <div className="font-mono">₹{trade.fees_breakdown.transaction.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-0.5">SEBI</div>
                              <div className="font-mono">₹{trade.fees_breakdown.sebi.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-0.5">GST</div>
                              <div className="font-mono">₹{trade.fees_breakdown.gst.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-0.5">Stamp Duty</div>
                              <div className="font-mono">₹{trade.fees_breakdown.stamp.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-0.5">DP Charges</div>
                              <div className="font-mono">₹{trade.fees_breakdown.dp.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-0.5">Exchange</div>
                              <div className="font-semibold">{trade.fees_breakdown.exchange}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground mb-0.5">Total Fees</div>
                              <div className="font-mono font-semibold">₹{trade.fees_breakdown.total.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
