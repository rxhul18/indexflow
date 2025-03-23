import { ColorResolvable } from "discord.js";
import {
  Client,
  Message,
  TextChannel,
  DMChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { CONFIG } from "../../configs/config";

export default {
  name: "invite",
  aliases: ["inv", "add"],
  adminPermit: false,
  ownerPermit: false,
  cat: "bot",
  run: async (
    client: Client & { config: { default_color: ColorResolvable } },
    message: Message,
  ) => {
    const embed = new EmbedBuilder()
      .setColor(client.config.default_color)
      .setDescription(
        `ℹ️ | Click on the button below to [invite](${CONFIG.INVITE_URL}) me to your server.`,
      );

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Invite")
        .setURL(CONFIG.INVITE_URL),
    );

    if (
      message.channel instanceof TextChannel ||
      message.channel instanceof DMChannel
    ) {
      return message.channel.send({ embeds: [embed], components: [button] });
    }
  },
};
