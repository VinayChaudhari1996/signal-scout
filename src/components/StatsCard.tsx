import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "success" | "danger";
}

export const StatsCard = ({ title, value, icon: Icon, variant = "default" }: StatsCardProps) => {
  return (
    <div className={cn(
      "bg-card rounded-xl border border-border/50 p-4 transition-all hover:border-border",
      variant === "success" && "border-l-2 border-l-success",
      variant === "danger" && "border-l-2 border-l-danger"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[12px] font-medium text-muted-foreground mb-1.5">{title}</p>
          <p className="text-[28px] font-semibold tracking-tight tabular-nums">{value}</p>
        </div>
        <div className={cn(
          "rounded-lg p-2",
          variant === "success" && "bg-success/10",
          variant === "danger" && "bg-danger/10",
          variant === "default" && "bg-muted"
        )}>
          <Icon className={cn(
            "w-4 h-4",
            variant === "success" && "text-success",
            variant === "danger" && "text-danger",
            variant === "default" && "text-muted-foreground"
          )} />
        </div>
      </div>
    </div>
  );
};
