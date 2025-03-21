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
  name: "help",
  aliases: ["cmd", "h"],
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
      .setTitle("Help Command")
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(
        `Hello! <@${message.author.id}> 👋 Here are the commands you can use with me:\n\n` +
          "**1. `$help`** - Displays this help message.\n" +
          "**2. `$invite`** - Get the invite link to add me to your server.\n" +
          "**3. `$index`** - Index a message as a question or answer.\n" +
          "**4. `$config`** - Manage your server's configurations.\n" +
          "**5. `$code`** - Get our source code for free.\n" +
          "> **6. `$donate`** - Donate/Sponsor us if you liked our service.\n" +
          "**7. `$api`** - Access your all indexed data through our api for free.\n" +
          "**8. `$uptime`** - Get my uptime hours details\n\n" +
          "My prefix in this guild is *$*. If you need assistance, just ask!",
      );

    const actionButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Add Me")
        .setURL(inviteLink),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Website")
        .setURL(inviteLink),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Support Server")
        .setURL(inviteLink),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Sponsor")
        .setURL(inviteLink),
    );

    if (
      message.channel instanceof TextChannel ||
      message.channel instanceof DMChannel
    ) {
      return message.channel.send({
        embeds: [embed],
        components: [actionButtons],
      });
    }
  },
};
