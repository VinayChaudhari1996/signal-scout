import { StrategyRating as StrategyRatingType } from "@/types/backtest";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StrategyRatingProps {
  rating: StrategyRatingType;
}

export const StrategyRating = ({ rating }: StrategyRatingProps) => {
  const getRatingColor = (score: number) => {
    if (score >= 9) return "text-success";
    if (score >= 7) return "text-primary";
    if (score >= 5) return "text-muted-foreground";
    return "text-danger";
  };

  const getRatingBg = (score: number) => {
    if (score >= 9) return "bg-success/10";
    if (score >= 7) return "bg-primary/10";
    if (score >= 5) return "bg-muted/30";
    return "bg-danger/10";
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-6 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[16px] font-semibold mb-1">Strategy Rating</h3>
            <p className="text-[12px] text-muted-foreground">{rating.rating_category}</p>
          </div>
          <div className="text-right">
            <div className={`text-[32px] font-bold ${getRatingColor(rating.overall_rating)}`}>
              {rating.overall_rating.toFixed(1)}
            </div>
            <div className="text-[11px] text-muted-foreground">out of 10</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-2">
          <Badge variant="outline" className="text-[11px]">
            <TrendingUp className="w-3 h-3 mr-1 text-success" />
            {rating.key_strength}
          </Badge>
          <Badge variant="outline" className="text-[11px]">
            <TrendingDown className="w-3 h-3 mr-1 text-danger" />
            {rating.key_weakness}
          </Badge>
        </div>
        <div className="text-[12px] font-semibold">
          Recommendation: <span className="text-success">{rating.recommendation}</span>
        </div>
      </div>

      <div className="bg-muted/20 rounded-lg p-4">
        <h4 className="text-[13px] font-semibold mb-3">Rating Breakdown</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(rating.breakdown).map(([key, value]) => (
            <div key={key} className={`rounded-lg p-3 ${getRatingBg(value)}`}>
              <div className="flex items-center justify-between">
                <div className="text-[11px] text-muted-foreground">{key}</div>
                <div className={`text-[16px] font-bold font-mono ${getRatingColor(value)}`}>
                  {value.toFixed(1)}
                </div>
              </div>
              <div className="mt-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${value >= 9 ? "bg-success" : value >= 7 ? "bg-primary" : value >= 5 ? "bg-muted-foreground" : "bg-danger"}`}
                  style={{ width: `${(value / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
