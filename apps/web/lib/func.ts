"use server";

// import { betterFetch } from "@better-fetch/fetch";
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
  const res = await fetch(USER_ENDPOINT, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      cookie: (await headers()).get("cookie") || "",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return {
    data,
    status: res.status,
  };
}