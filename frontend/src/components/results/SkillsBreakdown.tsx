import { SkillProgressBar } from "@/components/dashboard/SkillProgressBar";
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Skill {
  name: string;
  percentage: number;
  status: "matched" | "partial" | "missing";
  category: string;
  proficiencyLevel?: "beginner" | "intermediate" | "advanced" | "expert";
  notes?: string;
  required?: boolean;
}

interface SkillsBreakdownProps {
  skills: Skill[];
}

export function SkillsBreakdown({ skills }: SkillsBreakdownProps) {
  const categories = [...new Set(skills.map((s) => s.category))];

  const proficiencyColors = {
    beginner: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    intermediate: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    advanced: "bg-green-500/10 text-green-600 border-green-500/20",
    expert: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  };

  const proficiencyIcons = {
    beginner: "★",
    intermediate: "★★",
    advanced: "★★★",
    expert: "★★★★",
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categorySkills = skills.filter((s) => s.category === category);
        const requiredSkills = categorySkills.filter((s) => s.required);
        const additionalSkills = categorySkills.filter((s) => !s.required);

        return (
          <div
            key={category}
            className="glass-card rounded-xl p-6 animate-slide-up"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-foreground">
                  {category}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {requiredSkills.length > 0 &&
                    `${requiredSkills.length} required`}
                  {requiredSkills.length > 0 &&
                    additionalSkills.length > 0 &&
                    " • "}
                  {additionalSkills.length > 0 &&
                    `${additionalSkills.length} additional`}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {categorySkills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">
                          {skill.name}
                        </span>

                        {/* Required/Possessed Badge */}
                        {skill.required !== undefined && (
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full border",
                              skill.required
                                ? "bg-destructive/10 text-destructive border-destructive/20"
                                : "bg-muted text-muted-foreground border-border"
                            )}
                          >
                            {skill.required ? "Required" : "Additional"}
                          </span>
                        )}

                        {/* Proficiency Level */}
                        {skill.proficiencyLevel && (
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full border font-medium",
                              proficiencyColors[skill.proficiencyLevel]
                            )}
                          >
                            {proficiencyIcons[skill.proficiencyLevel]}{" "}
                            {skill.proficiencyLevel}
                          </span>
                        )}
                      </div>

                      {/* Notes */}
                      {skill.notes && (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {skill.notes}
                        </p>
                      )}
                    </div>

                    {/* Match Percentage */}
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          skill.percentage >= 70
                            ? "text-success"
                            : skill.percentage >= 40
                            ? "text-warning"
                            : "text-destructive"
                        )}
                      >
                        {skill.percentage}%
                      </span>
                      {skill.percentage >= 70 ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : skill.percentage >= 40 ? (
                        <AlertCircle className="h-4 w-4 text-warning" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <SkillProgressBar
                    skill=""
                    percentage={skill.percentage}
                    status={skill.status}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
