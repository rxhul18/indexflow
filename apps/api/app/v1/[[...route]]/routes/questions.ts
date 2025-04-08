import { fetchIndexedAns, fetchIndexedQns } from "@/lib/func";
import { IndexAnsType, IndexQnsType } from "@iflow/types";
import { Hono } from "hono";
import { cache } from "@iflow/cache";

const CACHE_EXPIRY = 30;

const questions = new Hono().get("/all", async (c) => {
  const cacheKey = "questions:all";
  const cached = await cache.get(cacheKey);

  if (cached) {
    console.log("Am hitting CACHE")
    return c.json(cached);
  }

  const allQns: IndexQnsType[] = await fetchIndexedQns();
  const allAns: IndexAnsType[] = await fetchIndexedAns();

  // Group answers by question ID
  const ansMap: Record<string, IndexAnsType[]> = {};
  for (const ans of allAns) {
    if (!ansMap[ans.qns_id]) {
      ansMap[ans.qns_id] = [];
    }
    ansMap[ans.qns_id].push(ans);
  }

  // Attach answers to each question
  const enrichedQns = allQns.map((qns) => ({
    ...qns,
    answers: ansMap[qns.id] || [],
  }));

  const responseData = { questions: enrichedQns };
  console.log("Am hitting DB")
  await cache.set(cacheKey, responseData, { ex: CACHE_EXPIRY });

  return c.json(responseData);
});

export type QuestionsApiType = typeof questions;
export default questions;
