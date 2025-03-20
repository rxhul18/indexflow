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
  name: "synchronize",
  aliases: ["sync"],
  adminPermit: false,
  ownerPermit: false,
  cat: "dev",
  run: async (
    client: Client & {
        config: { owner: string[] };
    },
    message: Message,
  ) => {
    const authorizedUsers = [...client.config.owner];
    if (!authorizedUsers.includes(message.author.id)) {
      return;
    }
    
    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=8&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder()
      .setDescription(
        `ℹ️ | Click on the button below to [invite](${inviteLink}) me`,
      );

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Invite")
        .setURL(inviteLink),
    );

    if (
      message.channel instanceof TextChannel ||
      message.channel instanceof DMChannel
    ) {
      return message.channel.send({ embeds: [embed], components: [button] });
    }
  },
};
