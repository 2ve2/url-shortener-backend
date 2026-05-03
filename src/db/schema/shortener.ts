import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const ShortenerSchema = pgTable(
  "shortener",
  {
    id: text("id").primaryKey(),
    originalUrl: text("original_url").notNull(),
    shortCode: text("shortener_url").notNull().unique(),
    clicks: integer("clicks").notNull().default(0),
    createdAt: timestamp("created_at")
      .$defaultFn(() => new Date())
      .notNull()
  }
);