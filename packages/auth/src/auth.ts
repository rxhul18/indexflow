import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../../db/src";
import { createAuthClient } from "better-auth/client";
import { multiSessionClient } from "better-auth/client/plugins";

const BaseDomain =
  process.env.NODE_ENV === "production"
    ? "https://api.indexflow.site"
    : "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: BaseDomain,
  basePath: "/v1/auth",
  plugins: [multiSessionClient()],
});

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3001", "http://localhost:3000", "https://api.indexflow.site", "https://indexflow.site"],
  baseURL: BaseDomain,
  basePath: "/v1/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields:{
    role : {
      type : "string",
      nullable : false,
      required : true,
      input : false,
      defaultValue : "user"
    }
  }
  },
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
