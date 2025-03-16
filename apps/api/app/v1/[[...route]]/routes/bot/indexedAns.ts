import { checkBot } from "@/actions/checks/check.bot";
import { indexedAnsSchema, paginationSchema } from "@/lib/zod/ schema";
import { zValidator } from "@/lib/zod/validator";
import { cache } from "@iflow/cache";
import { prisma } from "@iflow/db";
import { IndexAnsType } from "@iflow/types";
import { Hono } from "hono";

const CACHE_EXPIRY = 60;

const indexedAns = new Hono()

  .get("/all", zValidator("query", paginationSchema), async (c) => {
    const { cursor, take } = c.req.valid("query");
    const cacheKey = `indexed:ans:all:${cursor || "start"}:${take}`;

    let response: { nextCursor: string | null; ans: IndexAnsType[] } | null =
      null;

    try {
      const cachedData = await cache.get<{
        nextCursor: string | null;
        ans: IndexAnsType[];
      } | null>(cacheKey);

      if (cachedData && cachedData.ans) {
        response = {
          nextCursor: cachedData.nextCursor,
          ans: cachedData.ans,
        };
        console.log("Returned ans list from cache");
      }
    } catch (error) {
      console.error("Cache parsing error (all):", error);
    }

    if (!response) {
      if (!c.req.url.includes("?cursor=")) {
        return c.redirect("?cursor=");
      }

      const ans: IndexAnsType[] = await prisma.indexedAns.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
      });

      // Ensure qns exist before returning
      if (!ans || ans.length === 0) {
        return c.json({ message: "No ans found", status: 404 }, 404);
      }

      const nextCursor = ans.length > 0 ? ans[ans.length - 1].id : null;
      response = { nextCursor, ans };

      console.log("Fetched ans list from database (all)");
      try {
        await cache.set(cacheKey, response, { ex: CACHE_EXPIRY });
      } catch (cacheError) {
        console.error("Error storing ans list in cache (all):", cacheError);
      }
    }

    return c.json(response, 200);
  })
  .use(checkBot)

  .post("/create", zValidator("json", indexedAnsSchema), async (c) => {
    const body = c.req.valid("json");
    try {
      const newAns = await prisma.indexedAns.create({
        data: {
          id: body.id,
          author: body.author,
          content: body.content,
          qns_id: body.qns_id,
          server_id: body.server_id,
          msg_url: body.msg_url,
          thread_id: body.thread_id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return c.json({ newAns }, 200);
    } catch (error) {
      console.log(error);
    }
  });
export type IndexedAnsApiType = typeof indexedAns;
export default indexedAns;
