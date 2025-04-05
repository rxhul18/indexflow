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
  ThreadChannel,
  ChannelType,
} from "discord.js";
import { createServerConfig, getServerConfigById } from "../../lib/func";

export default {
  name: "config",
  aliases: ["set-up", "conf", "settings", "setup", "set", "configure"],
  adminPermit: false,
  ownerPermit: false,
  cat: "server",
  run: async (
    client: Client & { config: { owner: string[] } },
    message: Message,
  ) => {
    if (!isAuthorized(client, message)) {
      return sendNotAllowedMessage(message);
    }

    const isCommunity = message.guild?.features?.includes("COMMUNITY") || false;
    if (!isCommunity) {
      return sendNotComMessage(client, message);
    }

    const defaultEmbed = createConfigEmbed(client, message);
    const defaultActionRow = createConfigButtons();
    const cancelledActionRow = createDisabledConfigButtons();

    const autoCheckEmbed = createAutoCheckEmbed(client, message);
    const autoCheckBtn = createAutoCheckButtons();

    const secEnabledEmbed = createAutoCheckTrueEmbed();
    const secReRunBtn = createAutoCheckTrueBtn();

    const successEmbed = createAutoConfigSuccessEmbed();

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
        handleInteraction(
          client,
          interaction,
          sentMessage,
          cancelledActionRow,
          autoCheckEmbed,
          autoCheckBtn,
          secEnabledEmbed,
          secReRunBtn,
          defaultEmbed,
          defaultActionRow,
          successEmbed,
        );
      });
    }
  },
};

let qna_channel_id: string | null = null;
let qna_channel_webhook: string | null = null;
let qna_endpoint: string | null = null;
let mod_role_id: string | null = null;
let log_channel_id: string | null = null;
let log_channel_webhook: string | null = null;
let system_channel_id: string | null = null;
let system_channel_webhook: string | null = null;

// functions

