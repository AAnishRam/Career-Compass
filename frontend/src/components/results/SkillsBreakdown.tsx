import { SkillProgressBar } from "@/components/dashboard/SkillProgressBar";
import { ChevronRight } from "lucide-react";

interface Skill {
  name: string;
  percentage: number;
  status: "matched" | "partial" | "missing";
  category: string;
}

interface SkillsBreakdownProps {
  skills: Skill[];
}

export function SkillsBreakdown({ skills }: SkillsBreakdownProps) {
  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category} className="glass-card rounded-xl p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">{category}</h3>
            <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
              View Details
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {skills
              .filter(s => s.category === category)
              .map((skill) => (
                <SkillProgressBar
                  key={skill.name}
                  skill={skill.name}
                  percentage={skill.percentage}
                  status={skill.status}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
