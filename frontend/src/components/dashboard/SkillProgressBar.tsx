import { cn } from "@/lib/utils";

interface SkillProgressBarProps {
  skill: string;
  percentage: number;
  status: "matched" | "partial" | "missing";
}

export function SkillProgressBar({ skill, percentage, status }: SkillProgressBarProps) {
  const barColors = {
    matched: "bg-success",
    partial: "bg-warning",
    missing: "bg-destructive/50",
  };

  const statusLabels = {
    matched: "Matched",
    partial: "Partial",
    missing: "Missing",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{skill}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{percentage}%</span>
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            status === "matched" && "bg-success/10 text-success",
            status === "partial" && "bg-warning/10 text-warning",
            status === "missing" && "bg-destructive/10 text-destructive"
          )}>
            {statusLabels[status]}
          </span>
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full progress-animate transition-all", barColors[status])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
