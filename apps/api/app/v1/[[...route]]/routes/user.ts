import { auth } from "@iflow/auth";
import { cache } from "@iflow/cache";
import { Hono } from "hono";
import { prisma } from "@iflow/db";
import { ZodError } from "zod";
import { paginationSchema, userSchema, userUpdateSchema } from "@/lib/zod/schema";
import { checkLogin } from "@/actions/checks/check.login";
import { checkAdmin } from "@/actions/checks/check.admin";
import { zValidator } from "@/lib/zod/validator";
import { UserPubType, UserType } from "@iflow/types";

const CACHE_EXPIRY = 169;

const user = new Hono()
  .get("/self", async (c) => {
    const currentUser = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!currentUser) {
      return c.json(
        {
          message: "Oops! Seems like your session has expired",
          status: 400,
        },
        400,
      );
    }

    const cacheKey = `user:self:${currentUser.user.id}`;
    let user: unknown = null;

    try {
      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        user = cachedData;
        console.log("Returned user data from cache");
      }
    } catch (error) {
      console.error("Cache parsing error (self):", error);
    }

    if (!user) {
      user = await prisma.user.findUnique({
        where: {
          id: currentUser.user.id,
        },
      });

      if (user) {
        console.log("Fetched user data from database (self)");
        try {
          await cache.set(cacheKey, user, { ex: CACHE_EXPIRY });
        } catch (cacheError) {
          console.error("Error storing user data in cache (self):", cacheError);
        }
      }
    }

    try {
      const validatedUser = userSchema.parse(user);
      return c.json({ user: validatedUser }, 200);
    } catch (error) {
      if (error instanceof ZodError) {
        return c.json(
          {
            message: "Invalid user data",
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

  .get("/public", zValidator("query", paginationSchema), async (c) => {
    const { cursor, take } = c.req.valid("query");
    const cacheKey = `users:pub:all:${cursor || "start"}:${take}`;

    let response: { nextCursor: string | null; users: UserPubType[] } | null =
      null;

    try {
      const cachedData = await cache.get<{
        nextCursor: string | null;
        users: UserPubType[];
      } | null>(cacheKey);

      if (cachedData && cachedData.users) {
        response = {
          nextCursor: cachedData.nextCursor,
          users: cachedData.users,
        };
        console.log("Returned user list from cache");
      }
    } catch (error) {
      console.error("Cache parsing error (all):", error);
    }

    if (!response) {
      if (!c.req.url.includes("?cursor=")) {
        return c.redirect("?cursor=");
      }

      const users: UserPubType[] = await prisma.user.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          location: true,
          active: true,
          recentTags: true,
          reputation: true,
        },
      });

      // Ensure users exist before returning
      if (!users || users.length === 0) {
        return c.json({ message: "No users found", status: 404 }, 404);
      }

      const nextCursor = users.length > 0 ? users[users.length - 1].id : null;
      response = { nextCursor, users };

      console.log("Fetched user list from database (all)");
      try {
        await cache.set(cacheKey, response, { ex: CACHE_EXPIRY });
      } catch (cacheError) {
        console.error("Error storing user list in cache (all):", cacheError);
      }
    }

    return c.json(response, 200);
  })

  .use(checkLogin)

  .put("/update", zValidator("json", userUpdateSchema), async (c) => {
    const body = c.req.valid("json");
    const { id, ...updateData } = body;
    try {
      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: {
          ...updateData,
          updatedAt: new Date(),
          recentTags: updateData.recentTags ?? [],
        },
      });

      // Invalidate cache if exists
      const cacheKey = `user:${body.id}`;
      try {
        await cache.del(cacheKey);
      } catch (cacheError) {
        console.error("Error deleting user cache (update):", cacheError);
      }

      return c.json({ updatedUser }, 200);
    } catch (error) {
      console.log("Error updating user:", error);
      return c.json({ message: "Failed to update user", status: 500 }, 500);
    }
  })

  .use(checkAdmin)

  .get("/all", zValidator("query", paginationSchema), async (c) => {
    const { cursor, take } = c.req.valid("query");
    const cacheKey = `users:all:${cursor || "start"}:${take}`;

    let response: { nextCursor: string | null; users: UserType[] } | null =
      null;

    try {
      const cachedData = await cache.get<{
        nextCursor: string | null;
        users: UserType[];
      } | null>(cacheKey);

      if (cachedData && cachedData.users) {
        response = {
          nextCursor: cachedData.nextCursor,
          users: cachedData.users,
        };
        console.log("Returned user list from cache");
      }
    } catch (error) {
      console.error("Cache parsing error (all):", error);
    }

    if (!response) {
      if (!c.req.url.includes("?cursor=")) {
        return c.redirect("?cursor=");
      }

      const users: UserType[] = await prisma.user.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
      });

      // Ensure users exist before returning
      if (!users || users.length === 0) {
        return c.json({ message: "No users found", status: 404 }, 404);
      }

      const nextCursor = users.length > 0 ? users[users.length - 1].id : null;
      response = { nextCursor, users };

      console.log("Fetched user list from database (all)");
      try {
        await cache.set(cacheKey, response, { ex: CACHE_EXPIRY });
      } catch (cacheError) {
        console.error("Error storing user list in cache (all):", cacheError);
      }
    }

    return c.json(response, 200);
  })

  .get("/:id", async (c) => {
    const userId = c.req.param("id");

    if (!userId) {
      return c.json({
        message: "User ID is required",
        status: 400,
      });
    }

    const cacheKey = `user:${userId}`;
    let user: unknown = null;

    try {
      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        user = cachedData;
        console.log("Returned user data from cache (by ID)");
      }
    } catch (error) {
      console.error("Cache parsing error (by ID):", error);
    }

    if (!user) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        console.log("Fetched user data from database (by ID)");
        try {
          await cache.set(cacheKey, user, { ex: CACHE_EXPIRY });
        } catch (cacheError) {
          console.error(
            "Error storing user data in cache (by ID):",
            cacheError,
          );
        }
      }
    }

    try {
      const validatedUser = userSchema.parse(user);
      return c.json({ user: validatedUser }, 200);
    } catch (error) {
      if (error instanceof ZodError) {
        return c.json(
          {
            message: "Invalid user data",
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

export type UserApiType = typeof user;
export default user;
