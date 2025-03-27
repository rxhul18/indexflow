import { configDotenv } from "dotenv";

configDotenv({ path: ".env", debug: true });

const {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  WEBHOOK_ERROR_LOGGING,
  WEBHOOK_GUILD_LOGGING,
  WEBHOOK_CONFIG_LOGGING,
  BOT_API_ENDPOINT,
  BASE_API_ENDPOINT,
  BOT_BEARER_TOKEN,
} = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
  throw new Error("Missing bot envs!");
}

const SPONSOR_URL = "https://l.devwtf.in/sponsor";
const WEB_URL = "https://indexflow.site/";
const INVITE_URL =
  "https://discord.com/api/oauth2/authorize?client_id=1346709873412407319&permissions=8&scope=bot%20applications.commands";
const SUPPORT_SERVER_URL = "https://l.devwtf.in/plura-dc";
const SRC_URL = "https://l.devwtf.in/iflow";
const X_URL = "https://l.devwtf.in/x";

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
  BASE_API_ENDPOINT,
  X_URL,
  SPONSOR_URL,
  SUPPORT_SERVER_URL,
  INVITE_URL,
  SRC_URL,
  WEB_URL,
};
