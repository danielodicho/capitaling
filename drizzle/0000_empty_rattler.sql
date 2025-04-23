CREATE TABLE "scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"score" integer NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL
);
