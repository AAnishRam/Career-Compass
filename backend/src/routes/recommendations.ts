import { Router } from "express";
import { db } from "../db/index.js";
import { jobAnalyses, userRecommendationProgress } from "../db/schema.js";
import { eq, and, desc } from "drizzle-orm";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Get all recommendations for the current user
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    // Get all job analyses for the user
    const analyses = await db
      .select()
      .from(jobAnalyses)
      .where(eq(jobAnalyses.userId, userId))
      .orderBy(desc(jobAnalyses.createdAt));

    // Extract and aggregate recommendations
    const allRecommendations: any[] = [];

    for (const analysis of analyses) {
      const analysisResult = analysis.analysisResult as any;

      if (analysisResult && Array.isArray(analysisResult.recommendations)) {
        analysisResult.recommendations.forEach((rec: any, index: number) => {
          // Handle both old string format and new object format
          if (typeof rec === "string") {
            allRecommendations.push({
              id: `${analysis.id}-${index}`,
              jobAnalysisId: analysis.id,
              jobTitle: analysis.jobTitle,
              company: analysis.company,
              recommendationIndex: index,
              title: `Recommendation ${index + 1}`,
              description: rec,
              priority: index < 2 ? "high" : "medium",
              type: "improve",
              actionItems: [],
              resources: [],
              status: "pending",
            });
          } else {
            allRecommendations.push({
              id: `${analysis.id}-${index}`,
              jobAnalysisId: analysis.id,
              jobTitle: analysis.jobTitle,
              company: analysis.company,
              recommendationIndex: index,
              title: rec.title,
              description: rec.description,
              priority: rec.priority || "medium",
              type: "improve",
              actionItems: rec.actionItems || [],
              resources: rec.resources || [],
              status: "pending",
            });
          }
        });
      }
    }

    // Get user's progress for these recommendations
    const progressRecords = await db
      .select()
      .from(userRecommendationProgress)
      .where(eq(userRecommendationProgress.userId, userId));

    // Map progress to recommendations
    const progressMap = new Map(
      progressRecords.map((p) => [
        `${p.jobAnalysisId}-${p.recommendationIndex}`,
        p,
      ])
    );

    // Update recommendations with user progress
    const recommendationsWithProgress = allRecommendations.map((rec) => {
      const progress = progressMap.get(rec.id);
      return {
        ...rec,
        status: progress?.status || "pending",
        completedAt: progress?.completedAt,
        notes: progress?.notes,
        progressId: progress?.id,
      };
    });

    // Apply filters if provided
    const { priority, status, search } = req.query;

    let filtered = recommendationsWithProgress;

    if (priority) {
      filtered = filtered.filter((r) => r.priority === priority);
    }

    if (status) {
      filtered = filtered.filter((r) => r.status === status);
    }

    if (search && typeof search === "string") {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower)
      );
    }

    res.json(filtered);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

// Get recommendation statistics
router.get("/stats", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    // Get all job analyses
    const analyses = await db
      .select()
      .from(jobAnalyses)
      .where(eq(jobAnalyses.userId, userId));

    // Count total recommendations
    let totalRecommendations = 0;
    for (const analysis of analyses) {
      const analysisResult = analysis.analysisResult as any;
      if (analysisResult && Array.isArray(analysisResult.recommendations)) {
        totalRecommendations += analysisResult.recommendations.length;
      }
    }

    // Get progress records
    const progressRecords = await db
      .select()
      .from(userRecommendationProgress)
      .where(eq(userRecommendationProgress.userId, userId));

    const completed = progressRecords.filter(
      (p) => p.status === "completed"
    ).length;
    const inProgress = progressRecords.filter(
      (p) => p.status === "in_progress"
    ).length;
    const pending = totalRecommendations - completed - inProgress;

    const completionPercentage =
      totalRecommendations > 0
        ? Math.round((completed / totalRecommendations) * 100)
        : 0;

    res.json({
      total: totalRecommendations,
      completed,
      inProgress,
      pending,
      completionPercentage,
    });
  } catch (error) {
    console.error("Error fetching recommendation stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Update recommendation status
router.patch(
  "/:jobAnalysisId/:index/status",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const { jobAnalysisId, index } = req.params;
      const { status, notes } = req.body;

      if (!["pending", "in_progress", "completed"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      // Check if progress record exists
      const existing = await db
        .select()
        .from(userRecommendationProgress)
        .where(
          and(
            eq(userRecommendationProgress.userId, userId),
            eq(userRecommendationProgress.jobAnalysisId, jobAnalysisId),
            eq(userRecommendationProgress.recommendationIndex, parseInt(index))
          )
        );

      if (existing.length > 0) {
        // Update existing record
        const [updated] = await db
          .update(userRecommendationProgress)
          .set({
            status,
            notes: notes || existing[0].notes,
            completedAt: status === "completed" ? new Date() : null,
            updatedAt: new Date(),
          })
          .where(eq(userRecommendationProgress.id, existing[0].id))
          .returning();

        res.json(updated);
      } else {
        // Create new record
        const [created] = await db
          .insert(userRecommendationProgress)
          .values({
            userId,
            jobAnalysisId,
            recommendationIndex: parseInt(index),
            status,
            notes,
            completedAt: status === "completed" ? new Date() : null,
          })
          .returning();

        res.json(created);
      }
    } catch (error) {
      console.error("Error updating recommendation status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  }
);

export default router;
