import { NextResponse } from "next/server";
import { Context, Next } from "hono";
import { auth } from "@iflow/auth";

export const checkAdmin = async (c: Context, next: Next) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (session && session.user && session.user.role === "admin") {
      return await next();
    }
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 401 },
    );
  } catch (error) {
    console.log("Check admin middleware error", error);
  }
};
