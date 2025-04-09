import { cache } from "@iflow/cache";
import { prisma } from "@iflow/db";
import { Hono } from "hono";
import { ZodError } from "zod";
import { indexedAnsSchema, indexedQnsSchema } from "@/lib/zod/schema";
import { checkLogin } from "@/actions/checks/check.login";

const vote = new Hono()
  .use(checkLogin)
  .put("/:type", async (c) => {
    const type = c.req.param("type");
    const { id: postID, action } = await c.req.json();
    
    // Validate action type
    if (action !== "increment" && action !== "decrement") {
      return c.json({
        success: false,
        message: "Invalid vote type. Must be 'increment' or 'decrement'",
        status: 400,
      }, 400);
    }

    // Validate post ID and action
    if (!postID || !action) {
      return c.json({
        success: false,
        message: "Post ID & Action is required",
        status: 400,
      }, 400);
    }

    // Validate content type
    if (type !== "qns" && type !== "ans") {
      return c.json({
        success: false,
        message: "Invalid content type. Must be 'qns' or 'ans'",
        status: 400,
      }, 400);
    }

    try {
      let updatedContent;
      
      try {
        if (type === "qns") {
          updatedContent = await prisma.indexedQns.update({
            where: { id: postID },
            data: action === "increment"
              ? { up_votes: { increment: 1 } }
              : { down_votes: { increment: 1 } },
          });
        } else {
          updatedContent = await prisma.indexedAns.update({
            where: { id: postID },
            data: action === "increment"
              ? { up_votes: { increment: 1 } }
              : { down_votes: { increment: 1 } },
          });
        }
      } catch (dbError) {
        console.error(`Database error updating ${type} votes:`, dbError);
        return c.json({
          success: false,
          message: "Failed to update vote count. The post may not exist.",
          status: 404,
        }, 404);
      }

      if (!updatedContent) {
        return c.json({
          success: false,
          message: "Content not found",
          status: 404,
        }, 404);
      }

      // Invalidate cache
      try {
        const cacheKey = `server:${postID}`;
        await cache.del(cacheKey);
        const qsCacheKey = `questions:all`;
        await cache.del(qsCacheKey);
      } catch (cacheError) {
        console.error("Cache invalidation error:", cacheError);
        // Continue execution even if cache invalidation fails
      }

      try {
        const vContent = type === "qns" 
          ? indexedQnsSchema.parse(updatedContent)
          : indexedAnsSchema.parse(updatedContent);
          
        return c.json({
          success: true,
          data: vContent,
          up_votes: vContent.up_votes,
          down_votes: vContent.down_votes
        }, 200);
      } catch (error) {
        if (error instanceof ZodError) {
          return c.json({
            success: false,
            message: "Invalid content data",
            errors: error.errors,
            status: 500,
          }, 500);
        }
        throw error;
      }
    } catch (error) {
      console.error(`Error updating ${type} votes:`, error);
      return c.json({
        success: false,
        message: "Internal Server Error",
        status: 500
      }, 500);
    }
  });

export type VoteApiType = typeof vote;
export default vote;
