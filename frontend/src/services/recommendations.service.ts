import api from "../lib/api";

export interface RecommendationResource {
  title: string;
  url: string;
  type: "course" | "article" | "documentation" | "certification";
}

export interface Recommendation {
  id: string;
  jobAnalysisId: string;
  jobTitle: string;
  company: string;
  recommendationIndex: number;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  type: string;
  actionItems: string[];
  resources: RecommendationResource[];
  status: "pending" | "in_progress" | "completed";
  completedAt?: string;
  notes?: string;
  progressId?: string;
}

export interface RecommendationStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionPercentage: number;
}

export interface RecommendationFilters {
  priority?: "high" | "medium" | "low";
  status?: "pending" | "in_progress" | "completed";
  search?: string;
}

/**
 * Get all recommendations for the current user
 */
export async function getRecommendations(
  filters?: RecommendationFilters
): Promise<Recommendation[]> {
  const params = new URLSearchParams();
  if (filters?.priority) params.append("priority", filters.priority);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.search) params.append("search", filters.search);

  const response = await api.get<Recommendation[]>(
    `/api/recommendations?${params.toString()}`
  );
  return response.data;
}

/**
 * Get recommendation statistics
 */
export async function getRecommendationStats(): Promise<RecommendationStats> {
  const response = await api.get<RecommendationStats>(
    "/api/recommendations/stats"
  );
  return response.data;
}

/**
 * Update recommendation status
 */
export async function updateRecommendationStatus(
  jobAnalysisId: string,
  index: number,
  status: "pending" | "in_progress" | "completed",
  notes?: string
): Promise<any> {
  const response = await api.patch(
    `/api/recommendations/${jobAnalysisId}/${index}/status`,
    { status, notes }
  );
  return response.data;
}
