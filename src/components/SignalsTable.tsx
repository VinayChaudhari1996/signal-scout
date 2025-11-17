import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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

type SortField = 'ticker' | 'current_price' | 'entry_price' | 'risk_reward' | 'hours_since_signal';
type SortDirection = 'asc' | 'desc' | null;

export const SignalsTable = ({ signals }: SignalsTableProps) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  if (signals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-[13px]">
        No signals found
      </div>
    );
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSignals = [...signals].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-40" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3.5 h-3.5 ml-1 opacity-70" />;
    }
    return <ArrowDown className="w-3.5 h-3.5 ml-1 opacity-70" />;
  };

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead 
              className="font-medium text-[12px] cursor-pointer select-none h-9"
              onClick={() => handleSort('ticker')}
            >
              <div className="flex items-center">
                Ticker
                <SortIcon field="ticker" />
              </div>
            </TableHead>
            <TableHead className="font-medium text-[12px] h-9">Action</TableHead>
            <TableHead 
              className="font-medium text-[12px] text-right cursor-pointer select-none h-9"
              onClick={() => handleSort('current_price')}
            >
              <div className="flex items-center justify-end">
                Current
                <SortIcon field="current_price" />
              </div>
            </TableHead>
            <TableHead 
              className="font-medium text-[12px] text-right cursor-pointer select-none h-9"
              onClick={() => handleSort('entry_price')}
            >
              <div className="flex items-center justify-end">
                Entry
                <SortIcon field="entry_price" />
              </div>
            </TableHead>
            <TableHead className="font-medium text-[12px] text-right h-9">Stop Loss</TableHead>
            <TableHead className="font-medium text-[12px] text-right h-9">Target</TableHead>
            <TableHead 
              className="font-medium text-[12px] text-center cursor-pointer select-none h-9"
              onClick={() => handleSort('risk_reward')}
            >
              <div className="flex items-center justify-center">
                R/R
                <SortIcon field="risk_reward" />
              </div>
            </TableHead>
            <TableHead className="font-medium text-[12px] text-center h-9">Confidence</TableHead>
            <TableHead className="font-medium text-[12px] text-center h-9">Freshness</TableHead>
            <TableHead 
              className="font-medium text-[12px] cursor-pointer select-none h-9"
              onClick={() => handleSort('hours_since_signal')}
            >
              <div className="flex items-center">
                Time
                <SortIcon field="hours_since_signal" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSignals.map((signal, index) => {
            const isBuy = signal.action === "BUY";
            const priceChange = signal.price_diff;
            const priceChangePercent = ((priceChange / signal.entry_price) * 100).toFixed(2);

            return (
              <TableRow 
                key={`${signal.ticker}-${index}`}
                className={cn(
                  "hover:bg-muted/20 transition-colors h-12",
                  isBuy ? "border-l-2 border-l-success" : "border-l-2 border-l-danger"
                )}
              >
                <TableCell className="font-mono font-semibold text-[13px]">
                  {signal.ticker}
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant={isBuy ? "default" : "destructive"} 
                    className={cn(
                      "font-medium text-[11px] h-5 px-2",
                      isBuy ? "bg-success hover:bg-success text-success-foreground" : "bg-danger hover:bg-danger text-danger-foreground"
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
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="font-mono font-semibold text-[13px]">₹{signal.current_price.toFixed(2)}</span>
                    <span className={cn(
                      "text-[11px] font-mono font-medium",
                      priceChange >= 0 ? "text-success" : "text-danger"
                    )}>
                      {priceChange >= 0 ? "+" : ""}{priceChangePercent}%
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right font-mono text-[13px]">
                  ₹{signal.entry_price.toFixed(2)}
                </TableCell>

                <TableCell className="text-right font-mono text-[13px] text-danger font-medium">
                  ₹{signal.stop_loss.toFixed(2)}
                </TableCell>

                <TableCell className="text-right font-mono text-[13px] text-success font-medium">
                  ₹{signal.target_price.toFixed(2)}
                </TableCell>

                <TableCell className="text-center font-mono font-semibold text-[13px]">
                  {signal.risk_reward.toFixed(1)}x
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="outline" className="text-[11px] h-5 px-2 font-normal">
                    {signal.confidence}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <Badge variant="outline" className="text-[11px] h-5 px-2 font-normal">
                    {signal.freshness}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col text-[12px] gap-0.5">
                    <span className="font-mono">{signal.signal_time_ist}</span>
                    <span className="text-muted-foreground text-[11px]">{signal.hours_since_signal}h ago</span>
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
