import { auth } from "@iflow/auth";
import { Context, Next } from "hono";

export const checkLogin = async (c: Context, next: Next) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (session && session.user) {
      c.set("session", session);
      return await next();
    }

    return c.json({ message: "You are not authorized" }, 401);
  } catch (error) {
    console.error("Check login middleware error:", error);
    return c.json({ message: "Internal Server Error" }, 500); 
  }
};