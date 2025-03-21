import { WebhookClient } from "discord.js";
import { CONFIG } from "../configs/config";

export const log_error = new WebhookClient({
  url: CONFIG.WEBHOOK_ERROR_LOGGING,
});
export const log_guild = new WebhookClient({
  url: CONFIG.WEBHOOK_GUILD_LOGGING,
});
export const log_config = new WebhookClient({
  url: CONFIG.WEBHOOK_CONFIG_LOGGING,
});
