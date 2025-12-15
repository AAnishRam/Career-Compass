export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface JobAnalysis {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  location?: string;
  jobDescription: string;
  requiredSkills: string[];
  matchScore: number;
  status: "excellent" | "good" | "fair" | "poor";
  analysisResult: {
    matchScore: number;
    status: "excellent" | "good" | "fair" | "poor";
    requiredSkills: string[];
    skillsAnalysis: Array<{
      skill: string;
      required: boolean;
      possessed: boolean;
      matchPercentage: number;
      proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
      notes: string;
    }>;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: Array<{
      title: string;
      description: string;
      priority: "high" | "medium" | "low";
      actionItems: string[];
      resources: Array<{
        title: string;
        url: string;
        type: "course" | "article" | "documentation" | "certification";
      }>;
    }>;
    strengths: string[];
    improvements: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName?: string;
  filePath?: string;
  parsedContent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  userId: string;
  skillName: string;
  proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Recommendation {
  id: string;
  userId: string;
  jobAnalysisId: string;
  recommendationType: string;
  content: string;
  createdAt: string;
}

export interface DashboardStats {
  stats: {
    jobsAnalyzed: number;
    averageMatch: number;
    skillsMatched: number;
    timeSaved: string;
  };
  recentMatches: Array<{
    id: string;
    score: number;
    title: string;
    company: string;
    location: string;
    status: "excellent" | "good" | "fair" | "poor";
    createdAt: string;
  }>;
  topSkills: Array<{
    skill: string;
    percentage: string;
    status: string;
  }>;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
