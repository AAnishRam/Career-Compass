import { MainLayout } from "@/components/layout/MainLayout";
import { MatchOverview } from "@/components/results/MatchOverview";
import { SkillsBreakdown } from "@/components/results/SkillsBreakdown";
import { RecommendationCard } from "@/components/results/RecommendationCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  Share2,
  RotateCcw,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getJobAnalyses, getJobAnalysis } from "@/services/jobs.service";

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("id");

  const { data: allJobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobAnalyses"],
    queryFn: getJobAnalyses,
    enabled: !jobId,
  });

  const {
    data: specificJob,
    isLoading: specificJobLoading,
    error: jobError,
  } = useQuery({
    queryKey: ["jobAnalysis", jobId],
    queryFn: () => getJobAnalysis(jobId!),
    enabled: !!jobId,
  });

  const currentJob = specificJob || allJobs[0];
  const isLoading = jobId ? specificJobLoading : jobsLoading;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-64" />
            <div className="lg:col-span-2">
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (jobError || !currentJob) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-xl p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Analysis Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              {jobError
                ? "Failed to load job analysis"
                : "No job analyses found. Start by analyzing a job posting."}
            </p>
            <Link to="/analyze">
              <Button className="gradient-primary">Analyze New Job</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const analysis = currentJob.analysisResult;

  const skillsData = analysis.skillsAnalysis
    ? analysis.skillsAnalysis.map((skill) => ({
        name: skill.skill,
        percentage: skill.matchPercentage,
        status:
          skill.matchPercentage >= 70
            ? ("matched" as const)
            : skill.matchPercentage >= 40
            ? ("partial" as const)
            : ("missing" as const),
        category: skill.required ? "Required Skills" : "Additional Skills",
        proficiencyLevel: skill.proficiencyLevel,
        notes: skill.notes,
        required: skill.required,
      }))
    : [
        ...analysis.matchedSkills.map((skill) => ({
          name: skill,
          percentage: 100,
          status: "matched" as const,
          category: "Matched Skills",
        })),
        ...analysis.missingSkills.map((skill) => ({
          name: skill,
          percentage: 0,
          status: "missing" as const,
          category: "Missing Skills",
        })),
      ];

  const recommendationsData =
    Array.isArray(analysis.recommendations) &&
    analysis.recommendations.length > 0
      ? typeof analysis.recommendations[0] === "string"
        ? analysis.recommendations.map((rec, index) => ({
            title: `Recommendation ${index + 1}`,
            description: rec,
            type: "improve" as const,
            priority: index < 2 ? ("high" as const) : ("medium" as const),
          }))
        : analysis.recommendations.map((rec: any) => ({
            title: rec.title,
            description: rec.description,
            type: "improve" as const,
            priority: rec.priority as "high" | "medium" | "low",
            actionItems: rec.actionItems || [],
            resources: rec.resources || [],
          }))
      : [];

  const matchedCount = skillsData.filter((s) => s.percentage >= 70).length;
  const partialCount = skillsData.filter(
    (s) => s.percentage >= 40 && s.percentage < 70
  ).length;
  const missingCount = skillsData.filter((s) => s.percentage < 40).length;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              to="/analyze"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Analysis
            </Link>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Match Results
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              {currentJob.jobTitle} at {currentJob.company}
              {currentJob.location && ` • ${currentJob.location}`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="gap-2 flex-1 sm:flex-none"
              onClick={() => navigate("/analyze")}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">New Analysis</span>
            </Button>
            <Button variant="outline" className="gap-2 flex-1 sm:flex-none">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button className="gradient-primary text-primary-foreground gap-2 flex-1 sm:flex-none">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          </div>
        </div>

        {/* Main Content - Single Column Layout */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 1. Match Overview Card */}
          <MatchOverview
            overallScore={currentJob.matchScore}
            matchedSkills={matchedCount}
            partialSkills={partialCount}
            missingSkills={missingCount}
          />

          {/* 2. Your Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Your Strengths
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary mt-0.5">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. Areas for Improvement */}
          {analysis.improvements.length > 0 && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {analysis.improvements.map((improvement, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-warning mt-0.5">→</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Skills Breakdown */}
          <div>
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">
              Skills Breakdown
            </h2>
            <SkillsBreakdown skills={skillsData} />
          </div>

          {/* 5. Recommendations */}
          {recommendationsData.length > 0 && (
            <div>
              <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                Recommendations
              </h2>
              <div className="space-y-4">
                {recommendationsData.map((rec, index) => (
                  <RecommendationCard key={index} {...rec} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
