import { NextResponse } from "next/server";
import { Context, Next } from "hono";

export const checkAdmin = async (c: Context, next: Next) => {
  try {
    const session = c.get("session");
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
