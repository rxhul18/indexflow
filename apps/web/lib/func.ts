"use server";

const USER_ENDPOINT = process.env.NODE_ENV == "development" ? "http://localhost:3001/v1/user/update" : "https://api.indexflow.site/v1/user/update"

export async function updateUser(
  body: Partial<{
    id: string;
    name: string;
    username: string;
    website: string;
    bio: string;
    tags: string[];
  }>
) {
  const res = await fetch(USER_ENDPOINT, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return {
    success: res.ok,
    data,
  };
}