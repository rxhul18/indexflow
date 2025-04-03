import { cache } from "@iflow/cache";
import { prisma } from "@iflow/db";
import { Hono } from "hono";
import { zValidator } from "@/lib/zod/validator";
import { ZodError } from "zod";
import { indexedAnsSchema, indexedQnsSchema } from "@/lib/zod/schema";
import { checkLogin } from "@/actions/checks/check.login";

const vote = new Hono()

.use(checkLogin)
.post("/qns", zValidator("json", indexedQnsSchema), async (c) => {
    const { id: postID, action } = await c.req.json();
    if (action !== 'increment' && action !== 'decrement') {
      return c.json({
        message: "Invalid vote type. Must be 'increment' or 'decrement'",
        status: 400
      });
    }

    if (!postID || !action) {
      return c.json({
        message: "Post ID & Action is required",
        status: 400,
      });
    }

    try {
      const updatedQNS = await prisma.indexedQns.update({
        where: { id: postID },
        data: action === 'increment' ? {
          up_votes: {
            increment: 1
          }
        } : {
          down_votes: {
            increment: 1
          }
        }
      });

      if (!updatedQNS) {
        return c.json({
          message: "Post not found",
          status: 404
        }, 404);
      }

      // Invalidate cache
      const cacheKey = `server:${postID}`;
      await cache.del(cacheKey);

      try {
        const vPost = indexedQnsSchema.parse(updatedQNS);
        return c.json({ post: vPost }, 200);
      } catch (error) {
        if (error instanceof ZodError) {
          return c.json(
            {
              message: "Invalid post data",
              errors: error.errors,
              status: 500,
            },
            500,
          );
        }
        throw error;
      }

    } catch (error) {
      console.error("Error updating post votes:", error);
      return c.json({ message: "Internal Server Error", status: 500 }, 500);
    }
  })

.post("/ans", zValidator("json", indexedAnsSchema), async (c) => {
    const { id: postID, action } = await c.req.json();
    if (action !== 'increment' && action !== 'decrement') {
      return c.json({
        message: "Invalid vote type. Must be 'increment' or 'decrement'",
        status: 400
      });
    }

    if (!postID || !action) {
        return c.json({
          message: "Post ID & Action is required",
          status: 400,
        });
      }

    try {
      const updatedANS = await prisma.indexedAns.update({
        where: { id: postID },
        data: action === 'increment' ? {
            up_votes: {
              increment: 1
            }
          } : {
            down_votes: {
              increment: 1
            }
          }
      });

      if (!updatedANS) {
        return c.json({
          message: "Post not found",
          status: 404
        }, 404);
      }

      // Invalidate cache
      const cacheKey = `server:${postID}`;
      await cache.del(cacheKey);

      try {
        const vPost = indexedAnsSchema.parse(updatedANS);
        return c.json({ post: vPost }, 200);
      } catch (error) {
        if (error instanceof ZodError) {
          return c.json(
            {
              message: "Invalid post data",
              errors: error.errors,
              status: 500,
            },
            500,
          );
        }
        throw error;
      }

    } catch (error) {
      console.error("Error updating post votes:", error);
      return c.json({ message: "Internal Server Error", status: 500 }, 500);
    }
  });


export type VoteApiType = typeof vote;
export default vote;
