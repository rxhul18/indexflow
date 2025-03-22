import { fetchIndexedAns, fetchIndexedQns } from "@/lib/func";
import { IndexAnsType, IndexQnsType } from "@iflow/types";
import { Hono } from "hono";

// const CACHE_EXPIRY = 169;

const questions = new Hono().get("/all", async (c) => {
  const allQns: IndexQnsType[] = await fetchIndexedQns();
  const allAns: IndexAnsType[] = await fetchIndexedAns();
  // const cacheKey = "questions:all";

  return c.json({
    ans: `${allAns}`,
    qns: `${allQns}`,
  });
});

export type QuestionsApiType = typeof questions;
export default questions;
