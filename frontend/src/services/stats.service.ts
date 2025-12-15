import api from "../lib/api";
import { DashboardStats } from "../types";

/**
 * Get dashboard statistics for the current user
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>("/api/stats/dashboard");
  return response.data;
}
