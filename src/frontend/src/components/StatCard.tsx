import { cn } from "@/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";

// Mini sparkline using SVG
function MiniChart({
  data,
  color = "oklch(0.6 0.22 292)",
}: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-8"
      preserveAspectRatio="none"
      aria-hidden="true"
      role="img"
      aria-label="Trend chart"
    >
      <title>Trend chart</title>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#chartGrad)" />
    </svg>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  trend: "up" | "down" | "flat";
  trendLabel: string;
  data: number[];
  prefix?: string;
}

export function StatCard({
  label,
  value,
  trend,
  trendLabel,
  data,
  prefix,
}: StatCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-success"
      : trend === "down"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <div className="rounded-xl bg-card border border-border p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          {label}
        </span>
        <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
          <TrendIcon className="h-3 w-3" />
          <span>{trendLabel}</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground">
        {prefix}
        {value}
      </div>
      <MiniChart data={data} />
    </div>
  );
}
