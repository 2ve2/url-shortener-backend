import { Hono } from "hono";
import { errorResponse, internalErrorResponse, successResponse } from "./lib/response-helpers";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { securityHeadersMiddleware } from "./middleware/security-headers";
import { shortenerApp } from "./routes/shortener";
import { redirectApp } from "./routes/redirect";

const app = new Hono();

app.onError((err, c) => {
  console.error("An error occurred:", err);

  // Handle HTTP exceptions (thrown by our application)
  if (err instanceof HTTPException) {
    return errorResponse(c, err.message, err.status);
  }

  return internalErrorResponse(c, "An unexpected error occurred. Please try again later.");
});

app.use("*", logger());
app.use("*", prettyJSON());
app.use("*", securityHeadersMiddleware);

app.route("/api", shortenerApp);

app.get("/", (c) => successResponse(c, { timestamp: new Date().toISOString() }, "API is running"));

app.route("/", redirectApp);

export default app;