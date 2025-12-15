import api from "../lib/api";
import { Recommendation } from "../types";

/**
 * Get all recommendations for the current user
 */
export async function getRecommendations(): Promise<Recommendation[]> {
  const response = await api.get<Recommendation[]>("/api/recommendations");
  return response.data;
}

/**
 * Get recommendations for a specific job analysis
 */
export async function getJobRecommendations(
  jobId: string
): Promise<Recommendation[]> {
  const response = await api.get<Recommendation[]>(
    `/api/recommendations/${jobId}`
  );
  return response.data;
}
