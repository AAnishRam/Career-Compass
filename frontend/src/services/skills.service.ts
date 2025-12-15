import api from "../lib/api";
import { Skill } from "../types";

export interface AddSkillRequest {
  skillName: string;
  proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
}

export interface UpdateSkillRequest {
  skillName?: string;
  proficiencyLevel?: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
}

/**
 * Get all skills for the current user
 */
export async function getSkills(): Promise<Skill[]> {
  const response = await api.get<Skill[]>("/api/skills");
  return response.data;
}

/**
 * Add a new skill
 */
export async function addSkill(data: AddSkillRequest): Promise<Skill> {
  const response = await api.post<Skill>("/api/skills", data);
  return response.data;
}

/**
 * Update an existing skill
 */
export async function updateSkill(
  id: string,
  data: UpdateSkillRequest
): Promise<Skill> {
  const response = await api.put<Skill>(`/api/skills/${id}`, data);
  return response.data;
}

/**
 * Delete a skill
 */
export async function deleteSkill(id: string): Promise<void> {
  await api.delete(`/api/skills/${id}`);
}
