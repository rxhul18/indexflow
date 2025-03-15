import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { rateLimitHandler } from "@/actions/ratelimit-handler";
import { auth as Auth } from "@iflow/auth";
import user from "./routes/user";
import server from "./routes/bot/server";

export const runtime = "edge";
const app = new Hono().basePath("/v1");
const allowedOrigins = [
  "http://localhost:3000",
  "https://api.indexflow.site",
  "https://indexflow.site",
  "http://localhost:3001",
];
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

// applied rate limit to below routes
app.use(rateLimitHandler);
// applied rate limit to below routes

app.route("/bot/server", server);
app.route("/user", user);
app.on(["POST", "GET"], "/auth/*", (c) => Auth.handler(c.req.raw));

const GET = handle(app);
const POST = handle(app);
const PATCH = handle(app);
const DELETE = handle(app);
const OPTIONS = handle(app);
const PUT = handle(app);

export { GET, PUT, PATCH, POST, DELETE, OPTIONS };
