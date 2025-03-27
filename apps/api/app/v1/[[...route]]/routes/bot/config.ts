import { checkBot } from "@/actions/checks/check.bot";
import { configSchema, paginationSchema } from "@/lib/zod/schema";
import { zValidator } from "@/lib/zod/validator";
import { cache } from "@iflow/cache";
import { prisma } from "@iflow/db";
import { ConfigType } from "@iflow/types";
import { Hono } from "hono";
import { ZodError } from "zod";

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

  .get("/:id", async (c) => {
    const configID = c.req.param("id");

    if (!configID) {
      return c.json({
        message: "Config ID is required",
        status: 400,
      });
    }

    const cacheKey = `config:${configID}`;
    let config: unknown = null;

    try {
      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        config = cachedData;
        console.log("Returned config data from cache (by ID)");
      }
    } catch (error) {
      console.error("Cache parsing error (by ID):", error);
    }

    if (!config) {
      config = await prisma.configs.findUnique({
        where: { id: configID },
      });

      if (config) {
        console.log("Fetched config data from database (by ID)");
        try {
          await cache.set(cacheKey, config, { ex: CACHE_EXPIRY });
        } catch (cacheError) {
          console.error(
            "Error storing config data in cache (by ID):",
            cacheError,
          );
        }
      }
    }

    try {
      const validateConfig = configSchema.parse(config);
      return c.json({ config: validateConfig }, 200);
    } catch (error) {
      if (error instanceof ZodError) {
        return c.json(
          {
            message: "Invalid config data",
            errors: error.errors,
            status: 500,
          },
          500,
        );
      }
      console.error("Unexpected error during validation:", error);
      return c.json({ message: "Internal Server Error", status: 500 }, 500);
    }
  })

  .post("/create", zValidator("json", configSchema), async (c) => {
    const body = c.req.valid("json");
    try {
      const newConfig = await prisma.configs.create({
        data: {
          id: body.id,
          server_id: body.server_id,
          qna_channel: body.qna_channel,
          qna_channel_webhook: body.qna_channel_webhook,
          qna_endpoint: body.qna_endpoint,
          mod_role: body.mod_role,
          log_channel: body.log_channel,
          log_channel_webhook: body.log_channel_webhook,
          system_channel: body.system_channel,
  system_channel_webhook: body.system_channel_webhook,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return c.json({ newConfig }, 200);
    } catch (error) {
      console.log(error);
    }
  });

export type ConfigApiType = typeof config;
export default config;
