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
    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&permissions=8&scope=bot%20applications.commands`;

    const embed = new EmbedBuilder()
      .setColor(client.config.default_color)
      .setTitle("Want to Help us?")
      .setDescription(
        `ℹ️ | Click on the button below to [invite](${inviteLink}) me`,
      );

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Invite")
        .setURL("https://l.devwtf.in/sponsor"),
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