async function checkIfConfigExists(guild: Guild, client: Client) {
  qna_endpoint = `https://api.indexflow.site/v1/data/${guild.id}`;
  const alreadyConfigured = await getServerConfigById(guild.id + guild.ownerId);
  if (alreadyConfigured.success) {
    return true;
  }

  try {
    const systemChannel = guild.systemChannel;
    if (systemChannel) {
      system_channel_id = systemChannel.id;
    }

    const configChannel = guild.channels.cache.find(
      (ch) =>
        ch.name.toLowerCase() === "help" && ch.type === ChannelType.GuildForum,
    );
    if (configChannel) {
      qna_channel_id = configChannel.id;
    }

    const loggingChannel = guild.channels.cache.find(
      (ch) =>
        ch.name.toLowerCase() === "iflow-logs" &&
        ch.type === ChannelType.GuildText,
    );
    if (loggingChannel) {
      log_channel_id = loggingChannel.id;
    }

    const configRole = guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "iflow-mod",
    );
    if (configRole) {
      mod_role_id = configRole.id;
    }

    const webhooks = await guild.fetchWebhooks();

    const iFlowWebhook = webhooks.find(
      (wh) => wh.name.toLowerCase() === "iflow",
    );
    if (iFlowWebhook) {
      qna_channel_webhook = iFlowWebhook.url;
    }

    const loggingWebhook = webhooks.find(
      (wh) => wh.name.toLowerCase() === "iflow logs",
    );
    if (loggingWebhook) {
      log_channel_webhook = loggingWebhook.url;
    }

    const systemWebhook = webhooks.find(
      (wh) => wh.name.toLowerCase() === "iflow system",
    );
    if (systemWebhook) {
      system_channel_webhook = systemWebhook.url;
    }

    if (
      !configRole ||
      !configChannel ||
      !loggingChannel ||
      !configChannel ||
      !iFlowWebhook ||
      !loggingWebhook ||
      !systemWebhook
    ) {
      await performConfigActions(
        client,
        guild,
        !configRole,
        !configChannel,
        !iFlowWebhook || !loggingWebhook || !systemWebhook ? true : false,
        !loggingChannel,
      );

      await createServerConfig({
        id: guild.id + guild.ownerId,
        server_id: guild.id,
        mod_role: mod_role_id,
        qna_channel: qna_channel_id,
        qna_channel_webhook: qna_channel_webhook,
        qna_endpoint: qna_endpoint,
        log_channel: log_channel_id,
        log_channel_webhook: log_channel_webhook,
        system_channel: system_channel_id,
        system_channel_webhook: system_channel_webhook,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return true;
  } catch (error) {
    console.error("❌ Error in checkIfConfigExists:", error);
    return false;
  }
}

async function performConfigActions(
  client: Client,
  guild: Guild,
  role: boolean,
  channel: boolean,
  webhook: boolean,
  log_ch: boolean,
) {
  let confRoleId = null;
  let configChannel: TextChannel | ThreadChannel | null = null;
  let logsChannel: TextChannel | null = null;
  const isCommunity = guild.features.includes("COMMUNITY");
  const systemChannel = guild.systemChannel;

  if (systemChannel) {
    system_channel_id = systemChannel?.id;
  }

  if (role) {
    try {
      const configRole = await guild.roles.create({
        name: "iflow-mod",
        color: "Blue",
        reason:
          "Needed for content moderation purposes. From now users having this role can index any content.",
        permissions: [
          "ViewChannel",
          "SendMessages",
          "ReadMessageHistory",
          "ManageMessages",
        ],
      });
      console.log("✅ Created role: ", `${configRole.name} - ${configRole.id}`);
      confRoleId = configRole.id;
      mod_role_id = configRole.id;
      // return { configRole };
    } catch (error) {
      console.error("❌ Failed to create role:", error);
    }
  }

  if (channel) {
    try {
      configChannel = await guild.channels.create({
        name: "help",
        type: 15, // 15 = Forum, 0 = Text Channel
        reason:
          "Needed for content posting. From now you can index any message from this channel only.",
        permissionOverwrites: [
          {
            id: guild.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
            deny: ["MentionEveryone", "Administrator"],
          },
          {
            id: confRoleId ?? "",
            allow: ["ManageMessages", "ManageChannels"],
            deny: ["MentionEveryone", "Administrator"],
          },
        ],
      });
      console.log(
        `✅ Created ${isCommunity ? "Forum" : "Text"} channel: `,
        `${configChannel.name} - ${configChannel.id}`,
      );
      qna_channel_id = configChannel.id;
      // return { configChannel };
    } catch (error) {
      console.error("❌ Failed to create channel:", error);
    }
  }

  if (log_ch) {
    try {
      logsChannel = await guild.channels.create({
        name: "iflow-logs",
        type: 0,
        reason: "Needed for logging changes.",
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ["ViewChannel"],
          },
          {
            id: confRoleId ?? "",
            allow: ["ViewChannel", "ManageMessages", "ManageChannels"],
            deny: ["MentionEveryone", "Administrator"],
          },
        ],
      });
      console.log(
        `✅ Created logging channel: `,
        `${logsChannel.name} - ${logsChannel.id}`,
      );
      log_channel_id = logsChannel.id;
    } catch (error) {
      console.error("❌ Failed to create logging channel:", error);
    }
  }

  if (webhook) {
    try {
      let configWebhookUrl = null;
      if (configChannel) {
        const configWebhook = await configChannel.createWebhook({
          name: "iFlow",
          avatar: client.user?.avatarURL(),
          reason:
            "Webhook for communicating between discord client and our backend directly.",
        });
        configWebhookUrl = configWebhook.url;
        console.log("✅ Created webhook for configChannel:", configWebhookUrl);
        qna_channel_webhook = configWebhookUrl;
      }

      let systemWebhookUrl = null;
      if (systemChannel) {
        const systemWebhook = await systemChannel.createWebhook({
          name: "iFlow System",
          avatar: client.user?.avatarURL(),
          reason: "Webhook for system notifications",
        });
        systemWebhookUrl = systemWebhook.url;
        console.log("✅ Created webhook for systemChannel:", systemWebhookUrl);
        system_channel_webhook = systemWebhookUrl;
      }

      let loggingWebhookUrl = null;
      if (logsChannel) {
        const loggingWebhook = await logsChannel.createWebhook({
          name: "iFlow Logs",
          avatar: client.user?.avatarURL(),
          reason: "Webhook for logging changes",
        });
        loggingWebhookUrl = loggingWebhook.url;
        console.log("✅ Created webhook for logsChannel:", loggingWebhookUrl);
        log_channel_webhook = loggingWebhookUrl;
      }

      // return { configWebhookUrl, systemWebhookUrl };
    } catch (error) {
      console.error("❌ Failed to create webhooks:", error);
    }
  }
}

function isAuthorized(
  client: Client & { config: { owner: string[] } },
  message: Message,
): boolean {
  const authorizedUsers = [...client.config.owner];
  return (
    message.author.id === message.guild?.ownerId ||
    authorizedUsers.includes(message.author.id)
  );
}

async function sendNotAllowedMessage(message: Message) {
  const notAllowedEmbed = new EmbedBuilder().setDescription(
    "Sorry, this command contains sensitive data. You need to be the ``GUILD_OWNER`` to run this command.",
  );

  if (message.channel instanceof TextChannel) {
    await message.channel.send({ embeds: [notAllowedEmbed] });
  }
}

async function sendNotComMessage(client: Client, message: Message) {
  const em = new EmbedBuilder()
    .setTitle("Enable Community!")
    .setDescription(
      "Your server needs to be a **COMMUNITY** to use this command. \n\n **Don't know how to enable it?** \n > Follow these steps: click on -> `Server Name` -> `Server settings` -> `Enable community`",
    )
    .setThumbnail(
      client.user?.avatarURL() || message.author.displayAvatarURL(),
    );

  if (message.channel instanceof TextChannel) {
    await message.channel.send({ embeds: [em] });
  }
}

