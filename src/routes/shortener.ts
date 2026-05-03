import { Hono } from "hono";
import { createId, init } from "@paralleldrive/cuid2";
import { db } from "@/db";
import { ShortenerSchema } from "@/db/schema/shortener";
import { errorResponse, successResponse } from "@/lib/response-helpers";
import { eq } from "drizzle-orm";

const app = new Hono();

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

app.post("/shorten", async (c) => {
  const { url } = await c.req.json();

  if (!isValidUrl(url)) {
    return errorResponse(c, "Invalid URL provided", 400);
  }

  const createCode = init({
    length: 5,
  });

  const shortenerData = {
    id: createId(),
    originalUrl: url,
    shortCode: createCode(),
    clicks: 0,
    createdAt: new Date(),
  } satisfies typeof ShortenerSchema.$inferInsert;

  await db.insert(ShortenerSchema).values(shortenerData);

  return successResponse(c, { shortened: shortenerData }, "URL shortened successfully", 201);
})

app.get("/stats/:shortCode", async (c) => {
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

  return successResponse(c, { stats: result[0] }, "Statistics retrieved successfully");
});

export { app as shortenerApp };