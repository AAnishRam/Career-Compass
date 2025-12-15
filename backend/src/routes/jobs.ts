import { Router } from "express";
import { db } from "../db/index.js";
import { jobAnalyses, resumes, skills, recommendations } from "../db/schema.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { analyzeJobMatch } from "../services/gemini.js";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Analyze job posting
router.post("/analyze", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      jobTitle: z.string().min(2),
      company: z.string().min(2),
      location: z.string().optional(),
      jobDescription: z.string().min(50),
    });

    const { jobTitle, company, location, jobDescription } = schema.parse(
      req.body
    );

    // Get user's resume
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, req.userId!))
      .orderBy(desc(resumes.createdAt))
      .limit(1);

    if (!resume) {
      return res.status(400).json({ error: "Please upload a resume first" });
    }

    // Get user's skills
    const userSkills = await db
      .select()
      .from(skills)
      .where(eq(skills.userId, req.userId!));
    const skillNames = userSkills.map((s) => s.skillName);

    // Analyze job match using Gemini AI
    const analysis = await analyzeJobMatch(
      jobDescription,
      resume.parsedContent!,
      skillNames
    );

    // Save job analysis
    const [jobAnalysis] = await db
      .insert(jobAnalyses)
      .values({
        userId: req.userId!,
        jobTitle,
        company,
        location: location || "",
        jobDescription,
        requiredSkills: analysis.requiredSkills,
        matchScore: analysis.matchScore,
        status: analysis.status,
        analysisResult: analysis as any,
      })
      .returning();

    // Save recommendations
    if (analysis.recommendations.length > 0) {
      await db.insert(recommendations).values(
        analysis.recommendations.map((rec) => ({
          userId: req.userId!,
          jobAnalysisId: jobAnalysis.id,
          recommendationType: "improvement",
          content: rec,
        }))
      );
    }

    res.status(201).json({
      id: jobAnalysis.id,
      jobTitle,
      company,
      location,
      matchScore: analysis.matchScore,
      status: analysis.status,
      analysis,
    });
  } catch (error: any) {
    console.error("Job analysis error:", error);
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: error.message || "Failed to analyze job" });
  }
});

// Get all job analyses
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const jobs = await db
      .select()
      .from(jobAnalyses)
      .where(eq(jobAnalyses.userId, req.userId!))
      .orderBy(desc(jobAnalyses.createdAt));

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job analyses" });
  }
});

// Get specific job analysis
router.get("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const [job] = await db
      .select()
      .from(jobAnalyses)
      .where(eq(jobAnalyses.id, req.params.id))
      .limit(1);

    if (!job || job.userId !== req.userId) {
      return res.status(404).json({ error: "Job analysis not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job analysis" });
  }
});

// Delete job analysis
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    await db.delete(jobAnalyses).where(eq(jobAnalyses.id, req.params.id));
    res.json({ message: "Job analysis deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete job analysis" });
  }
});

export default router;
