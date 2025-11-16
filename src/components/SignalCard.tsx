import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Target, Shield, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Signal {
  ticker: string;
  action: "BUY" | "SELL";
  current_price: number;
  entry_price: number;
  stop_loss: number;
  target_price: number;
  confidence: string;
  freshness: string;
  risk_reward: number;
  hours_since_signal: number;
  price_diff: number;
  signal_time_ist: string;
  timestamp: string;
}

interface SignalCardProps {
  signal: Signal;
}

export const SignalCard = ({ signal }: SignalCardProps) => {
  const isBuy = signal.action === "BUY";
  const priceChange = signal.price_diff;
  const priceChangePercent = ((priceChange / signal.entry_price) * 100).toFixed(2);

  return (
    <Card className={cn(
      "p-5 transition-all hover:shadow-md",
      isBuy ? "border-l-4 border-l-success" : "border-l-4 border-l-danger"
    )}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Left Section - Stock Info */}
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className={cn(
              "p-2 rounded-lg",
              isBuy ? "bg-success/10" : "bg-danger/10"
            )}>
              {isBuy ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-danger" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold font-mono">{signal.ticker}</h3>
                <Badge variant={isBuy ? "default" : "destructive"} className={cn(
                  "text-xs font-semibold",
                  isBuy ? "bg-success text-success-foreground" : "bg-danger text-danger-foreground"
                )}>
                  {signal.action}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono">₹{signal.current_price.toFixed(2)}</span>
                <span className={cn(
                  "font-semibold font-mono",
                  priceChange >= 0 ? "text-success" : "text-danger"
                )}>
                  {priceChange >= 0 ? "+" : ""}{priceChangePercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Price Targets Grid */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Target className="w-3 h-3" />
                Entry
              </p>
              <p className="font-mono font-semibold text-sm">₹{signal.entry_price.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Stop Loss
              </p>
              <p className="font-mono font-semibold text-sm text-danger">₹{signal.stop_loss.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Target className="w-3 h-3" />
                Target
              </p>
              <p className="font-mono font-semibold text-sm text-success">₹{signal.target_price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Right Section - Signal Details */}
        <div className="flex flex-col gap-2 md:items-end">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {signal.confidence}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {signal.freshness}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Risk/Reward:</span>
            <span className="font-bold font-mono">{signal.risk_reward.toFixed(1)}x</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <AlertCircle className="w-3 h-3" />
            <span>{signal.hours_since_signal}h ago</span>
          </div>

          <p className="text-xs text-muted-foreground font-mono mt-1">
            {signal.signal_time_ist}
          </p>
        </div>
      </div>
    </Card>
  );
};
