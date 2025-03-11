import { auth } from "@iflow/auth";
import { Context, Next } from "hono";
import { NextResponse } from "next/server";

export const checkLogin = async (c: Context, next: Next) => {
    try {
        const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (session && session.user) {
      c.set("session", session);
      return await next();
    }
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 401 },
    );
  } catch (error) {
    console.log("Check login middleware error", error);
  }
};