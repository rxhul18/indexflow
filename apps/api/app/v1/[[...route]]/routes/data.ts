import { cache } from "@iflow/cache";
import { ConfigType, QuestionType, ServerType } from "@iflow/types";
import { Hono } from "hono";

const CACHE_EXPIRY = 169;
const ALL_QUESTIONS_API_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/questions/all"
    : "https://api.indexflow.site/v1/questions/all";

const CONFIG_SERVER_API_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/bot/server/config/all"
    : "https://api.indexflow.site/v1/bot/server/config/all";

const SERVER_API_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/bot/server/all"
    : "https://api.indexflow.site/v1/bot/server/all";

const data = new Hono().post("/:id", async (c) => {
  try {
    const svID = c.req.param("id");

    if (!svID) {
      return c.json({
        message: "API endpoint is required",
        status: 400,
      });
    }

    const servers = await fetch(CONFIG_SERVER_API_ENDPOINT);
    const serversData = await servers.json();
    const isServer = serversData.configs.find(
      (server: ConfigType) => server.server_id === svID,
    );
    if (!isServer) {
      return c.json(
        {
          success: false,
          message: "API endpoint is not valid",
        },
        400,
      );
    }

    const { API_KEY } = await c.req.json();
    const key = API_KEY.startsWith("iflow_") ? API_KEY.substring(6) : API_KEY;
    const cacheKey = `api:data:${key}`;
    const cached = await cache.get(cacheKey);

    if (!API_KEY || !API_KEY.startsWith("iflow_")) {
      return c.json(
        {
          success: false,
          message: "API key is required or invalid",
        },
        400,
      );
    }

    if (key && isServer) {
      const servers = await fetch(SERVER_API_ENDPOINT);
      const serversData = await servers.json();
      const isOwner =
        serversData.servers.find(
          (server: ServerType) => server.id === isServer.server_id,
        ).owner_id === key;
      if (!isOwner || !serversData) {
        return c.json(
          {
            success: false,
            message: "API key is not valid or not authorized",
          },
          400,
        );
      }
    }

    if (cached) {
      console.log("Am hitting cache");
      return c.json(cached);
    }

    // Fetch questions from API
    const response = await fetch(ALL_QUESTIONS_API_ENDPOINT);
    const data = await response.json();

    // Filter questions by server_id matching the key
    const filteredQuestions = data.questions.filter(
      (question: QuestionType) => question.server_id === key,
    );

    const responseData = {
      success: true,
      data: filteredQuestions,
    };

    // Set filtered data to cache
    await cache.set(cacheKey, responseData, { ex: CACHE_EXPIRY });
    console.log("Am hitting DB");
    return c.json(responseData);
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Failed to process request",
        error: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});

export type DataApiType = typeof data;
export default data;
