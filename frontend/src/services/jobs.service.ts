import api from "../lib/api";
import { JobAnalysis } from "../types";

export interface AnalyzeJobRequest {
  jobTitle: string;
  company: string;
  location?: string;
  jobDescription: string;
}

export interface AnalyzeJobResponse {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  matchScore: number;
  status: "excellent" | "good" | "fair" | "poor";
  analysis: {
    matchScore: number;
    status: "excellent" | "good" | "fair" | "poor";
    requiredSkills: string[];
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
    strengths: string[];
    improvements: string[];
  };
}

/**
 * Analyze a job posting against user's resume and skills
 */
export async function analyzeJob(
  data: AnalyzeJobRequest
): Promise<AnalyzeJobResponse> {
  const response = await api.post<AnalyzeJobResponse>(
    "/api/jobs/analyze",
    data
  );
  return response.data;
}

/**
 * Get all job analyses for the current user
 */
export async function getJobAnalyses(): Promise<JobAnalysis[]> {
  const response = await api.get<JobAnalysis[]>("/api/jobs");
  return response.data;
}

/**
 * Get a specific job analysis by ID
 */
export async function getJobAnalysis(id: string): Promise<JobAnalysis> {
  const response = await api.get<JobAnalysis>(`/api/jobs/${id}`);
  return response.data;
}

/**
 * Delete a job analysis
 */
export async function deleteJobAnalysis(id: string): Promise<void> {
  await api.delete(`/api/jobs/${id}`);
}
