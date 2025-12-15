import { Router } from "express";
import { db } from "../db/index.js";
import {
  users,
  jobAnalyses,
  skills,
  resumes,
  userRecommendationProgress,
} from "../db/schema.js";
import { eq } from "drizzle-orm";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import bcrypt from "bcryptjs";
import { z } from "zod";

const router = Router();

// Get user profile
router.get("/profile", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, req.userId!));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update user profile
router.patch("/profile", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const updateSchema = z.object({
      name: z.string().min(1, "Name is required").max(255),
    });

    const { name } = updateSchema.parse(req.body);

    const [updatedUser] = await db
      .update(users)
      .set({ name, updatedAt: new Date() })
      .where(eq(users.id, req.userId!))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      });

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Change password
router.post(
  "/change-password",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const passwordSchema = z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
          .string()
          .min(6, "New password must be at least 6 characters"),
      });

      const { currentPassword, newPassword } = passwordSchema.parse(req.body);

      // Get user with password
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.userId!));

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );
      if (!isValidPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      await db
        .update(users)
        .set({ passwordHash: newPasswordHash, updatedAt: new Date() })
        .where(eq(users.id, req.userId!));

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error changing password:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  }
);

// Export user data
router.get("/export-data", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;

    // Fetch all user data
    const [userData] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId));

    const userJobAnalyses = await db
      .select()
      .from(jobAnalyses)
      .where(eq(jobAnalyses.userId, userId));

    const userSkills = await db
      .select()
      .from(skills)
      .where(eq(skills.userId, userId));

    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId));

    const userProgress = await db
      .select()
      .from(userRecommendationProgress)
      .where(eq(userRecommendationProgress.userId, userId));

    const exportData = {
      user: userData,
      jobAnalyses: userJobAnalyses,
      skills: userSkills,
      resumes: userResumes,
      recommendationProgress: userProgress,
      exportedAt: new Date().toISOString(),
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="career-compass-data-${Date.now()}.json"`
    );
    res.json(exportData);
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).json({ error: "Failed to export data" });
  }
});

// Delete account
router.delete("/account", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const deleteSchema = z.object({
      password: z.string().min(1, "Password is required"),
    });

    const { password } = deleteSchema.parse(req.body);

    // Get user with password
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!));

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Delete user (cascade will delete all related data)
    await db.delete(users).where(eq(users.id, req.userId!));

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

export default router;
