import { Router } from "express";
import { db } from "../db/index.js";
import { skills } from "../db/schema.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Get all skills
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userSkills = await db
      .select()
      .from(skills)
      .where(eq(skills.userId, req.userId!));
    res.json(userSkills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// Add skill
router.post("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      skillName: z.string().min(1),
      proficiencyLevel: z.number().min(0).max(100).default(50),
      status: z.enum(["matched", "partial", "missing"]).default("matched"),
    });

    const data = schema.parse(req.body);

    const [skill] = await db
      .insert(skills)
      .values({
        userId: req.userId!,
        ...data,
      })
      .returning();

    res.status(201).json(skill);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to add skill" });
  }
});

// Update skill
router.put("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      skillName: z.string().min(1).optional(),
      proficiencyLevel: z.number().min(0).max(100).optional(),
      status: z.enum(["matched", "partial", "missing"]).optional(),
    });

    const data = schema.parse(req.body);

    const [skill] = await db
      .update(skills)
      .set(data)
      .where(eq(skills.id, req.params.id))
      .returning();

    res.json(skill);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Failed to update skill" });
  }
});

// Delete skill
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    await db.delete(skills).where(eq(skills.id, req.params.id));
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

export default router;
