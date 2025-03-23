import { ColorResolvable, ThreadChannel } from "discord.js";
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
  name: "donate",
  aliases: ["don", "sponsor", "give"],
  adminPermit: false,
  ownerPermit: false,
  cat: "bot",
  run: async (
    client: Client & { config: { default_color: ColorResolvable } },
    message: Message,
  ) => {
    const embed = new EmbedBuilder()
      .setColor(client.config.default_color)
      .setTitle("Want to Help us?")
      .setDescription(
        `ℹ️ | Click on the button below to [donate/sponsor](${CONFIG.SPONSOR_URL}) us.`,
      );

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Donate")
        .setURL(CONFIG.SPONSOR_URL),
    );

    if (
      message.channel instanceof TextChannel ||
      message.channel instanceof DMChannel ||
      message.channel instanceof ThreadChannel
    ) {
      return message.channel.send({ embeds: [embed], components: [button] });
    }
  },
};
