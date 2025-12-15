import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { MatchScoreCard } from "@/components/dashboard/MatchScoreCard";
import { SkillProgressBar } from "@/components/dashboard/SkillProgressBar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Target,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/services/stats.service";
import { getJobAnalyses } from "@/services/jobs.service";
import { getSkills } from "@/services/skills.service";

export default function Index() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  const { data: jobAnalyses = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobAnalyses"],
    queryFn: getJobAnalyses,
  });

  const { data: skills = [], isLoading: skillsLoading } = useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
  });

  const recentMatches = jobAnalyses.slice(0, 3).map((job) => ({
    id: job.id,
    score: job.matchScore,
    title: job.jobTitle,
    company: job.company,
    location: job.location || "Not specified",
    tags: job.requiredSkills.slice(0, 3),
    status: job.status,
  }));

  const topSkills = skills.slice(0, 4).map((skill) => {
    const proficiencyMap = {
      beginner: 25,
      intermediate: 50,
      advanced: 75,
      expert: 95,
    };

    return {
      skill: skill.skillName,
      percentage: proficiencyMap[skill.proficiencyLevel] || 50,
      status: "matched" as const,
    };
  });

  const averageMatch =
    jobAnalyses.length > 0
      ? Math.round(
          jobAnalyses.reduce((sum, job) => sum + job.matchScore, 0) /
            jobAnalyses.length
        )
      : 0;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's your job matching overview.
            </p>
          </div>
          <Link to="/analyze">
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              New Analysis
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : statsError ? (
          <div className="glass-card rounded-xl p-6 flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load statistics</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Jobs Analyzed"
              value={stats?.stats.jobsAnalyzed.toString() || "0"}
              change={`${jobAnalyses.length} total`}
              changeType="neutral"
              icon={FileText}
            />
            <StatCard
              title="Average Match"
              value={`${stats?.stats.averageMatch || 0}%`}
              change={averageMatch >= 75 ? "Great fit!" : "Keep improving"}
              changeType={averageMatch >= 75 ? "positive" : "neutral"}
              icon={Target}
            />
            <StatCard
              title="Skills Tracked"
              value={stats?.stats.skillsMatched.toString() || "0"}
              change={`${skills.length} total`}
              changeType="neutral"
              icon={TrendingUp}
            />
            <StatCard
              title="Time Saved"
              value={stats?.stats.timeSaved || "0h"}
              change="in application prep"
              changeType="positive"
              icon={Clock}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Matches */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold text-foreground">
                Recent Matches
              </h2>
              <Link
                to="/results"
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {jobsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            ) : recentMatches.length > 0 ? (
              <div className="space-y-4">
                {recentMatches.map((match, index) => (
                  <MatchScoreCard key={index} {...match} />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold text-foreground mb-2">
                  No analyses yet
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by analyzing your first job posting
                </p>
                <Link to="/analyze">
                  <Button className="gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Analyze Job
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Analysis CTA */}
            <div className="glass-card rounded-xl p-6 gradient-primary text-primary-foreground">
              <Sparkles className="h-8 w-8 mb-4" />
              <h3 className="font-display font-semibold text-lg">
                Quick Analysis
              </h3>
              <p className="text-sm opacity-90 mt-2">
                Paste a job description and get instant insights on how well you
                match.
              </p>
              <Link to="/analyze">
                <Button
                  variant="secondary"
                  className="mt-4 w-full bg-white/20 hover:bg-white/30 border-0"
                >
                  Start Now
                </Button>
              </Link>
            </div>

            {/* Top Skills */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-foreground">
                  Your Top Skills
                </h3>
                <Link
                  to="/skills"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  View all
                </Link>
              </div>

              {skillsLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              ) : topSkills.length > 0 ? (
                <div className="space-y-4">
                  {topSkills.map((skill) => (
                    <SkillProgressBar key={skill.skill} {...skill} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Target className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No skills added yet
                  </p>
                  <Link to="/skills">
                    <Button variant="outline" size="sm" className="mt-3">
                      Add Skills
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
