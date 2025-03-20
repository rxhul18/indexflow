import { checkBot } from "@/actions/checks/check.bot";
import { paginationSchema } from "@/lib/zod/schema";
import { zValidator } from "@/lib/zod/validator";
import { cache } from "@iflow/cache";
import { prisma } from "@iflow/db";
import { ConfigType } from "@iflow/types";
import { Hono } from "hono";

const CACHE_EXPIRY = 69;

const config = new Hono()

.get("/all", zValidator("query", paginationSchema), async (c) => {
    const { cursor, take } = c.req.valid("query");
    const cacheKey = `configs:all:${cursor || "start"}:${take}`;

    let response: { nextCursor: string | null; configs: ConfigType[] } | null =
      null;

    try {
      const cachedData = await cache.get<{
        nextCursor: string | null;
        configs: ConfigType[];
      } | null>(cacheKey);

      if (cachedData && cachedData.configs) {
        response = {
          nextCursor: cachedData.nextCursor,
          configs: cachedData.configs,
        };
        console.log("Returned configs list from cache");
      }
    } catch (error) {
      console.error("Cache parsing error (all):", error);
    }

    if (!response) {
      if (!c.req.url.includes("?cursor=")) {
        return c.redirect("?cursor=");
      }

      const configs: ConfigType[] = await prisma.configs.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
      });

      // Ensure configs exist before returning
      if (!configs || configs.length === 0) {
        return c.json({ message: "No configs found", status: 404 }, 404);
      }

      const nextCursor =
        configs.length > 0 ? configs[configs.length - 1].id : null;
      response = { nextCursor, configs };

      console.log("Fetched server list from database (all)");
      try {
        await cache.set(cacheKey, response, { ex: CACHE_EXPIRY });
      } catch (cacheError) {
        console.error("Error storing server list in cache (all):", cacheError);
      }
    }

    return c.json(response, 200);
  })

  .use(checkBot)


export type ConfigApiType = typeof config;
export default config;