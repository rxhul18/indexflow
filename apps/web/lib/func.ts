"use server";

// import { betterFetch } from "@better-fetch/fetch";
import { headers } from "next/headers";

const USER_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/user/update"
    : "https://api.indexflow.site/v1/user/update";

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
  }>,
) {
  if (body.website?.startsWith("https://")) {
    body.website = body.website.replace("https://", "");
  }

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
    success: res.ok,
    data,
  };
}

const VOTING_API_ENDPOINT =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3001/v1/vote"
    : "https://api.indexflow.site/v1/vote";

export async function handleVote(
  postId: string,
  action: "increment" | "decrement",
  type: "qns" | "ans"
) {
  try {
    // Add error handling and logging
    console.log(`Attempting to vote: ${type} ${postId} with action ${action}`);
    
    const response = await fetch(`${VOTING_API_ENDPOINT}/${type}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        cookie: (await headers()).get("cookie") || "",
      },
      credentials: 'include',
      body: JSON.stringify({ id: postId, action }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Vote API error:', data);
      throw new Error(data.message || 'Failed to vote');
    }

    console.log('Vote successful:', data);
    
    return {
      success: true,
      data: data,
      up_votes: data.up_votes || 0,
      down_votes: data.down_votes || 0
    };
  } catch (error) {
    console.error('Error voting:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record your vote. Please try again.'
    };
  }
}
