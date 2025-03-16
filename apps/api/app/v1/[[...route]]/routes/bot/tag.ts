import { checkBot } from "@/actions/checks/check.bot";
import { paginationSchema, tagSchema } from "@/lib/zod/ schema";
import { zValidator } from "@/lib/zod/validator";
import { cache } from "@iflow/cache";
import { prisma } from "@iflow/db";
import { TagType } from "@iflow/types";
import { Hono } from "hono";

const CACHE_EXPIRY = 60;

const tag = new Hono()

  .get("/all", zValidator("query", paginationSchema), async (c) => {
    const { cursor, take } = c.req.valid("query");
    const cacheKey = `tags:all:${cursor || "start"}:${take}`;

    let response: { nextCursor: string | null; tags: TagType[] } | null = null;

    try {
      const cachedData = await cache.get<{
        nextCursor: string | null;
        tags: TagType[];
      } | null>(cacheKey);

      if (cachedData && cachedData.tags) {
        response = {
          nextCursor: cachedData.nextCursor,
          tags: cachedData.tags,
        };
        console.log("Returned tags list from cache");
      }
    } catch (error) {
      console.error("Cache parsing error (all):", error);
    }

    if (!response) {
      if (!c.req.url.includes("?cursor=")) {
        return c.redirect("?cursor=");
      }

      const tags: TagType[] = await prisma.tags.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
      });

      // Ensure tags exist before returning
      if (!tags || tags.length === 0) {
        return c.json({ message: "No tagss found", status: 404 }, 404);
      }

      const nextCursor = tags.length > 0 ? tags[tags.length - 1].id : null;
      response = { nextCursor, tags };

      console.log("Fetched tags list from database (all)");
      try {
        await cache.set(cacheKey, response, { ex: CACHE_EXPIRY });
      } catch (cacheError) {
        console.error("Error storing tags list in cache (all):", cacheError);
      }
    }

    return c.json(response, 200);
  })
  .use(checkBot)

  .post("/create", zValidator("json", tagSchema), async (c) => {
    const body = c.req.valid("json");
    try {
      const newTag = await prisma.tags.create({
        data: {
          id: body.id,
          name: body.name,
          posts: [],
          usages: 0,
          usedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return c.json({ newTag }, 200);
    } catch (error) {
      console.log(error);
    }
  });

export type TagApiType = typeof tag;
export default tag;
