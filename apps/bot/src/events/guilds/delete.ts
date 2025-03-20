import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  Guild,
  TextChannel,
} from "discord.js";
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
      console.log(`Bot removed from guild: ${guild.name}`);

      const owner = await guild.fetchOwner();
      const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=8&scope=bot%20applications.commands`;

      // Embed message
      const embed = new EmbedBuilder()
        .setColor(`#ff0000`)
        .setTitle(`Goodbye from ${client.user?.username}!`)
        .setDescription(
          `Hey <@${owner.user.id}>, I noticed that I've been removed from **${guild.name}**. ` +
            `If this was a mistake or you'd like to re-add me, you can do so anytime! Thanks for having me! 😊`,
        )
        .setFooter({ text: "Hope to see you again!" });

      // Re-add button
      const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel("Re-add Me")
          .setURL(inviteLink),
      );

      // Try sending the message in the system channel first
      // const systemChannel = guild.systemChannel as TextChannel;
      // if (systemChannel) {
      //   systemChannel.send({ embeds: [embed], components: [button], content: `<@${owner.user.id}>` })
      //     .catch(err => console.warn(`Failed to send message in system channel of ${guild.name}:`, err));
      // } else {
      //   console.warn(`No system channel found in ${guild.name}.`);
      // }

      // Attempt to DM the owner
      owner.send({ embeds: [embed], components: [button] }).catch((err) => {
        if (err.code === 50007) {
          console.warn(`Cannot send DM to ${owner.user.tag} (DMs disabled).`);
        } else {
          console.error("Failed to send DM to owner:", err);
        }
      });

      // Log the removal
      log_guild.send({
        embeds: [
          new EmbedBuilder()
            .setColor(`#2f3136`)
            .setTitle(`Bot removed from a guild!`)
            .setDescription(`Bot left the guild: **${guild.name}**`)
            .addFields(
              { name: "Guild ID", value: guild.id.toString(), inline: false },
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
