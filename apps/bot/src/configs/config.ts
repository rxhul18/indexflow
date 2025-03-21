import { configDotenv } from "dotenv";

configDotenv({ path: ".env", debug: true });

const {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  WEBHOOK_ERROR_LOGGING,
  WEBHOOK_GUILD_LOGGING,
  WEBHOOK_CONFIG_LOGGING,
  BOT_API_ENDPOINT,
  BOT_BEARER_TOKEN,
} = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing bot envs!");
}

if (
  !WEBHOOK_ERROR_LOGGING ||
  !WEBHOOK_GUILD_LOGGING ||
  !WEBHOOK_CONFIG_LOGGING
) {
  throw new Error("Missing logging webhooks envs!");
}

export const CONFIG = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  WEBHOOK_ERROR_LOGGING,
  WEBHOOK_GUILD_LOGGING,
  WEBHOOK_CONFIG_LOGGING,
  BOT_BEARER_TOKEN,
  BOT_API_ENDPOINT,
};
