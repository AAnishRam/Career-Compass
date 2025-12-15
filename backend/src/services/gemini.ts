import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../../.env") });

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface JobAnalysisResult {
  matchScore: number;
  status: "excellent" | "good" | "fair" | "poor";
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  strengths: string[];
  improvements: string[];
}

export async function analyzeJobMatch(
  jobDescription: string,
  resumeContent: string,
  userSkills: string[]
): Promise<JobAnalysisResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
You are an expert career advisor and resume analyst. Analyze the following job description against the candidate's resume and skills.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE'S RESUME:
${resumeContent}

CANDIDATE'S SKILLS:
${userSkills.join(", ")}

Please provide a detailed analysis in the following JSON format:
{
  "matchScore": <number 0-100>,
  "status": "<excellent|good|fair|poor>",
  "requiredSkills": [<array of skills required for the job>],
  "matchedSkills": [<array of candidate's skills that match job requirements>],
  "missingSkills": [<array of required skills the candidate is missing>],
  "recommendations": [<array of specific recommendations to improve candidacy>],
  "strengths": [<array of candidate's key strengths for this role>],
  "improvements": [<array of areas where candidate should improve>]
}

Guidelines for matchScore:
- 90-100: Excellent match (status: "excellent")
- 75-89: Good match (status: "good")
- 60-74: Fair match (status: "fair")
- Below 60: Poor match (status: "poor")

Return ONLY valid JSON, no additional text.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (remove markdown code blocks if present)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Gemini response");
    }

    const analysis: JobAnalysisResult = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to analyze job match with AI");
  }
}

export async function extractSkillsFromResume(
  resumeContent: string
): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
Extract all technical skills, soft skills, and competencies from the following resume.
Return ONLY a JSON array of skill names, nothing else.

RESUME:
${resumeContent}

Example format: ["JavaScript", "React", "Communication", "Project Management"]

Return ONLY the JSON array, no additional text.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract skills from Gemini response");
    }

    const skills: string[] = JSON.parse(jsonMatch[0]);
    return skills;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to extract skills with AI");
  }
}
