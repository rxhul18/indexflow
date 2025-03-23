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
  name: "source",
  aliases: ["src", "code", "github"],
  adminPermit: false,
  ownerPermit: false,
  cat: "bot",
  run: async (
    client: Client & { config: { default_color: ColorResolvable } },
    message: Message,
  ) => {
    const embed = new EmbedBuilder()
      .setColor(client.config.default_color)
      .setTitle("We're Open Source!")
      .setThumbnail(
        client.user?.avatarURL() || message.author.displayAvatarURL(),
      )
      .setDescription(
        "Yes, we are fully open-sourced and will be forever if you liked our service please make sure to give us a **Star on GitHub** and grab the source code for free.",
      );

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Star on GitHub")
        .setURL(CONFIG.SRC_URL),
    );

    if (
      message.channel instanceof TextChannel ||
      message.channel instanceof DMChannel
    ) {
      return message.channel.send({ embeds: [embed], components: [button] });
    }
  },
};
