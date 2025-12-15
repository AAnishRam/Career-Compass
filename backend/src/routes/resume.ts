import { Router } from "express";
import multer from "multer";
import { db } from "../db/index.js";
import { resumes, skills } from "../db/schema.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
import { extractTextFromPDF } from "../services/pdfParser.js";
import { extractSkillsFromResume } from "../services/gemini.js";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760"), // 10MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "text/plain") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and text files are allowed"));
    }
  },
});

// Upload resume (PDF or text)
router.post(
  "/upload",
  authenticateToken,
  upload.single("resume"),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      let parsedContent = "";

      // Extract text based on file type
      if (req.file.mimetype === "application/pdf") {
        parsedContent = await extractTextFromPDF(req.file.buffer);
      } else {
        parsedContent = req.file.buffer.toString("utf-8");
      }

      // Extract skills using Gemini AI
      const extractedSkills = await extractSkillsFromResume(parsedContent);

      // Save resume to database
      const [resume] = await db
        .insert(resumes)
        .values({
          userId: req.userId!,
          fileName: req.file.originalname,
          parsedContent,
          skills: extractedSkills,
        })
        .returning();

      // Save skills to skills table
      if (extractedSkills.length > 0) {
        await db.insert(skills).values(
          extractedSkills.map((skill) => ({
            userId: req.userId!,
            skillName: skill,
            proficiencyLevel: 70, // Default proficiency
            status: "matched" as const,
          }))
        );
      }

      res.status(201).json({
        resume: {
          id: resume.id,
          fileName: resume.fileName,
          skillsExtracted: extractedSkills.length,
        },
        skills: extractedSkills,
      });
    } catch (error: any) {
      console.error("Resume upload error:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to process resume" });
    }
  }
);

// Add resume as text
router.post("/text", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const schema = z.object({
      content: z.string().min(50),
    });

    const { content } = schema.parse(req.body);

    // Extract skills using Gemini AI
    const extractedSkills = await extractSkillsFromResume(content);

    // Save resume to database
    const [resume] = await db
      .insert(resumes)
      .values({
        userId: req.userId!,
        fileName: "Text Resume",
        parsedContent: content,
        skills: extractedSkills,
      })
      .returning();

    // Save skills to skills table
    if (extractedSkills.length > 0) {
      await db.insert(skills).values(
        extractedSkills.map((skill) => ({
          userId: req.userId!,
          skillName: skill,
          proficiencyLevel: 70,
          status: "matched" as const,
        }))
      );
    }

    res.status(201).json({
      resume: {
        id: resume.id,
        skillsExtracted: extractedSkills.length,
      },
      skills: extractedSkills,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: error.errors });
    }
    res
      .status(500)
      .json({ error: error.message || "Failed to process resume" });
  }
});

// Get user's resume
router.get("/", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, req.userId!));
    res.json(userResumes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

// Delete resume
router.delete("/:id", authenticateToken, async (req: AuthRequest, res) => {
  try {
    await db.delete(resumes).where(eq(resumes.id, req.params.id));
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete resume" });
  }
});

export default router;
