import { Ratelimit } from "@upstash/ratelimit";
import { auth as Auth } from "@iflow/auth";
import { cache } from "@iflow/cache";
import { Context, Next } from "hono";

export const rateLimitHandler = async (c: Context, next: Next) => {
  const session = await Auth.api.getSession({ headers: c.req.raw.headers });

  // const limit = process.env.NODE_ENV === "production" ? 60 : 5; // for testing
  const limit = process.env.NODE_ENV === "production" ? 20 : 100;

  const rateLimit = new Ratelimit({
    redis: cache,
    limiter: Ratelimit.slidingWindow(limit, "1m"),
    analytics: true, // store analytics data in redis db
  });

  const { success } = await rateLimit.limit(
    session?.session.ipAddress || session?.session.userId || "anonymous",
  );

  if (!success) {
    return c.json({ message: "You hit the rate limit" }, 429);
  }
  return await next();
};
