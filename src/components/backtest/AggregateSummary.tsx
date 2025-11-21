import { AggregateSummary as AggregateSummaryType } from "@/types/backtest";

interface AggregateSummaryProps {
  aggregate: AggregateSummaryType;
}

export const AggregateSummary = ({ aggregate }: AggregateSummaryProps) => {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border border-border/50">
      <h3 className="text-[16px] font-semibold mb-4">Aggregate Portfolio Summary</h3>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-background/50 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Total Stocks</div>
          <div className="text-[18px] font-bold font-mono">{aggregate.total_stocks_analyzed}</div>
        </div>
        <div className="bg-background/50 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Total Trades</div>
          <div className="text-[18px] font-bold font-mono">{aggregate.total_trades_all_stocks}</div>
        </div>
        <div className="bg-background/50 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Win Rate</div>
          <div className="text-[18px] font-bold font-mono text-success">
            {aggregate["aggregate_win_rate_%"]?.toFixed(2)}%
          </div>
        </div>
        <div className="bg-background/50 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Total Profit</div>
          <div className={`text-[18px] font-bold font-mono ${aggregate.total_profit_all_stocks >= 0 ? "text-success" : "text-danger"}`}>
            ₹{aggregate.total_profit_all_stocks?.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background/50 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Winning / Losing Trades</div>
          <div className="text-[16px] font-semibold font-mono">
            <span className="text-success">{aggregate.total_winning_trades}</span> / <span className="text-danger">{aggregate.total_losing_trades}</span>
          </div>
        </div>
        <div className="bg-background/50 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Aggregate Return</div>
          <div className={`text-[16px] font-semibold font-mono ${aggregate["aggregate_return_%"] >= 0 ? "text-success" : "text-danger"}`}>
            {aggregate["aggregate_return_%"]?.toFixed(2)}%
          </div>
        </div>
        <div className="bg-background/50 rounded-lg p-3">
          <div className="text-[11px] text-muted-foreground mb-1">Ending Capital</div>
          <div className="text-[16px] font-semibold font-mono">
            ₹{aggregate.aggregate_ending_capital?.toFixed(2)}
          </div>
        </div>
      </div>

      {aggregate.failed_stocks > 0 && (
        <div className="mt-4 p-3 bg-danger/10 rounded-lg border border-danger/20">
          <div className="text-[12px] font-semibold text-danger mb-1">
            Failed Stocks: {aggregate.failed_stocks}
          </div>
          {aggregate.failed_stocks_details.length > 0 && (
            <div className="text-[11px] text-muted-foreground">
              {aggregate.failed_stocks_details.join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
