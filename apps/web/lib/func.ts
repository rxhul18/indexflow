"use server";

import { betterFetch } from "@better-fetch/fetch";
import { headers } from "next/headers";

const USER_ENDPOINT = process.env.NODE_ENV == "development" ? "http://localhost:3001/v1/user/update" : "https://api.indexflow.site/v1/user/update"

export async function updateUser(
  body: Partial<{
    id: string;
    name: string;
    username: string;
    website: string;
    bio: string;
    reputation: string;
    active: Date;
    location: string;
    banner: string;
    recentTags: string[];
  }>
) {
  const cookies = (await headers()).get("cookie") || "";
  const res = await betterFetch(USER_ENDPOINT, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      cookie: cookies,
    },
    body: JSON.stringify(body),
  });

  console.log("Cookies:", cookies);

  return {
    res
  };
}