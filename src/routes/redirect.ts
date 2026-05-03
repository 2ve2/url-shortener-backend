import { Hono } from "hono";
import { db } from "@/db";
import { ShortenerSchema } from "@/db/schema/shortener";
import { errorResponse } from "@/lib/response-helpers";
import { eq } from "drizzle-orm";

const app = new Hono();

app.get("/:shortCode", async (c) => {
  const { shortCode } = c.req.param();

  const result = await db
    .select({
      id: ShortenerSchema.id,
      originalUrl: ShortenerSchema.originalUrl,
      shortCode: ShortenerSchema.shortCode,
      clicks: ShortenerSchema.clicks,
      createdAt: ShortenerSchema.createdAt,
    })
    .from(ShortenerSchema)
    .where(eq(ShortenerSchema.shortCode, shortCode))
    .limit(1);

  if (!result.length) {
    return errorResponse(c, "Short URL not found", 404);
  }

  const shortener = result[0];

  await db
    .update(ShortenerSchema)
    .set({ clicks: shortener.clicks + 1 })
    .where(eq(ShortenerSchema.shortCode, shortener.shortCode));

  return c.redirect(shortener.originalUrl);
});

export { app as redirectApp };
