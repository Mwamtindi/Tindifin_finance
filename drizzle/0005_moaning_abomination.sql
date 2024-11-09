CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"action" text NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
