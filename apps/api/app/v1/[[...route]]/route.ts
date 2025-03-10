import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { bearerAuth } from "hono/bearer-auth";
import { rateLimitHandler } from "@/actions/ratelimit-handler";

const token = process.env.BOT_BEARER_TOKEN!;
// console.log(token);

export const runtime = "edge";
const allowedOrigins = [
  "http://localhost:3000",
  "https://indexflow.vercel.app",
];
const app = new Hono().basePath("/v1");

app.use(
  "*",
  cors({
    origin: allowedOrigins,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);
app.use("/bot/*", bearerAuth({ token }));

app.use(rateLimitHandler);

app.get("/hello", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

export const GET = handle(app);
export const POST = handle(app);
