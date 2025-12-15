import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  BookOpen,
  GraduationCap,
  FileText,
  Award,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRecommendations,
  getRecommendationStats,
  updateRecommendationStatus,
  type Recommendation,
} from "@/services/recommendations.service";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Recommendations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  const {
    data: recommendations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recommendations", priorityFilter, statusFilter, searchQuery],
    queryFn: () =>
      getRecommendations({
        priority:
          priorityFilter !== "all" ? (priorityFilter as any) : undefined,
        status: statusFilter !== "all" ? (statusFilter as any) : undefined,
        search: searchQuery || undefined,
      }),
  });

  const { data: stats } = useQuery({
    queryKey: ["recommendation-stats"],
    queryFn: getRecommendationStats,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      jobAnalysisId,
      index,
      status,
    }: {
      jobAnalysisId: string;
      index: number;
      status: "pending" | "in_progress" | "completed";
    }) => updateRecommendationStatus(jobAnalysisId, index, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["recommendation-stats"] });
      toast.success("Status updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const handleStatusChange = (rec: Recommendation, newStatus: string) => {
    updateStatusMutation.mutate({
      jobAnalysisId: rec.jobAnalysisId,
      index: rec.recommendationIndex,
      status: newStatus as any,
    });
  };

  const groupedRecommendations = {
    high: recommendations.filter((r) => r.priority === "high"),
    medium: recommendations.filter((r) => r.priority === "medium"),
    low: recommendations.filter((r) => r.priority === "low"),
  };

  const resourceTypeIcons = {
    course: GraduationCap,
    article: FileText,
    documentation: BookOpen,
    certification: Award,
  };

  const statusConfig = {
    pending: {
      icon: AlertCircle,
      color: "text-muted-foreground",
      bg: "bg-muted",
    },
    in_progress: { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    completed: {
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
    },
  };

  const priorityConfig = {
    high: "border-l-destructive",
    medium: "border-l-warning",
    low: "border-l-muted-foreground",
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-20 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
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
              Failed to Load Recommendations
            </h2>
            <p className="text-muted-foreground mb-6">
              There was an error loading your recommendations. Please try again.
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Career Recommendations
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Track your progress on personalized career development
            recommendations
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {stats.total}
                  </p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-success/10">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {stats.completed}
                  </p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {stats.inProgress}
                  </p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent/10">
                  <AlertCircle className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {stats.pending}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-foreground">
            <Filter className="h-5 w-5" />
            <h3 className="font-semibold">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recommendations..."
                className="pl-10 bg-background border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Recommendations List */}
        {recommendations.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Recommendations Yet
            </h3>
            <p className="text-muted-foreground">
              Analyze some jobs to get personalized career recommendations
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* High Priority */}
            {groupedRecommendations.high.length > 0 && (
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                  High Priority ({groupedRecommendations.high.length})
                </h2>
                <div className="space-y-4">
                  {groupedRecommendations.high.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      onStatusChange={handleStatusChange}
                      statusConfig={statusConfig}
                      priorityConfig={priorityConfig}
                      resourceTypeIcons={resourceTypeIcons}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Medium Priority */}
            {groupedRecommendations.medium.length > 0 && (
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                  Medium Priority ({groupedRecommendations.medium.length})
                </h2>
                <div className="space-y-4">
                  {groupedRecommendations.medium.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      onStatusChange={handleStatusChange}
                      statusConfig={statusConfig}
                      priorityConfig={priorityConfig}
                      resourceTypeIcons={resourceTypeIcons}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Low Priority */}
            {groupedRecommendations.low.length > 0 && (
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground mb-4">
                  Low Priority ({groupedRecommendations.low.length})
                </h2>
                <div className="space-y-4">
                  {groupedRecommendations.low.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      onStatusChange={handleStatusChange}
                      statusConfig={statusConfig}
                      priorityConfig={priorityConfig}
                      resourceTypeIcons={resourceTypeIcons}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// Recommendation Card Component
function RecommendationCard({
  recommendation: rec,
  onStatusChange,
  statusConfig,
  priorityConfig,
  resourceTypeIcons,
}: {
  recommendation: Recommendation;
  onStatusChange: (rec: Recommendation, status: string) => void;
  statusConfig: any;
  priorityConfig: any;
  resourceTypeIcons: any;
}) {
  const StatusIcon = statusConfig[rec.status].icon;

  return (
    <div
      className={cn(
        "glass-card rounded-xl p-6 border-l-4 animate-slide-up",
        priorityConfig[rec.priority]
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-display font-semibold text-foreground">
              {rec.title}
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
              {rec.priority}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
            From: {rec.jobTitle} at {rec.company}
          </p>
          <p className="text-sm text-foreground">{rec.description}</p>
        </div>

        {/* Status Selector */}
        <Select
          value={rec.status}
          onValueChange={(value) => onStatusChange(rec, value)}
        >
          <SelectTrigger
            className={cn(
              "w-full sm:w-[140px]",
              statusConfig[rec.status].bg,
              statusConfig[rec.status].color
            )}
          >
            <div className="flex items-center gap-2">
              <StatusIcon className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Items */}
      {rec.actionItems && rec.actionItems.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-semibold text-foreground mb-2">
            Action Items
          </h5>
          <div className="space-y-2">
            {rec.actionItems.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resources */}
      {rec.resources && rec.resources.length > 0 && (
        <div>
          <h5 className="text-sm font-semibold text-foreground mb-2">
            Recommended Resources
          </h5>
          <div className="space-y-2">
            {rec.resources.map((resource, index) => {
              const ResourceIcon = resourceTypeIcons[resource.type] || BookOpen;
              return (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/5 transition-colors group"
                >
                  <ResourceIcon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors flex-1">
                    {resource.title}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
