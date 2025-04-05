import {
  AuditLogEvent,
  Client,
  GuildAuditLogsEntry,
  Guild,
  EmbedBuilder,
  WebhookClient,
} from "discord.js";
import { log_config } from "../../lib/loggers";
import { getServerConfigById } from "../../lib/func";

export default async function alive(client: Client) {
  client.on(
    "guildAuditLogEntryCreate",
    async (entry: GuildAuditLogsEntry, guild: Guild) => {
      const executorId = entry.executor?.id;
      const botId = client.user?.id;
      const configId = guild.id! + guild.ownerId!;
      const isConfig = await getServerConfigById(configId);

      if (!executorId || executorId !== botId) {
        return null;
      }

      const action = AuditLogEvent[entry.action] || "UNKNOWN_ACTION";
      const executor = entry.executor
        ? `${entry.executor.tag} (${executorId})`
        : "Unknown";
      const extraData = entry.extra
        ? JSON.stringify(entry.extra, null, 2)
        : "No extra data";
      const reason = entry.reason || "No reason provided";
      const guildId = guild?.id || "Unknown Guild";
      const guildName = guild?.name || "Unknown Guild";

      console.log(" ");
      console.log("🔍 Audit Log Change Detected:");
      console.log("--------------------------------------------------");
      console.log(`🛠 Action Type: ${action}`);
      console.log(`👤 Executor: ${executor}`);
      console.log(`📜 Extra Data: ${extraData}`);
      console.log(`📝 Reason: ${reason}`);
      console.log(`🏠 Guild ID: ${guildId}`);
      console.log(`🏠 Guild Name: ${guildName}`);
      console.log("--------------------------------------------------");

      const embed = new EmbedBuilder().setDescription(
        `🛠 **Action Type:** ${action} \n 👤 **Executor:** ${executor} \n 📝 **Reason:** ${reason} \n 🏠 **Guild ID:** ${guildId} \n 🏠 **Guild Name:** ${guildName}`,
      );

      log_config.send({ embeds: [embed] });

      if(isConfig.success) {
        const loggin_wbhk = isConfig.data.configs.log_channel_webhook;
        const log_config = new WebhookClient({
          url: loggin_wbhk,
        });

        log_config.send({ embeds: [embed] });
      }
    },
  );
}
