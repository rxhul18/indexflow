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
  name: "config",
  aliases: ["set-up", "conf", "settings", "setup"],
  adminPermit: false,
  ownerPermit: false,
  cat: "server",
  run: async (
    client: Client & { config: { owner: string[] } },
    message: Message,
  ) => {
   const authorizedUsers = [...client.config.owner];
    const isSvOwner = message.author.id === message.guild?.ownerId;

    const nAllowed = new EmbedBuilder().setDescription(
      "Sorry, this command contains sensitive data. You need to be the ``GUILD_OWNER`` to run this command.",
    );

    if (!isSvOwner && !authorizedUsers.includes(message.author.id)) {
        if (message.channel instanceof TextChannel) {
          await message.channel.send({ embeds: [nAllowed] });
          return;
        }
      }

    const embed = new EmbedBuilder()
    .setTitle("Configure settings!")
      .setDescription(
        "Let's configure your server settings. Can you please choose what type of **configuration mode** you want from the bellow buttons.",
      )
      .setThumbnail(
        client.user?.avatarURL() || message.author.displayAvatarURL(),
      )
      .setFooter({text: "Don't worry you can always change your settings later."})

    const confBtns = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("auto_conf_btn")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Auto"),
    new ButtonBuilder()
        .setCustomId("manual_conf_btn")
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Manual"),
    new ButtonBuilder()
        .setCustomId("cancel_conf_btn")
        .setStyle(ButtonStyle.Danger)
        .setLabel("Cancel")
    );

    if (
      message.channel instanceof TextChannel
    ) {
      return message.channel.send({ embeds: [embed], components: [confBtns] });
    }
  },
};
