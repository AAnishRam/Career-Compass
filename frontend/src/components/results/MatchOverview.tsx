import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchOverviewProps {
  overallScore: number;
  matchedSkills: number;
  partialSkills: number;
  missingSkills: number;
}

export function MatchOverview({ overallScore, matchedSkills, partialSkills, missingSkills }: MatchOverviewProps) {
  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: "Excellent Match", color: "text-success" };
    if (score >= 60) return { label: "Good Match", color: "text-primary" };
    if (score >= 40) return { label: "Fair Match", color: "text-warning" };
    return { label: "Needs Work", color: "text-destructive" };
  };

  const status = getScoreStatus(overallScore);

  return (
    <div className="glass-card rounded-2xl p-8 animate-slide-up">
      {/* Score Circle */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              className={cn(
                "transition-all duration-1000",
                overallScore >= 80 ? "text-success" :
                overallScore >= 60 ? "text-primary" :
                overallScore >= 40 ? "text-warning" : "text-destructive"
              )}
              strokeDasharray={`${(overallScore / 100) * 440} 440`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-display font-bold text-foreground">{overallScore}%</span>
            <span className="text-sm text-muted-foreground">Match Score</span>
          </div>
        </div>
        <p className={cn("mt-4 text-lg font-semibold", status.color)}>{status.label}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-xl bg-success/10">
          <CheckCircle className="h-6 w-6 text-success mx-auto mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">{matchedSkills}</p>
          <p className="text-xs text-muted-foreground">Matched</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-warning/10">
          <AlertCircle className="h-6 w-6 text-warning mx-auto mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">{partialSkills}</p>
          <p className="text-xs text-muted-foreground">Partial</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-destructive/10">
          <XCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
          <p className="text-2xl font-display font-bold text-foreground">{missingSkills}</p>
          <p className="text-xs text-muted-foreground">Missing</p>
        </div>
      </div>
    </div>
  );
}
