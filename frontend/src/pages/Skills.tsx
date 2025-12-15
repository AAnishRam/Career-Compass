import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  Award,
  Target,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSkills } from "@/services/skills.service";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Skills() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user's skills
  const {
    data: skills = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  // Filter skills based on search
  const filteredSkills = skills.filter((skill) =>
    skill.skillName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalSkills = skills.length;
  const masteredSkills = skills.filter(
    (s) => s.proficiencyLevel === "expert" || s.proficiencyLevel === "advanced"
  ).length;
  const learningSkills = skills.filter(
    (s) => s.proficiencyLevel === "intermediate"
  ).length;

  const skillStats = [
    {
      label: "Total Skills",
      value: totalSkills,
      icon: Award,
      color: "text-primary",
    },
    {
      label: "Mastered",
      value: masteredSkills,
      icon: Target,
      color: "text-success",
    },
    {
      label: "Learning",
      value: learningSkills,
      icon: TrendingUp,
      color: "text-warning",
    },
  ];

  // Group skills by category
  const categories = [
    ...new Set(filteredSkills.map((s) => s.category || "General")),
  ];

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto">
          <div className="glass-card rounded-xl p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Failed to Load Skills
            </h2>
            <p className="text-muted-foreground mb-6">
              There was an error loading your skills. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Skills Profile
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your skill levels
            </p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2">
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {skillStats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-xl p-5 flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl bg-primary/10 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">
                  {stat.value}
                </p>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Empty State */}
        {skills.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Skills Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Upload a resume or analyze a job to start building your skills
              profile
            </p>
            <Link to="/analyze">
              <Button className="gradient-primary">
                Analyze Your First Job
              </Button>
            </Link>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Skills Found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search query
            </p>
          </div>
        ) : (
          /* Skills by Category - Simple List View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categorySkills = filteredSkills.filter(
                (s) => (s.category || "General") === category
              );

              if (categorySkills.length === 0) return null;

              return (
                <div
                  key={category}
                  className="glass-card rounded-xl p-6 animate-slide-up"
                >
                  <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    {category}
                    <span className="text-xs text-muted-foreground font-normal">
                      ({categorySkills.length})
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/5 transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm text-foreground">
                          {skill.skillName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
