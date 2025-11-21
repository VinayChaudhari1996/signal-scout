import { BacktestSummary, AdvancedKPIs } from "@/types/backtest";

interface BacktestSummaryStatsProps {
  summary: BacktestSummary;
  advancedKpis: AdvancedKPIs;
}

export const BacktestSummaryStats = ({ summary, advancedKpis }: BacktestSummaryStatsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="text-[12px] text-muted-foreground mb-1">Total Trades</div>
          <div className="text-[20px] font-semibold font-mono">{summary["Total Trades"]}</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="text-[12px] text-muted-foreground mb-1">Win Rate</div>
          <div className="text-[20px] font-semibold font-mono text-success">
            {summary["Win Rate (%)"]?.toFixed(2)}%
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="text-[12px] text-muted-foreground mb-1">Total P&L</div>
          <div className={`text-[20px] font-semibold font-mono ${summary["Total Profit (₹)"] >= 0 ? "text-success" : "text-danger"}`}>
            ₹{summary["Total Profit (₹)"]?.toFixed(2)}
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="text-[12px] text-muted-foreground mb-1">Overall Return</div>
          <div className={`text-[20px] font-semibold font-mono ${summary["Overall Return (%)"] >= 0 ? "text-success" : "text-danger"}`}>
            {summary["Overall Return (%)"]?.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Winning / Losing</div>
          <div className="text-[16px] font-semibold font-mono">
            <span className="text-success">{summary["Winning Trades"]}</span> / <span className="text-danger">{summary["Losing Trades"]}</span>
          </div>
        </div>
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Profit Factor</div>
          <div className="text-[16px] font-semibold font-mono">{summary["Profit Factor"]?.toFixed(2)}</div>
        </div>
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Risk/Reward</div>
          <div className="text-[16px] font-semibold font-mono">{summary["Risk-Reward Ratio"]?.toFixed(2)}x</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Avg Win</div>
          <div className="text-[14px] font-semibold font-mono text-success">
            ₹{summary["Average Win (₹)"]?.toFixed(2)}
          </div>
        </div>
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Avg Loss</div>
          <div className="text-[14px] font-semibold font-mono text-danger">
            ₹{summary["Average Loss (₹)"]?.toFixed(2)}
          </div>
        </div>
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Expectancy</div>
          <div className="text-[14px] font-semibold font-mono">
            ₹{summary["Expectancy (₹)"]?.toFixed(2)}
          </div>
        </div>
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Max Drawdown</div>
          <div className="text-[14px] font-semibold font-mono text-danger">
            {advancedKpis["Max Drawdown"] ? `₹${advancedKpis["Max Drawdown"]?.toFixed(2)}` : `${summary["Max Drawdown (%)"]?.toFixed(2)}%`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Ending Capital</div>
          <div className="text-[14px] font-semibold font-mono">
            ₹{summary["Ending Capital (₹)"]?.toFixed(2)}
          </div>
        </div>
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Total Fees</div>
          <div className="text-[14px] font-semibold font-mono text-muted-foreground">
            ₹{summary["Total Fees (₹)"]?.toFixed(2)}
          </div>
        </div>
        <div className="bg-muted/20 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Duration</div>
          <div className="text-[14px] font-semibold font-mono">
            {summary["Duration (Days)"]} days ({summary["Duration (Months)"]}m)
          </div>
        </div>
      </div>
    </div>
  );
};
