import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const matchStatusEnum = pgEnum("match_status", [
  "excellent",
  "good",
  "fair",
  "poor",
]);
export const skillStatusEnum = pgEnum("skill_status", [
  "matched",
  "partial",
  "missing",
]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Resumes table
export const resumes = pgTable("resumes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  fileName: varchar("file_name", { length: 255 }),
  fileUrl: text("file_url"),
  parsedContent: text("parsed_content"),
  skills: text("skills").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Job analyses table
export const jobAnalyses = pgTable("job_analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  jobTitle: varchar("job_title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  jobDescription: text("job_description").notNull(),
  requiredSkills: text("required_skills").array(),
  matchScore: integer("match_score").notNull(),
  status: matchStatusEnum("status").notNull(),
  analysisResult: jsonb("analysis_result"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Skills table
export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  skillName: varchar("skill_name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  proficiencyLevel: integer("proficiency_level").notNull().default(0),
  status: skillStatusEnum("status").notNull().default("missing"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Recommendations table
export const recommendations = pgTable("recommendations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  jobAnalysisId: uuid("job_analysis_id").references(() => jobAnalyses.id, {
    onDelete: "cascade",
  }),
  recommendationType: varchar("recommendation_type", { length: 100 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  resumes: many(resumes),
  jobAnalyses: many(jobAnalyses),
  skills: many(skills),
  recommendations: many(recommendations),
}));

export const resumesRelations = relations(resumes, ({ one }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
}));

export const jobAnalysesRelations = relations(jobAnalyses, ({ one, many }) => ({
  user: one(users, {
    fields: [jobAnalyses.userId],
    references: [users.id],
  }),
  recommendations: many(recommendations),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
  }),
}));

export const recommendationsRelations = relations(
  recommendations,
  ({ one }) => ({
    user: one(users, {
      fields: [recommendations.userId],
      references: [users.id],
    }),
    jobAnalysis: one(jobAnalyses, {
      fields: [recommendations.jobAnalysisId],
      references: [jobAnalyses.id],
    }),
  })
);
