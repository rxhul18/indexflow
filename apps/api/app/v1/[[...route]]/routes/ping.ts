import { cache } from "@iflow/cache";
import { prisma } from "@iflow/db";
import { Hono } from "hono";

const CACHE_EXPIRY = 169;

const ping = new Hono()

  // Route to measure cache latency
  .get("/cache", async (c) => {
    const start = Date.now();
    await cache.set("iflow-ping", "pong", { ex: CACHE_EXPIRY });
    await cache.get("iflow-ping");
    const latency = Date.now() - start;

    return c.json({ message: "Cache latency", latency });
  })

  // Route to measure Prisma database latency
  .get("/db", async (c) => {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return c.json({ message: "Database latency", latency });
  });

export type DataApiType = typeof ping;
export default ping;
