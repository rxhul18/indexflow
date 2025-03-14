import { checkBot } from "@/actions/checks/check.bot";
import { paginationSchema, serverSchema } from "@/lib/zod/ schema";
import { zValidator } from "@/lib/zod/validator";
import { cache } from "@iflow/cache";
import { prisma } from "@iflow/db";
import { ServerType } from "@iflow/types";
import { Hono } from "hono";
import { ZodError } from "zod";

const CACHE_EXPIRY = 60;

const server = new Hono()

  .get("/all", zValidator("query", paginationSchema), async (c) => {
    const { cursor, take } = c.req.valid("query");
    const cacheKey = `servers:all:${cursor || "start"}:${take}`;

    let response: { nextCursor: string | null; users: ServerType[] } | null =
      null;

    try {
      const cachedData = await cache.get<{
        nextCursor: string | null;
        users: ServerType[];
      } | null>(cacheKey);

      if (cachedData && cachedData.users) {
        response = {
          nextCursor: cachedData.nextCursor,
          users: cachedData.users,
        };
        console.log("Returned server list from cache");
      }
    } catch (error) {
      console.error("Cache parsing error (all):", error);
    }

    if (!response) {
      if (!c.req.url.includes("?cursor=")) {
        return c.redirect("?cursor=");
      }

      const users: ServerType[] = await prisma.server.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
      });

      // Ensure users exist before returning
      if (!users || users.length === 0) {
        return c.json({ message: "No servers found", status: 404 }, 404);
      }

      const nextCursor = users.length > 0 ? users[users.length - 1].id : null;
      response = { nextCursor, users };

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
  .post("/create", zValidator("json", serverSchema), async (c) => {
    const body = c.req.valid("json");
    try {
      const newServer = await prisma.server.create({
        data: {
          id: body.id,
          name: body.name,
          owner_id: body.owner_id,
          logo: body.logo || null,
          invite_url: body.invite_url!,
          is_config: false,
          config_id: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return c.json({ newServer }, 200);
    } catch (error) {
      console.log(error);
    }
  })

  .get("/:id", async (c) => {
    const serverID = c.req.param("id");

    if (!serverID) {
      return c.json({
        message: "Server ID is required",
        status: 400,
      });
    }

    const cacheKey = `server:${serverID}`;
    let server: unknown = null;

    try {
      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        server = cachedData;
        console.log("Returned server data from cache (by ID)");
      }
    } catch (error) {
      console.error("Cache parsing error (by ID):", error);
    }

    if (!server) {
      server = await prisma.server.findUnique({
        where: { id: serverID },
      });

      if (server) {
        console.log("Fetched server data from database (by ID)");
        try {
          await cache.set(cacheKey, server, { ex: CACHE_EXPIRY });
        } catch (cacheError) {
          console.error(
            "Error storing server data in cache (by ID):",
            cacheError,
          );
        }
      }
    }

    try {
      const validatedServer = serverSchema.parse(server);
      return c.json({ user: validatedServer }, 200);
    } catch (error) {
      if (error instanceof ZodError) {
        return c.json(
          {
            message: "Invalid server data",
            errors: error.errors,
            status: 500,
          },
          500,
        );
      }
      console.error("Unexpected error during validation:", error);
      return c.json({ message: "Internal Server Error", status: 500 }, 500);
    }
  });

export default server;
