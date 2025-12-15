import { SkillProgressBar } from "@/components/dashboard/SkillProgressBar";
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "Required Skills": true,
    "Additional Skills": true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  const requiredSkills = skills.filter((s) => s.required === true);
  const additionalSkills = skills.filter((s) => s.required === false);

  const renderSkillSection = (sectionSkills: Skill[], sectionName: string) => {
    if (sectionSkills.length === 0) return null;

    const isExpanded = expandedSections[sectionName];
    const matchedCount = sectionSkills.filter((s) => s.percentage >= 70).length;
    const partialCount = sectionSkills.filter(
      (s) => s.percentage >= 40 && s.percentage < 70
    ).length;
    const missingCount = sectionSkills.filter((s) => s.percentage < 40).length;

    return (
      <div
        key={sectionName}
        className="glass-card rounded-xl overflow-hidden animate-slide-up"
      >
        {/* Header - Clickable to expand/collapse */}
        <button
          onClick={() => toggleSection(sectionName)}
          className="w-full p-6 flex items-center justify-between hover:bg-accent/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform",
                !isExpanded && "-rotate-90"
              )}
            />
            <div className="text-left">
              <h3 className="font-display font-semibold text-foreground">
                {sectionName}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-muted-foreground">
                  {sectionSkills.length} total
                </p>
                {matchedCount > 0 && (
                  <span className="text-xs text-success flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {matchedCount} matched
                  </span>
                )}
                {partialCount > 0 && (
                  <span className="text-xs text-warning flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {partialCount} partial
                  </span>
                )}
                {missingCount > 0 && (
                  <span className="text-xs text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {missingCount} missing
                  </span>
                )}
              </div>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {isExpanded ? "Collapse" : "Expand"}
          </span>
        </button>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="px-6 pb-6 space-y-4 border-t border-border/50">
            {sectionSkills.map((skill) => (
              <div key={skill.name} className="space-y-2 pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-foreground">
                        {skill.name}
                      </span>

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
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderSkillSection(requiredSkills, "Required Skills")}
      {renderSkillSection(additionalSkills, "Additional Skills")}
    </div>
  );
}
