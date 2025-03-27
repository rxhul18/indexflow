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
    analytics: true, 
  });

  const key =
  session?.session.ipAddress?.toString() ||
  session?.session.userId?.toString() ||
  c.req.header("CF-Connecting-IP") ||
  c.req.header("X-Forwarded-For") ||
  c.req.raw.headers.get("x-real-ip") ||
  c.req.raw.headers.get("host") ||
  "fallback-anon-key";

  const { success } = await rateLimit.limit(key);

  if (!success) {
    return c.json({ message: "You hit the rate limit" }, 429);
  }
  return await next();
};
