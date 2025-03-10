import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@iflow/db";
import { captcha } from "better-auth/plugins";

const BaseDomain =
  process.env.NODE_ENV === "production"
    ? "https://api.plura.pro"
    : "http://localhost:3001";

export const auth = betterAuth({
  baseURL: BaseDomain,
  basePath: "/v1/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [
    captcha({
      provider: "cloudflare-turnstile", // or "google-recaptcha" //
      secretKey: process.env.TURNSTILE_SECRET_KEY!,
      endpoints: ["/sign-in"],
    }),
  ],
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
