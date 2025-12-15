import { Router } from "express";
import { db } from "../db/index.js";
import { jobAnalyses, skills } from "../db/schema.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { eq, count, avg, desc } from "drizzle-orm";

const router = Router();

// Get dashboard statistics
router.get("/dashboard", authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Get total jobs analyzed
    const [jobsCount] = await db
      .select({ count: count() })
      .from(jobAnalyses)
      .where(eq(jobAnalyses.userId, req.userId!));

    // Get average match score
    const [avgMatch] = await db
      .select({ avg: avg(jobAnalyses.matchScore) })
      .from(jobAnalyses)
      .where(eq(jobAnalyses.userId, req.userId!));

    // Get total skills
    const [skillsCount] = await db
      .select({ count: count() })
      .from(skills)
      .where(eq(skills.userId, req.userId!));

    // Get recent matches
    const recentMatches = await db
      .select()
      .from(jobAnalyses)
      .where(eq(jobAnalyses.userId, req.userId!))
      .orderBy(desc(jobAnalyses.createdAt))
      .limit(5);

    // Get top skills
    const topSkills = await db
      .select()
      .from(skills)
      .where(eq(skills.userId, req.userId!))
      .orderBy(desc(skills.proficiencyLevel))
      .limit(10);

    res.json({
      stats: {
        jobsAnalyzed: jobsCount.count || 0,
        averageMatch: Math.round(Number(avgMatch.avg) || 0),
        skillsMatched: skillsCount.count || 0,
        timeSaved: `${Math.floor((jobsCount.count || 0) * 0.5)}h`, // Estimate 30min per job
      },
      recentMatches: recentMatches.map((job) => ({
        id: job.id,
        score: job.matchScore,
        title: job.jobTitle,
        company: job.company,
        location: job.location,
        status: job.status,
        createdAt: job.createdAt,
      })),
      topSkills: topSkills.map((skill) => ({
        skill: skill.skillName,
        percentage: skill.proficiencyLevel,
        status: skill.status,
      })),
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

export default router;
