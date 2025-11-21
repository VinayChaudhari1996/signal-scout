import { SignalPredictability as SignalPredictabilityType } from "@/types/backtest";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SignalPredictabilityProps {
  data: SignalPredictabilityType;
}

export const SignalPredictability = ({ data }: SignalPredictabilityProps) => {
  const renderSignalTable = (signals: any, type: "BUY" | "SELL") => {
    const isBuy = type === "BUY";
    return (
      <div className="bg-muted/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          {isBuy ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-danger" />
          )}
          <h4 className="text-[13px] font-semibold">{type} Signals ({signals.count})</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-2 font-medium">Candles</th>
                <th className="text-right p-2 font-medium">Avg Return</th>
                <th className="text-right p-2 font-medium">Std Dev</th>
                <th className="text-right p-2 font-medium">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(signals.performance).map(([key, value]: [string, any]) => (
                <tr key={key} className="border-b border-border/30">
                  <td className="p-2 font-mono">{key.replace("_candles", "")}</td>
                  <td className={`p-2 text-right font-mono font-semibold ${value["avg_return_%"] >= 0 ? "text-success" : "text-danger"}`}>
                    {value["avg_return_%"]?.toFixed(2)}%
                  </td>
                  <td className="p-2 text-right font-mono">{value["std_dev_%"]?.toFixed(2)}%</td>
                  <td className="p-2 text-right font-mono">{value["win_rate_%"]?.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[14px] font-semibold mb-3">Signal Predictability Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          {renderSignalTable(data.buy_signals, "BUY")}
          {renderSignalTable(data.sell_signals, "SELL")}
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="text-[13px] font-semibold mb-3">Trade Pairs Analysis</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-[11px] text-muted-foreground mb-1">Consistency</div>
            <div className="text-[14px] font-semibold">{data.overall_consistency}</div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-1">Stability Score</div>
            <div className="text-[14px] font-semibold font-mono">
              {data.trade_pairs_analysis.stability_score?.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-1">Pattern</div>
            <div className="text-[14px] font-semibold">{data.trade_pairs_analysis.pattern_insight}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-3">
          <div>
            <div className="text-[11px] text-muted-foreground mb-1">P&L Mean</div>
            <div className="text-[13px] font-semibold font-mono">
              ₹{data.trade_pairs_analysis.pnl_mean?.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-1">P&L Std Dev</div>
            <div className="text-[13px] font-semibold font-mono">
              ₹{data.trade_pairs_analysis.pnl_std_dev?.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-1">Coefficient of Variation</div>
            <div className="text-[13px] font-semibold font-mono">
              {data.trade_pairs_analysis.coefficient_of_variation?.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
