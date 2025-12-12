import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { MatchScoreCard } from "@/components/dashboard/MatchScoreCard";
import { SkillProgressBar } from "@/components/dashboard/SkillProgressBar";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Target, 
  TrendingUp, 
  Clock, 
  Plus,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const recentMatches = [
  {
    score: 92,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    tags: ["React", "TypeScript", "Node.js"],
    status: "excellent" as const,
  },
  {
    score: 78,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    tags: ["Python", "AWS", "React"],
    status: "good" as const,
  },
  {
    score: 65,
    title: "Software Developer",
    company: "Enterprise Corp",
    location: "New York, NY",
    tags: ["Java", "Spring", "PostgreSQL"],
    status: "fair" as const,
  },
];

const topSkills = [
  { skill: "React / React Native", percentage: 95, status: "matched" as const },
  { skill: "TypeScript", percentage: 88, status: "matched" as const },
  { skill: "Node.js", percentage: 72, status: "partial" as const },
  { skill: "AWS Services", percentage: 45, status: "missing" as const },
];

export default function Index() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your job matching overview.</p>
          </div>
          <Link to="/analyze">
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              New Analysis
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Jobs Analyzed" 
            value="24" 
            change="+3 this week"
            changeType="positive"
            icon={FileText}
          />
          <StatCard 
            title="Average Match" 
            value="76%" 
            change="+5% improvement"
            changeType="positive"
            icon={Target}
          />
          <StatCard 
            title="Skills Matched" 
            value="18" 
            change="of 25 total"
            changeType="neutral"
            icon={TrendingUp}
          />
          <StatCard 
            title="Time Saved" 
            value="12h" 
            change="in application prep"
            changeType="positive"
            icon={Clock}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Matches */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold text-foreground">Recent Matches</h2>
              <Link to="/results" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentMatches.map((match, index) => (
                <MatchScoreCard key={index} {...match} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Analysis CTA */}
            <div className="glass-card rounded-xl p-6 gradient-primary text-primary-foreground">
              <Sparkles className="h-8 w-8 mb-4" />
              <h3 className="font-display font-semibold text-lg">Quick Analysis</h3>
              <p className="text-sm opacity-90 mt-2">
                Paste a job description and get instant insights on how well you match.
              </p>
              <Link to="/analyze">
                <Button variant="secondary" className="mt-4 w-full bg-white/20 hover:bg-white/30 border-0">
                  Start Now
                </Button>
              </Link>
            </div>

            {/* Top Skills */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-foreground">Your Top Skills</h3>
                <Link to="/skills" className="text-sm text-primary hover:text-primary/80">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {topSkills.map((skill) => (
                  <SkillProgressBar key={skill.skill} {...skill} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
