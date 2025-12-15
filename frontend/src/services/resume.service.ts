import api from "../lib/api";
import { Resume } from "../types";

/**
 * Upload a PDF resume file
 */
export async function uploadResume(file: File): Promise<{
  resume: {
    id: string;
    fileName: string;
    skillsExtracted: number;
    parsedContent?: string;
  };
  skills: string[];
  message?: string;
}> {
  const formData = new FormData();
  formData.append("resume", file);

  const response = await api.post<{
    resume: {
      id: string;
      fileName: string;
      skillsExtracted: number;
      parsedContent?: string;
    };
    skills: string[];
    message?: string;
  }>("/api/resume/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Add resume as text
 */
export async function addResumeText(text: string): Promise<Resume> {
  const response = await api.post<Resume>("/api/resume/text", {
    resumeText: text,
  });
  return response.data;
}

/**
 * Get all resumes for the current user
 */
export async function getResumes(): Promise<Resume[]> {
  const response = await api.get<Resume[]>("/api/resume");
  return response.data;
}

/**
 * Delete a resume
 */
export async function deleteResume(id: string): Promise<void> {
  await api.delete(`/api/resume/${id}`);
}
