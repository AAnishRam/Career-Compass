import { MainLayout } from "@/components/layout/MainLayout";
import { MatchOverview } from "@/components/results/MatchOverview";
import { SkillsBreakdown } from "@/components/results/SkillsBreakdown";
import { RecommendationCard } from "@/components/results/RecommendationCard";
import { Button } from "@/components/ui/button";
import { Download, Share2, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const mockSkills = [
  { name: "React.js", percentage: 100, status: "matched" as const, category: "Technical Skills" },
  { name: "TypeScript", percentage: 95, status: "matched" as const, category: "Technical Skills" },
  { name: "Node.js", percentage: 75, status: "partial" as const, category: "Technical Skills" },
  { name: "GraphQL", percentage: 60, status: "partial" as const, category: "Technical Skills" },
  { name: "AWS", percentage: 30, status: "missing" as const, category: "Technical Skills" },
  { name: "Team Leadership", percentage: 85, status: "matched" as const, category: "Soft Skills" },
  { name: "Communication", percentage: 90, status: "matched" as const, category: "Soft Skills" },
  { name: "Agile/Scrum", percentage: 70, status: "partial" as const, category: "Methodology" },
  { name: "CI/CD", percentage: 55, status: "partial" as const, category: "Methodology" },
];

const mockRecommendations = [
  {
    title: "Highlight React Experience",
    description: "Your React skills are a strong match. Emphasize specific projects and achievements in your application.",
    type: "highlight" as const,
    priority: "high" as const,
  },
  {
    title: "Learn AWS Basics",
    description: "Consider getting AWS Cloud Practitioner certification to fill this common requirement gap.",
    type: "learn" as const,
    priority: "high" as const,
  },
  {
    title: "Strengthen Node.js Portfolio",
    description: "Add more backend projects to demonstrate full-stack capabilities.",
    type: "improve" as const,
    priority: "medium" as const,
  },
  {
    title: "Mention GraphQL Experience",
    description: "Even partial experience with GraphQL is valuable. Include any relevant projects.",
    type: "action" as const,
    priority: "low" as const,
  },
];

export default function Results() {
  const matchedCount = mockSkills.filter(s => s.status === "matched").length;
  const partialCount = mockSkills.filter(s => s.status === "partial").length;
  const missingCount = mockSkills.filter(s => s.status === "missing").length;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link to="/analyze" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Analysis
            </Link>
            <h1 className="text-3xl font-display font-bold text-foreground">Match Results</h1>
            <p className="text-muted-foreground mt-1">Senior Frontend Developer at TechCorp Inc.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Re-analyze
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Overview */}
          <div className="space-y-6">
            <MatchOverview 
              overallScore={78}
              matchedSkills={matchedCount}
              partialSkills={partialCount}
              missingSkills={missingCount}
            />
          </div>

          {/* Middle Column - Skills Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-display font-semibold text-foreground">Skills Breakdown</h2>
            <SkillsBreakdown skills={mockSkills} />
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-display font-semibold text-foreground">Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRecommendations.map((rec, index) => (
              <RecommendationCard key={index} {...rec} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
