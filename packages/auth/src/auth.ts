import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../../db/src";
import { createAuthClient } from "better-auth/client";
import { multiSessionClient } from "better-auth/client/plugins";
import { Polar } from "@polar-sh/sdk";
import { polar } from "@polar-sh/better-auth";

const BaseDomain =
  process.env.NODE_ENV === "production"
    ? "https://api.indexflow.site"
    : "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL: BaseDomain,
  basePath: "/v1/auth",
  plugins: [multiSessionClient()],
});

const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  // Use 'sandbox' if you're using the Polar Sandbox environment
  // Remember that access tokens, products, etc. are completely separated between environments.
  // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
  server: 'production'
});

export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3001",
    "http://localhost:3000",
    "https://api.indexflow.site",
    "https://indexflow.site",
    "https://www.indexflow.site",
  ],
  baseURL: BaseDomain,
  basePath: "/v1/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        nullable: false,
        required: true,
        input: false,
        defaultValue: "user",
      },
      reputation: {
        type: "string",
        nullable: true,
        required: false,
        input: false,
      },
      location: {
        type: "string",
        nullable: true,
        required: false,
        input: false,
        defaultValue: null,
      },
      active: {
        type: "date",
        nullable: true,
        required: false,
        input: false,
        defaultValue: null,
      },
      recentTags: {
        type: "string[]",
        nullable: true,
        required: false,
        input: false,
        defaultValue: null,
      },
      dc_id: {
        type: "string",
        nullable: true,
        required: false,
        input: false,
        defaultValue: null,
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      enableCustomerPortal: true,
      checkout: {
        enabled: true,
        products: [
            {
                productId: "e57d2c06-96ef-499b-a642-71a648fab297", // ID of Product from Polar Dashboard
                slug: "iflow" // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
            }
        ],
        successUrl: "/success?checkout_id={CHECKOUT_ID}"
    },
      webhooks: {
        secret: process.env.POLAR_WEBHOOK_SECRET!,
        onCheckoutCreated: async (payload) => {
          console.log(payload.data.url);
      },
      onCustomerCreated: async (payload) => {
        console.log(`Customer ${payload.data.name} created for org: ${payload.data.organizationId}`);
      }
    }
    })],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      scope: ["guilds", "guilds.join", "connections"]
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  account: {
    accountLinking: {
        enabled: true,
        allowDifferentEmails: true,
        trustedProviders: ["google", "github", "discord"],
        allowUnlinkingAll: true
    }
},
});
