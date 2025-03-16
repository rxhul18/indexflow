import { checkBot } from "@/actions/checks/check.bot";
import { indexedQnsSchema, paginationSchema } from "@/lib/zod/ schema";
import { zValidator } from "@/lib/zod/validator";
import { cache } from "@iflow/cache";
import { prisma } from "@iflow/db";
import { IndexQnsType } from "@iflow/types";
import { Hono } from "hono";

const CACHE_EXPIRY = 60;

const indexedQns = new Hono()

  .get("/all", zValidator("query", paginationSchema), async (c) => {
    const { cursor, take } = c.req.valid("query");
    const cacheKey = `indexed:qns:all:${cursor || "start"}:${take}`;

    let response: { nextCursor: string | null; qns: IndexQnsType[] } | null = null;

    try {
      const cachedData = await cache.get<{
        nextCursor: string | null;
        qns: IndexQnsType[];
      } | null>(cacheKey);

      if (cachedData && cachedData.qns) {
        response = {
          nextCursor: cachedData.nextCursor,
          qns: cachedData.qns,
        };
        console.log("Returned qns list from cache");
      }
    } catch (error) {
      console.error("Cache parsing error (all):", error);
    }

    if (!response) {
      if (!c.req.url.includes("?cursor=")) {
        return c.redirect("?cursor=");
      }

      const qns: IndexQnsType[] = await prisma.indexedQns.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
      });

      // Ensure qns exist before returning
      if (!qns || qns.length === 0) {
        return c.json({ message: "No qns found", status: 404 }, 404);
      }

      const nextCursor = qns.length > 0 ? qns[qns.length - 1].id : null;
      response = { nextCursor, qns };

      console.log("Fetched qns list from database (all)");
      try {
        await cache.set(cacheKey, response, { ex: CACHE_EXPIRY });
      } catch (cacheError) {
        console.error("Error storing qns list in cache (all):", cacheError);
      }
    }

    return c.json(response, 200);
  })
  .use(checkBot)

  .post("/create", zValidator("json", indexedQnsSchema), async (c) => {
    const body = c.req.valid("json");
    try {
      const newQns = await prisma.indexedQns.create({
        data: {
          id: body.id,
          title: body.title,
          author: body.author,
          content: body.content,
          server_id: body.server_id,
          msg_url: body.msg_url,
          thread_id: body.thread_id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return c.json({ newQns }, 200);
    } catch (error) {
      console.log(error);
    }
  })

export type IndexedQnsApiType = typeof indexedQns;
export default indexedQns;
