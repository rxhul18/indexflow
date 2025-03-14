import { NextResponse } from "next/server";
import { Context, Next } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import Error from "next/error";

export const checkBot = async (c: Context, next: Next) => {
  const bearer = process.env.BOT_BEARER_TOKEN!;
  try {
    const validateBearer = await bearerAuth({
      verifyToken: async (token, c) => {
        return token === bearer;
      },
    })(c, next);

    if (validateBearer) {
      return await next();
    }
    return NextResponse.json(
      { message: "You are not authorized" },
      { status: 401 },
    );
  } catch (error) {
    console.log("Check bot middleware error", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
