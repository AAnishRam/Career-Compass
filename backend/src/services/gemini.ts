import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getPrompt } from "../prompts/index.js";

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

  const prompt = getPrompt("job-analysis", {
    jobDescription,
    resumeContent,
    userSkills: userSkills.join(", "),
  });

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

  const prompt = getPrompt("skills-extraction", {
    resumeContent,
  });

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
