import { Client, EmbedBuilder, Guild } from "discord.js";
import { ColorResolvable } from "discord.js";
import { log_error, log_guild } from "../../lib/loggers";

export default async function handleBotLeave(
  client: Client & {
    config: { owner: string[] };
    default_color: ColorResolvable;
  },
): Promise<void> {
  client.on("guildDelete", async (guild: Guild) => {
    try {
      console.log(`Bot is removed from the guild: ${guild.name}`);
      log_guild.send({
        embeds: [
          new EmbedBuilder()
            .setColor(`#2f3136`)
            .setTitle(`Bot removed from a guild!`)
            .setDescription(`Bot left the guild: **${guild.name}**`)
            .addFields(
              {
                name: "Guild ID",
                value: guild.id.toString(),
                inline: false,
              },
              {
                name: "Guild Owner ID",
                value: guild.ownerId.toString(),
                inline: false,
              },
              {
                name: "Total Guild Members",
                value: guild.memberCount.toString(),
                inline: false,
              },
            ),
        ],
      });
    } catch (error) {
      console.error(`Error handling guildDelete event:`, error);
      log_error.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.default_color)
            .setDescription(`\`\`\`ts\n${error}\`\`\``),
        ],
      });
    }
  });
}