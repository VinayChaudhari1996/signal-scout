import { Card, CardContent } from "@/components/ui/card";
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
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={cn(
              "text-3xl font-bold font-mono",
              variant === "success" && "text-success",
              variant === "danger" && "text-danger"
            )}>
              {value}
            </p>
          </div>
          <div className={cn(
            "p-3 rounded-lg",
            variant === "success" && "bg-success/10",
            variant === "danger" && "bg-danger/10",
            variant === "default" && "bg-muted"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              variant === "success" && "text-success",
              variant === "danger" && "text-danger",
              variant === "default" && "text-muted-foreground"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
