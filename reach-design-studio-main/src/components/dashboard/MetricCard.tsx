import { cn } from "@/lib/utils";

export type MetricColor = "blue" | "green" | "orange" | "purple" | "cyan" | "pink";

interface MetricCardProps {
  label: string;
  value: number | string;
  color: MetricColor;
  percentage?: number;
  showPercentage?: boolean;
}

const colorClasses: Record<MetricColor, string> = {
  blue: "metric-dot-blue",
  green: "metric-dot-green",
  orange: "metric-dot-orange",
  purple: "metric-dot-purple",
  cyan: "metric-dot-cyan",
  pink: "metric-dot-pink",
};

const percentageColorClasses: Record<MetricColor, string> = {
  blue: "text-metric-blue",
  green: "text-metric-green",
  orange: "text-metric-orange",
  purple: "text-metric-purple",
  cyan: "text-metric-cyan",
  pink: "text-metric-pink",
};

export function MetricCard({ label, value, color, percentage, showPercentage = false }: MetricCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <div className={cn("metric-dot", colorClasses[color])} />
        <span className="text-sm text-muted-foreground font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        {showPercentage && percentage !== undefined && (
          <span className={cn("text-sm font-medium", percentageColorClasses[color])}>
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
