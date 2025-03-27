import { checkBot } from "@/actions/checks/check.bot";
import { anonProfileSchema, paginationSchema } from "@/lib/zod/schema";
import { zValidator } from "@/lib/zod/validator";
import { cache } from "@iflow/cache";
import { prisma } from "@iflow/db";
import { AnonProfileType } from "@iflow/types";
import { Hono } from "hono";

const CACHE_EXPIRY = 69;

const profile = new Hono()

  .get("/all", zValidator("query", paginationSchema), async (c) => {
    const { cursor, take } = c.req.valid("query");
    const cacheKey = `profile:all:${cursor || "start"}:${take}`;

    let response: {
      nextCursor: string | null;
      profile: AnonProfileType[];
    } | null = null;

    try {
      const cachedData = await cache.get<{
        nextCursor: string | null;
        profile: AnonProfileType[];
      } | null>(cacheKey);

      if (cachedData && cachedData.profile) {
        response = {
          nextCursor: cachedData.nextCursor,
          profile: cachedData.profile,
        };
        console.log("Returned profile list from cache");
      }
    } catch (error) {
      console.error("Cache parsing error (all):", error);
    }

    if (!response) {
      if (!c.req.url.includes("?cursor=")) {
        return c.redirect("?cursor=");
      }

      const profile: AnonProfileType[] = await prisma.anonProfile.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
      });

      // Ensure profile exist before returning
      if (!profile || profile.length === 0) {
        return c.json({ message: "No profile found", status: 404 }, 404);
      }

      const nextCursor =
        profile.length > 0 ? profile[profile.length - 1].id : null;
      response = { nextCursor, profile };

      console.log("Fetched config list from database (all)");
      try {
        await cache.set(cacheKey, response, { ex: CACHE_EXPIRY });
      } catch (cacheError) {
        console.error("Error storing config list in cache (all):", cacheError);
      }
    }

    return c.json(response, 200);
  })

  .use(checkBot)

  .post("/create", zValidator("json", anonProfileSchema), async (c) => {
    const body = c.req.valid("json");
    try {
      const newProfile = await prisma.anonProfile.create({
        data: {
          id: body.id,
          name: body.name,
          pfp: body.pfp,
          uid: body.uid,
          dc_uid: body.dc_uid,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return c.json({ newProfile }, 200);
    } catch (error) {
      console.log(error);
    }
  });

export type ProfileApiType = typeof profile;
export default profile;
