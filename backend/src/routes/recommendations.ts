import { Router } from "express";
import { db } from "../db/index.js";
import { recommendations } from "../db/schema.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { eq, desc } from "drizzle-orm";

const router = Router();

// Get all recommendations
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userRecommendations = await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.userId, req.userId!))
      .orderBy(desc(recommendations.createdAt));

    res.json(userRecommendations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// Get recommendations for specific job
router.get("/:jobId", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const jobRecommendations = await db
      .select()
      .from(recommendations)
      .where(eq(recommendations.jobAnalysisId, req.params.jobId));

    res.json(jobRecommendations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

export default router;
