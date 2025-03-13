import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { bearerAuth } from "hono/bearer-auth";
import { rateLimitHandler } from "@/actions/ratelimit-handler";
import { auth as Auth } from "@iflow/auth";
import user from "./routes/user";

const token = process.env.BOT_BEARER_TOKEN!;
// console.log(token);

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

app.use("/bot/*", bearerAuth({ token }));

// applied rate limit to below routes
app.use(rateLimitHandler);
// applied rate limit to below routes

app.route("/user", user);
app.on(["POST", "GET"], "/auth/*", (c) => Auth.handler(c.req.raw));

const GET = handle(app);
const POST = handle(app);
const PATCH = handle(app);
const DELETE = handle(app);
const OPTIONS = handle(app);
const PUT = handle(app);

export { GET, PUT, PATCH, POST, DELETE, OPTIONS };
