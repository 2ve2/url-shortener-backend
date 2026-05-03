CREATE TABLE "shortener" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"shortener_url" text NOT NULL,
	"clicks" text DEFAULT '0' NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "shortener_shortener_url_unique" UNIQUE("shortener_url")
);
