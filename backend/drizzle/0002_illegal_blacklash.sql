CREATE TYPE "public"."recommendation_status" AS ENUM('pending', 'in_progress', 'completed');--> statement-breakpoint
CREATE TABLE "user_recommendation_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_analysis_id" uuid NOT NULL,
	"recommendation_index" integer NOT NULL,
	"status" "recommendation_status" DEFAULT 'pending' NOT NULL,
	"completed_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_recommendation_progress" ADD CONSTRAINT "user_recommendation_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recommendation_progress" ADD CONSTRAINT "user_recommendation_progress_job_analysis_id_job_analyses_id_fk" FOREIGN KEY ("job_analysis_id") REFERENCES "public"."job_analyses"("id") ON DELETE cascade ON UPDATE no action;