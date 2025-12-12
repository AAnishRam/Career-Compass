import { MainLayout } from "@/components/layout/MainLayout";
import { SkillProgressBar } from "@/components/dashboard/SkillProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, TrendingUp, Award, Target } from "lucide-react";

const allSkills = [
  { skill: "React.js", percentage: 95, status: "matched" as const, category: "Frontend" },
  { skill: "TypeScript", percentage: 90, status: "matched" as const, category: "Languages" },
  { skill: "JavaScript", percentage: 95, status: "matched" as const, category: "Languages" },
  { skill: "Node.js", percentage: 72, status: "partial" as const, category: "Backend" },
  { skill: "Python", percentage: 65, status: "partial" as const, category: "Languages" },
  { skill: "CSS/Tailwind", percentage: 88, status: "matched" as const, category: "Frontend" },
  { skill: "GraphQL", percentage: 55, status: "partial" as const, category: "Backend" },
  { skill: "REST APIs", percentage: 92, status: "matched" as const, category: "Backend" },
  { skill: "AWS", percentage: 35, status: "missing" as const, category: "Cloud" },
  { skill: "Docker", percentage: 48, status: "missing" as const, category: "DevOps" },
  { skill: "Git", percentage: 95, status: "matched" as const, category: "Tools" },
  { skill: "SQL", percentage: 78, status: "partial" as const, category: "Databases" },
];

const skillStats = [
  { label: "Total Skills", value: 12, icon: Award, color: "text-primary" },
  { label: "Mastered", value: 6, icon: Target, color: "text-success" },
  { label: "Learning", value: 4, icon: TrendingUp, color: "text-warning" },
];

export default function Skills() {
  const categories = [...new Set(allSkills.map(s => s.category))];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Skills Profile</h1>
            <p className="text-muted-foreground mt-1">Track and manage your skill levels</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillStats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-primary/10 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search skills..." 
              className="pl-10 bg-card border-border"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Skills by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div key={category} className="glass-card rounded-xl p-6 animate-slide-up">
              <h3 className="font-display font-semibold text-foreground mb-4">{category}</h3>
              <div className="space-y-4">
                {allSkills
                  .filter(s => s.category === category)
                  .map((skill) => (
                    <SkillProgressBar
                      key={skill.skill}
                      skill={skill.skill}
                      percentage={skill.percentage}
                      status={skill.status}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
