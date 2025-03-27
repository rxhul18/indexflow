import { Client, Message, EmbedBuilder, TextChannel } from "discord.js";
import { CONFIG } from "../../configs/config";

export default {
  name: "ping",
  aliases: ["latency"],
  adminPermit: false,
  ownerPermit: false,
  cat: "bot",
  run: async (client: Client, message: Message) => {
    try {
      if (message.channel instanceof TextChannel) {
        const msg = await message.channel.send({ content: "🏓 Pinging..." });
        const botLatency = msg.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        const fetchLatency = async (endpoint: string) => {
          try {
            const url = `${CONFIG.BASE_API_ENDPOINT}/ping/${endpoint}`;

            const response = await fetch(url, { method: "GET" });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Raw Response from ${endpoint}:`, errorText);
              throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
              throw new Error(`Invalid Content-Type: ${contentType}`);
            }

            const data = await response.json();
            return data.latency ? parseInt(data.latency) : 0;
          } catch (err) {
            console.error(`Error fetching ${endpoint}:`, err);
            return 0;
          }
        };

        const [cacheLatency, dbLatency] = await Promise.all([
          fetchLatency("cache"),
          fetchLatency("db"),
        ]);

        const avgLatency = Math.round(
          (botLatency + apiLatency + cacheLatency + dbLatency) / 4,
        );

        const embed = new EmbedBuilder()
          .setTitle("🏓 Pong!")
          .setDescription(
            `Bot Latency: **${botLatency}ms**\n` +
              `Discord API Latency: **${apiLatency}ms**\n` +
              `Cache Latency: **${cacheLatency}ms**\n` +
              `Database Latency: **${dbLatency}ms**\n` +
              `Average Latency: **${avgLatency}ms**`,
          );

        await msg.edit({ content: "", embeds: [embed] });
      }
    } catch (error) {
      console.error("Error executing ping command:", error);
      if (message.channel instanceof TextChannel) {
        message.channel.send({ content: "❌ Failed to fetch latency." });
      }
    }
  },
};
