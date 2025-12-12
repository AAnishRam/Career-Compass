import { cn } from "@/lib/utils";

interface MatchScoreCardProps {
  score: number;
  title: string;
  company: string;
  location: string;
  tags: string[];
  status: "excellent" | "good" | "fair" | "poor";
}

export function MatchScoreCard({
  score,
  title,
  company,
  location,
  tags,
  status,
}: MatchScoreCardProps) {
  const statusColors = {
    excellent: "from-success to-accent",
    good: "from-primary to-chart-4",
    fair: "from-warning to-chart-3",
    poor: "from-destructive to-chart-5",
  };

  const statusBg = {
    excellent: "bg-success/10 text-success",
    good: "bg-primary/10 text-primary",
    fair: "bg-warning/10 text-warning",
    poor: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="glass-card rounded-xl p-5 hover:shadow-soft transition-all duration-200 group cursor-pointer">
      <div className="flex items-start gap-4">
        {/* Score Circle */}
        <div className="relative">
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br",
              statusColors[status]
            )}
          >
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center">
              <span className="text-lg font-display font-bold text-foreground">
                {score}%
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {company} • {location}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={cn(
            "px-3 py-1 text-xs font-semibold rounded-full capitalize",
            statusBg[status]
          )}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
