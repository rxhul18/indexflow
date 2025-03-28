import { checkBot } from "@/actions/checks/check.bot";
import { prisma } from "@iflow/db";
import { Hono } from "hono";

const stats = new Hono().use(checkBot).get("/", async (c) => {
  const dbUsersCount = await prisma.user.count();
  const dbTagsCount = await prisma.tags.count();
  const dbIndexQnsCount = await prisma.indexedQns.count();
  const dbIndexAnsCount = await prisma.indexedAns.count();
  const dbServersCount = await prisma.server.count();
  const dbConfiguredServersCount = await prisma.configs.count();
  const dbAnonCount = await prisma.anonProfile.count();

  return c.json({
    message: "Database Statistics",
    UsersCount: dbUsersCount,
    AnonProfilesCount: dbAnonCount,
    TagsCount: dbTagsCount,
    QuestionsCount: dbIndexQnsCount,
    AnswersCount: dbIndexAnsCount,
    ServersCount: dbServersCount,
    ConfigsCount: dbConfiguredServersCount,
  });
});

export type StatsApiType = typeof stats;
export default stats;
