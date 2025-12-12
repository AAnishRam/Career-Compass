import { MainLayout } from "@/components/layout/MainLayout";
import { RecommendationCard } from "@/components/results/RecommendationCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, 
  BookOpen, 
  Trophy, 
  Target,
  ExternalLink,
  Clock,
  TrendingUp
} from "lucide-react";

const learningRecommendations = [
  {
    title: "AWS Cloud Practitioner",
    description: "Get certified in AWS basics to fill the most common skill gap in your job matches.",
    type: "learn" as const,
    priority: "high" as const,
  },
  {
    title: "Docker & Kubernetes Basics",
    description: "Container technologies are increasingly required. Start with Docker fundamentals.",
    type: "learn" as const,
    priority: "medium" as const,
  },
  {
    title: "GraphQL Deep Dive",
    description: "Strengthen your API skills with advanced GraphQL patterns and best practices.",
    type: "learn" as const,
    priority: "medium" as const,
  },
];

const highlightRecommendations = [
  {
    title: "Showcase React Projects",
    description: "Your React expertise is a strong selling point. Create a portfolio highlighting your best work.",
    type: "highlight" as const,
    priority: "high" as const,
  },
  {
    title: "Emphasize TypeScript Experience",
    description: "TypeScript is in high demand. Mention it prominently in your resume summary.",
    type: "highlight" as const,
    priority: "high" as const,
  },
];

const improvementRecommendations = [
  {
    title: "Build Full-Stack Projects",
    description: "Strengthen your backend skills by building complete applications with Node.js.",
    type: "improve" as const,
    priority: "high" as const,
  },
  {
    title: "Contribute to Open Source",
    description: "Gain visibility and experience by contributing to popular React/TypeScript projects.",
    type: "improve" as const,
    priority: "medium" as const,
  },
  {
    title: "Practice System Design",
    description: "Prepare for senior roles by studying system design patterns and architectures.",
    type: "improve" as const,
    priority: "low" as const,
  },
];

const actionRecommendations = [
  {
    title: "Update LinkedIn Profile",
    description: "Ensure your LinkedIn reflects your current skills and recent projects.",
    type: "action" as const,
    priority: "high" as const,
  },
  {
    title: "Set Up Job Alerts",
    description: "Create automated alerts for positions matching your top skills.",
    type: "action" as const,
    priority: "medium" as const,
  },
];

const courses = [
  { name: "AWS Certified Cloud Practitioner", provider: "AWS", duration: "20 hours", link: "#" },
  { name: "Docker Mastery", provider: "Udemy", duration: "15 hours", link: "#" },
  { name: "Advanced GraphQL", provider: "Frontend Masters", duration: "8 hours", link: "#" },
];

export default function Recommendations() {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Recommendations</h1>
          <p className="text-muted-foreground mt-1">Personalized suggestions to improve your job match scores</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Total Suggestions</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">43h</p>
              <p className="text-sm text-muted-foreground">Est. Learning Time</p>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground">+15%</p>
              <p className="text-sm text-muted-foreground">Potential Score Boost</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-muted p-1 rounded-lg">
            <TabsTrigger value="all" className="rounded-md">All</TabsTrigger>
            <TabsTrigger value="learn" className="rounded-md gap-2">
              <BookOpen className="h-4 w-4" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="highlight" className="rounded-md gap-2">
              <Trophy className="h-4 w-4" />
              Highlight
            </TabsTrigger>
            <TabsTrigger value="improve" className="rounded-md gap-2">
              <Target className="h-4 w-4" />
              Improve
            </TabsTrigger>
            <TabsTrigger value="action" className="rounded-md gap-2">
              <Lightbulb className="h-4 w-4" />
              Action
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...learningRecommendations, ...highlightRecommendations, ...improvementRecommendations, ...actionRecommendations].map((rec, i) => (
                <RecommendationCard key={i} {...rec} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learn" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningRecommendations.map((rec, i) => (
                <RecommendationCard key={i} {...rec} />
              ))}
            </div>
            
            {/* Suggested Courses */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">Suggested Courses</h3>
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{course.name}</p>
                      <p className="text-sm text-muted-foreground">{course.provider} • {course.duration}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      View <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="highlight" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlightRecommendations.map((rec, i) => (
                <RecommendationCard key={i} {...rec} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="improve" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {improvementRecommendations.map((rec, i) => (
                <RecommendationCard key={i} {...rec} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="action" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actionRecommendations.map((rec, i) => (
                <RecommendationCard key={i} {...rec} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
