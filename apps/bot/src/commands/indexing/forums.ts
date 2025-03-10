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

export default {
  name: "forum",
  aliases: ["fa", "fadd"],
  adminPermit: false,
  ownerPermit: false,
  cat: "indexing",
  run: async (
    client: Client & { config: { default_color: ColorResolvable } },
    message: Message,
    args: string[], // Specify the type of args as an array of strings
  ) => {
    if (!args[0]) {
      if (
        message.channel instanceof TextChannel ||
        message.channel instanceof DMChannel
      ) {
        return message.channel.send("fuck");
      }
    }

    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=8&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder()
      .setColor(client.config.default_color)
      .setDescription(
        `ℹ️ | Click on the button below to [invite](${inviteLink}) me`,
      );

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Invite")
        .setURL(inviteLink),
    );

    const opt = args[0].toLowerCase();
    if (opt === `add`) {
      if (
        message.channel instanceof TextChannel ||
        message.channel instanceof DMChannel
      ) {
        return message.channel.send({ embeds: [embed], components: [button] });
      }
    }

    if (opt === `remove`) {
      if (
        message.channel instanceof TextChannel ||
        message.channel instanceof DMChannel
      ) {
        return message.channel.send({ embeds: [embed], components: [button] });
      }
    }
  },
};
