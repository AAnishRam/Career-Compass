import { LucideIcon, ArrowRight, Lightbulb, BookOpen, Trophy, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  title: string;
  description: string;
  type: "learn" | "highlight" | "improve" | "action";
  priority: "high" | "medium" | "low";
}

export function RecommendationCard({ title, description, type, priority }: RecommendationCardProps) {
  const typeConfig = {
    learn: { icon: BookOpen, color: "bg-primary/10 text-primary" },
    highlight: { icon: Trophy, color: "bg-success/10 text-success" },
    improve: { icon: Target, color: "bg-warning/10 text-warning" },
    action: { icon: Lightbulb, color: "bg-accent/10 text-accent" },
  };

  const priorityConfig = {
    high: "border-l-destructive",
    medium: "border-l-warning",
    low: "border-l-muted-foreground",
  };

  const { icon: Icon, color } = typeConfig[type];

  return (
    <div className={cn(
      "glass-card rounded-xl p-5 border-l-4 hover:shadow-lg transition-all duration-300 cursor-pointer group",
      priorityConfig[priority]
    )}>
      <div className="flex items-start gap-4">
        <div className={cn("p-2.5 rounded-xl", color)}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>

        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}
