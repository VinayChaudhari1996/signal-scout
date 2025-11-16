import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
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

interface SignalsTableProps {
  signals: Signal[];
}

export const SignalsTable = ({ signals }: SignalsTableProps) => {
  if (signals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No signals found
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Ticker</TableHead>
            <TableHead className="font-semibold">Action</TableHead>
            <TableHead className="font-semibold text-right">Current Price</TableHead>
            <TableHead className="font-semibold text-right">Entry Price</TableHead>
            <TableHead className="font-semibold text-right">Stop Loss</TableHead>
            <TableHead className="font-semibold text-right">Target</TableHead>
            <TableHead className="font-semibold text-center">R/R Ratio</TableHead>
            <TableHead className="font-semibold text-center">Confidence</TableHead>
            <TableHead className="font-semibold text-center">Freshness</TableHead>
            <TableHead className="font-semibold">Signal Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signals.map((signal, index) => {
            const isBuy = signal.action === "BUY";
            const priceChange = signal.price_diff;
            const priceChangePercent = ((priceChange / signal.entry_price) * 100).toFixed(2);

            return (
              <TableRow 
                key={`${signal.ticker}-${index}`}
                className={cn(
                  "hover:bg-muted/50 transition-colors",
                  isBuy ? "border-l-4 border-l-success" : "border-l-4 border-l-danger"
                )}
              >
                <TableCell className="font-mono font-bold">
                  {signal.ticker}
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant={isBuy ? "default" : "destructive"} 
                    className={cn(
                      "font-semibold",
                      isBuy ? "bg-success text-success-foreground" : "bg-danger text-danger-foreground"
                    )}
                  >
                    {isBuy ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {signal.action}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-mono font-semibold">₹{signal.current_price.toFixed(2)}</span>
                    <span className={cn(
                      "text-xs font-mono font-semibold",
                      priceChange >= 0 ? "text-success" : "text-danger"
                    )}>
                      {priceChange >= 0 ? "+" : ""}{priceChangePercent}%
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right font-mono">
                  ₹{signal.entry_price.toFixed(2)}
                </TableCell>

                <TableCell className="text-right font-mono text-danger font-semibold">
                  ₹{signal.stop_loss.toFixed(2)}
                </TableCell>

                <TableCell className="text-right font-mono text-success font-semibold">
                  ₹{signal.target_price.toFixed(2)}
                </TableCell>

                <TableCell className="text-center font-mono font-bold">
                  {signal.risk_reward.toFixed(1)}x
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="outline" className="text-xs">
                    {signal.confidence}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="outline" className="text-xs">
                    {signal.freshness}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col text-xs">
                    <span className="font-mono">{signal.signal_time_ist}</span>
                    <span className="text-muted-foreground">{signal.hours_since_signal}h ago</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
