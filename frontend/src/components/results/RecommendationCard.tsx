import {
  LucideIcon,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Trophy,
  Target,
  ExternalLink,
  CheckCircle2,
  GraduationCap,
  FileText,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  title: string;
  description: string;
  type: "learn" | "highlight" | "improve" | "action";
  priority: "high" | "medium" | "low";
  actionItems?: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: "course" | "article" | "documentation" | "certification";
  }>;
}

export function RecommendationCard({
  title,
  description,
  type,
  priority,
  actionItems = [],
  resources = [],
}: RecommendationCardProps) {
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

  const resourceTypeIcons = {
    course: GraduationCap,
    article: FileText,
    documentation: BookOpen,
    certification: Award,
  };

  const { icon: Icon, color } = typeConfig[type];

  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 border-l-4 hover:shadow-lg transition-all duration-300",
        priorityConfig[priority]
      )}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={cn("p-2.5 rounded-xl", color)}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-foreground">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </div>
      </div>

      {/* Action Items */}
      {actionItems.length > 0 && (
        <div className="mt-4 space-y-2">
          <h5 className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Action Items
          </h5>
          <ul className="space-y-1.5">
            {actionItems.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Resources */}
      {resources.length > 0 && (
        <div className="mt-4 space-y-2">
          <h5 className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Recommended Resources
          </h5>
          <div className="space-y-2">
            {resources.map((resource, index) => {
              const ResourceIcon = resourceTypeIcons[resource.type];
              return (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/5 transition-colors group"
                >
                  <ResourceIcon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors flex-1">
                    {resource.title}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