function createConfigEmbed(client: Client, message: Message) {
  return new EmbedBuilder()
    .setTitle("Configure settings!")
    .setDescription(
      "Let's configure your server settings. Can you please choose what type of **configuration mode** you want from the buttons below. \n\n The **Manual** configuration option is coming soon.",
    )
    .setThumbnail(client.user?.avatarURL() || message.author.displayAvatarURL())
    .setFooter({
      text: "Don't worry you can always change your settings later.",
    });
}

function createAutoCheckEmbed(client: Client, message: Message) {
  return new EmbedBuilder()
    .setDescription(
      "Do you have any **ANTINUKE/SECURITY** bots enabled which may **KICK/BAN** me for performing some actions in your server mentioned bellow: \n - ``CREATE_ROLE`` (1) \n - ``UPDATE_ROLE`` (1) \n - ``CREATE_CHANNEL`` (2) \n - ``CREATE_WEBHOOK`` (3)",
    )
    .setThumbnail(client.user?.avatarURL() || message.author.displayAvatarURL())
    .setFooter({
      text: "Don't worry you can always change your settings later.",
    });
}

function createAutoCheckTrueEmbed() {
  return new EmbedBuilder()
    .setDescription(
      "Oops, sorry to disappoint but if you have security bots enabled which may **BAN/KICK** me for performing these actions then you may need to **DISABLE** them for a time or just **WHITELIST** me and try-again.",
    )
    .setFooter({ text: "Re-try and see how easy it is." });
}

function createAutoConfigSuccessEmbed() {
  return new EmbedBuilder()
    .setTitle("🎉 Successfully auto configured your settings")
    .setDescription("Your server settings have been successfully configured.")
    .setFooter({
      text: "Don't worry you can always change your settings later",
    });
}

function createAutoCheckTrueBtn() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("rerun_conf_btn")
      .setStyle(ButtonStyle.Primary)
      .setLabel("Run Again"),
  );
}

function createConfigButtons() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("auto_conf_btn")
      .setStyle(ButtonStyle.Primary)
      .setLabel("Auto"),
    new ButtonBuilder()
      .setCustomId("manual_conf_btn")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
      .setLabel("Manual"),
    new ButtonBuilder()
      .setCustomId("cancel_conf_btn")
      .setStyle(ButtonStyle.Danger)
      .setLabel("Cancel"),
  );
}

function createDisabledConfigButtons() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("auto_conf_btn")
      .setStyle(ButtonStyle.Primary)
      .setLabel("Auto")
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId("manual_conf_btn")
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Manual")
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId("cancel_conf_btn")
      .setStyle(ButtonStyle.Danger)
      .setLabel("Cancel")
      .setDisabled(true),
  );
}

function createAutoCheckButtons() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("auto_conf_yes_btn")
      .setStyle(ButtonStyle.Primary)
      .setLabel("Yes"),
    new ButtonBuilder()
      .setCustomId("auto_conf_no_btn")
      .setStyle(ButtonStyle.Secondary)
      .setLabel("No"),
    new ButtonBuilder()
      .setCustomId("cancel_conf_btn")
      .setStyle(ButtonStyle.Danger)
      .setLabel("Cancel"),
  );
}

async function handleInteraction(
  client: Client,
  interaction: ButtonInteraction,
  sentMessage: Message,
  cancelledActionRow: ActionRowBuilder<ButtonBuilder>,
  autoCheckEmbed: EmbedBuilder,
  autoCheckBtn: ActionRowBuilder<ButtonBuilder>,
  secEnabledEmbed: EmbedBuilder,
  secReRunBtn: ActionRowBuilder<ButtonBuilder>,
  defaultEmbed: EmbedBuilder,
  defaultActionRow: ActionRowBuilder<ButtonBuilder>,
  successEmbed: EmbedBuilder,
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
      await interaction.followUp({
        content: "Manual configuration selected!",
        flags: 64,
      });
      break;
    case "cancel_conf_btn":
      await sentMessage.edit({
        embeds: [
          new EmbedBuilder().setDescription(
            "❌ | Configuration **cancelled**.",
          ),
        ],
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
      await sentMessage.edit({
        embeds: [
          new EmbedBuilder().setDescription("Hold on, performing actions..."),
        ],
        components: [],
      });
      if (guild) {
        const workDone = await checkIfConfigExists(guild, client);
        if (workDone) {
          await sentMessage.edit({
            embeds: [successEmbed],
            components: [],
          });
        } else {
          await sentMessage.edit({
            embeds: [
              new EmbedBuilder().setDescription(
                "Oops, Internal error occured.",
              ),
            ],
            components: [secReRunBtn],
          });
        }
      } else {
        console.error("Guild is undefined.");
      }
      break;
    default:
      await interaction.followUp({
        content: "Unknown button clicked!",
        flags: 64,
      });
  }
}
