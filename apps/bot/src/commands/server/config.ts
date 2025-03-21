import {
  Client,
  Message,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ButtonInteraction,
  Guild,
} from "discord.js";

export default {
  name: "config",
  aliases: ["set-up", "conf", "settings", "setup", "set"],
  adminPermit: false,
  ownerPermit: false,
  cat: "server",
  run: async (
    client: Client & { config: { owner: string[] } },
    message: Message
  ) => {
    if (!isAuthorized(client, message)) {
      return sendNotAllowedMessage(message);
    }

    const defaultEmbed = createConfigEmbed(client, message);
    const defaultActionRow = createConfigButtons();
    const cancelledActionRow = createDisabledConfigButtons();

    const autoCheckEmbed = createAutoCheckEmbed(client, message);
    const autoCheckBtn = createAutoCheckButtons();

    const secEnabledEmbed = createAutoCheckTrueEmbed(client, message);
    const secReRunBtn = createAutoCheckTrueBtn();

    if (message.channel instanceof TextChannel) {
      const sentMessage = await message.channel.send({
        embeds: [defaultEmbed],
        components: [defaultActionRow],
      });

      const collector = sentMessage.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 180000, // 3 minutes
      });

      collector.on("collect", async (interaction: ButtonInteraction) => {
        handleInteraction(interaction, sentMessage, cancelledActionRow, autoCheckEmbed, autoCheckBtn, secEnabledEmbed, secReRunBtn, defaultEmbed, defaultActionRow);
      });
    }
  },
};

// functions

async function checkIfConfigExists(guild: Guild) {
  const configChannel = guild.channels.cache.find(ch => ch.name.toLowerCase() === "help");
  const configRole = guild.roles.cache.find(r => r.name.toLowerCase() === "iflow-mod");

  if (!configChannel && !configRole) {
    console.log("nopes seems clean and badass!")
  }
}

function performConfigActions() {

}

function isAuthorized(client: Client & { config: { owner: string[] } }, message: Message): boolean {
  const authorizedUsers = [...client.config.owner];
  return message.author.id === message.guild?.ownerId || authorizedUsers.includes(message.author.id);
}

async function sendNotAllowedMessage(message: Message) {
  const notAllowedEmbed = new EmbedBuilder().setDescription(
    "Sorry, this command contains sensitive data. You need to be the ``GUILD_OWNER`` to run this command."
  );

  if (message.channel instanceof TextChannel) {
    await message.channel.send({ embeds: [notAllowedEmbed] });
  }
}

function createConfigEmbed(client: Client, message: Message) {
  return new EmbedBuilder()
    .setTitle("Configure settings!")
    .setDescription(
      "Let's configure your server settings. Can you please choose what type of **configuration mode** you want from the buttons below."
    )
    .setThumbnail(client.user?.avatarURL() || message.author.displayAvatarURL())
    .setFooter({ text: "Don't worry you can always change your settings later." });
}

function createAutoCheckEmbed(client: Client, message: Message) {
  return new EmbedBuilder()
    .setDescription(
      "Do you have any **ANTINUKE/SECURITY** bots enabled which may **KICK/BAN** me for performing some actions in your server mentioned bellow: \n - ``CREATE_ROLE`` (1) \n - ``UPDATE_ROLE`` (1) \n - ``CREATE_CHANNEL`` (1) \n - ``CREATE_WEBHOOK`` (2)"
    )
    .setThumbnail(client.user?.avatarURL() || message.author.displayAvatarURL())
    .setFooter({ text: "Don't worry you can always change your settings later." });
}

function createAutoCheckTrueEmbed(client: Client, message: Message) {
  return new EmbedBuilder()
    .setDescription(
      "Oops, sorry to disappoint but if you have security bots enabled which may **BAN/KICK** me for performing these actions then you may need to **DISABLE** them for a time or just **WHITELIST** me and try-again."
    )
    .setFooter({ text: "Re-try and see how easy it is." });
}

function createAutoCheckTrueBtn() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("rerun_conf_btn").setStyle(ButtonStyle.Primary).setLabel("Run Again"),
  );
}

function createConfigButtons() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("auto_conf_btn").setStyle(ButtonStyle.Primary).setLabel("Auto"),
    new ButtonBuilder().setCustomId("manual_conf_btn").setStyle(ButtonStyle.Secondary).setLabel("Manual"),
    new ButtonBuilder().setCustomId("cancel_conf_btn").setStyle(ButtonStyle.Danger).setLabel("Cancel")
  );
}

function createDisabledConfigButtons() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("auto_conf_btn").setStyle(ButtonStyle.Primary).setLabel("Auto").setDisabled(true),
    new ButtonBuilder().setCustomId("manual_conf_btn").setStyle(ButtonStyle.Secondary).setLabel("Manual").setDisabled(true),
    new ButtonBuilder().setCustomId("cancel_conf_btn").setStyle(ButtonStyle.Danger).setLabel("Cancel").setDisabled(true)
  );
}

function createAutoCheckButtons() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("auto_conf_yes_btn").setStyle(ButtonStyle.Primary).setLabel("Yes"),
    new ButtonBuilder().setCustomId("auto_conf_no_btn").setStyle(ButtonStyle.Secondary).setLabel("No"),
    new ButtonBuilder().setCustomId("cancel_conf_btn").setStyle(ButtonStyle.Danger).setLabel("Cancel")
  );
}

async function handleInteraction(
  interaction: ButtonInteraction,
  sentMessage: Message,
  cancelledActionRow: ActionRowBuilder<ButtonBuilder>,
  autoCheckEmbed: EmbedBuilder,
  autoCheckBtn: ActionRowBuilder<ButtonBuilder>,
  secEnabledEmbed: EmbedBuilder,
  secReRunBtn: ActionRowBuilder<ButtonBuilder>,
  defaultEmbed: EmbedBuilder,
  defaultActionRow: ActionRowBuilder<ButtonBuilder>,
) {
  await interaction.deferUpdate(); // ✅ Acknowledge interaction before doing anything

  const guild = interaction.guild;

  switch (interaction.customId) {
    case "auto_conf_btn":
      await sentMessage.edit({
        embeds: [autoCheckEmbed],
        components: [autoCheckBtn],
      });
      break;
    case "manual_conf_btn":
      await interaction.followUp({ content: "Manual configuration selected!", ephemeral: true });
      break;
    case "cancel_conf_btn":
      await sentMessage.edit({
        embeds: [new EmbedBuilder().setDescription("❌ | Configuration **cancelled**.")],
        components: [cancelledActionRow],
      });
      break;
    case "auto_conf_yes_btn":
      await sentMessage.edit({
        embeds: [secEnabledEmbed],
        components: [secReRunBtn],
      });
      break;
      case "rerun_conf_btn":
        await sentMessage.edit({
          embeds: [defaultEmbed],
          components: [defaultActionRow],
        });
        break;
    case "auto_conf_no_btn":
      if (guild) {
        await checkIfConfigExists(guild);
      } else {
        console.error("Guild is undefined.");
      }
      break;
    default:
      await interaction.followUp({ content: "Unknown button clicked!", ephemeral: true });
  }
}