import api from "../lib/api";
import { DashboardStats } from "../types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>("/api/stats/dashboard");
  return response.data;
}
