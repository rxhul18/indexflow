import { TextChannel, ThreadChannel } from "discord.js";
import {
  Client,
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  ComponentType,
} from "discord.js";
import {
  createAnonProfile,
  createTag,
  getAnonProfileById,
  getRandomAnonName,
  getServerConfigById,
  indexAns,
  indexQns,
} from "../../lib/func";

export default {
  name: "index",
  aliases: ["ind", "iqs", "inx"],
  adminPermit: false,
  ownerPermit: false,
  cat: "indexing",
  run: async (
    client: Client & { config: { owner: string[] } },
    message: Message,
  ) => {
    try {
      if (!message.reference || !message.channel) {
        return message.reply(
          "❌ | You need to reply to a message to index it!",
        );
      }

      const repliedMessage = await message.channel.messages.fetch(
        message.reference.messageId as string,
      );

      if (!repliedMessage) {
        return message.reply("❌ | Couldn't find the replied message.");
      }

      if (repliedMessage.author.bot) {
        return message.reply("❌ | You cannot index messages sent by a bot.");
      }

      if (!(message.channel instanceof ThreadChannel)) {
        return message.reply(
          "❌ | This command can only be used in thread channels.",
        );
      }

      const threadChannel = message.channel as ThreadChannel;
      const firstMessage = await threadChannel.fetchStarterMessage();
      const configId = message.guildId! + message.guild?.ownerId!;
      const isConfig = await getServerConfigById(configId);
      const member = await message.guild?.members.fetch(message.author.id);
      const configRoleId = isConfig.data.config.mod_role;
      const hasRole = member?.roles.cache.has(configRoleId);
      const authorizedUsers = [...client.config.owner];
      console.log(hasRole);

      if (!isConfig.success) {
        return sendNotConfigMessage(client, message);
      }

      if (
        isConfig.success &&
        !hasRole &&
        message.author.id !== message.guild?.ownerId &&
        message.author.id !== firstMessage?.author.id &&
        !authorizedUsers.includes(message.author.id)
      ) {
        return sendNotiFlowMod(message, configRoleId);
      }

      await askIndexSelection(client, message, repliedMessage);
    } catch (error) {
      console.error("Error in index command:", error);
      message.reply(
        "❌ | An unexpected error occurred. Please try again later.",
      );
    }
  },
};

async function askIndexSelection(
  client: Client,
  message: Message,
  repliedMessage: Message,
) {
  const confirmEmbed = new EmbedBuilder().setDescription(
    "📝 | Should I index this message as a Question or Answer?",
  );

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("index_question")
      .setLabel("Index the Question")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("index_answer")
      .setLabel("Index as Answer")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("index_cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger),
  );

  const replyMessage = await repliedMessage.reply({
    embeds: [confirmEmbed],
    components: [actionRow],
  });

  const collector = replyMessage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 90000, // 90 seconds timeout
  });

  collector.on("collect", async (interaction: ButtonInteraction) => {
    if (interaction.user.id !== message.author.id) {
      return interaction.reply({
        content: "❌ | Only the command initiator can interact with this.",
        ephemeral: true,
      });
    }

    await interaction.deferUpdate();
    await handleInteraction(interaction, message, repliedMessage, client);
    collector.stop();
  });

  collector.on("end", async (_, reason) => {
    if (reason === "time") {
      await replyMessage.edit({
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            actionRow.components.map((button) => button.setDisabled(true)),
          ),
        ],
      });
      await replyMessage.reply("⏰ | No response. Indexing request timed out.");
    }
  });
}

async function handleInteraction(
  interaction: ButtonInteraction,
  message: Message,
  repliedMessage: Message,
  client: Client,
) {
  const threadChannel = message.channel as ThreadChannel;
  const firstMessage = await threadChannel.fetchStarterMessage();

  if (!firstMessage) {
    return interaction.reply({
      content: "❌ | Couldn't fetch the thread owner's message.",
      ephemeral: true,
    });
  }

  if (interaction.customId === "index_question") {
    await handleIndexQuestion(client, firstMessage, threadChannel, interaction);
  } else if (interaction.customId === "index_answer") {
    await handleIndexAnswer(
      client,
      firstMessage,
      repliedMessage,
      threadChannel,
      interaction,
    );
  } else if (interaction.customId === "index_cancel") {
    await interaction.editReply({
      embeds: [
        new EmbedBuilder().setDescription("❌ | Indexing **cancelled**."),
      ],
      components: [],
    });
  }
}

async function handleIndexQuestion(
  client: Client,
  firstMessage: Message,
  threadChannel: ThreadChannel,
  interaction: ButtonInteraction,
  ansId?: string | null,
) {
  const text = firstMessage.content;
  const attachments = [...firstMessage.attachments.values()];
  const imageMarkdowns = attachments
    .filter((att) => att.contentType?.startsWith("image/"))
    .map((att) => `![image](${att.url})`);

  // const tags = threadChannel.appliedTags;
  // console.log(tags, "TAGS");
  // console.log(threadChannel, "PARENT");

  const fullContent = [text, ...imageMarkdowns].join("\n\n");
  console.log(fullContent);
  await indexQns({
    id: firstMessage.id,
    title: threadChannel.name,
    author: firstMessage.author.id,
    ans_id: ansId,
    content: fullContent,
    server_id: firstMessage.guildId!,
    thread_id: threadChannel.id,
    thread_mems: threadChannel.memberCount!,
    msg_url: firstMessage.url,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await createUserProfileIfNeeded(firstMessage);

  await interaction.editReply({
    embeds: [
      new EmbedBuilder().setDescription(
        "✅ | Message indexed as a **Question**!",
      ),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("View Webpage")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://www.indexflow.site/qs/${firstMessage.guildId}`)
      ),
    ],
  });
}

async function handleIndexAnswer(
  client: Client,
  firstMessage: Message,
  repliedMessage: Message,
  threadChannel: ThreadChannel,
  interaction: ButtonInteraction,
) {
  await handleIndexQuestion(
    client,
    firstMessage,
    threadChannel,
    interaction,
    repliedMessage.id,
  );

  const text = repliedMessage.content;
  const attachments = [...repliedMessage.attachments.values()];
  const imageMarkdowns = attachments
    .filter((att) => att.contentType?.startsWith("image/"))
    .map((att) => `![image](${att.url})`);

  const fullContent = [text, ...imageMarkdowns].join("\n\n");

  await indexAns({
    id: repliedMessage.id,
    author: repliedMessage.author.id,
    content: fullContent,
    qns_id: firstMessage.id,
    server_id: firstMessage.guild?.id!,
    thread_id: threadChannel.id,
    msg_url: repliedMessage.url,
    is_correct: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await createUserProfileIfNeeded(repliedMessage);

  const messages = await threadChannel.messages.fetch();
  const nonBotMessages = messages.filter(
    (msg) =>
      !msg.author.bot &&
      msg.id !== firstMessage.id &&
      msg.id !== repliedMessage.id,
  );

  for (const message of nonBotMessages.values()) {
    const text = message.content;
    const attachments = [...message.attachments.values()];
    const imageMarkdowns = attachments
      .filter((att) => att.contentType?.startsWith("image/"))
      .map((att) => `![image](${att.url})`);

    const fullContent = [text, ...imageMarkdowns].join("\n\n");
    await indexAns({
      id: message.id,
      author: message.author.id,
      content: fullContent,
      qns_id: firstMessage.id,
      server_id: firstMessage.guild?.id!,
      thread_id: threadChannel.id,
      msg_url: message.url,
      is_correct: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createUserProfileIfNeeded(message);
  }

  await interaction.editReply({
    embeds: [
      new EmbedBuilder().setDescription(
        "✅ | Message indexed as an **Answer**!",
      ),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("View Webpage")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://www.indexflow.site/qs/${firstMessage.guildId}`)
      ),
    ],
  });
}

async function createUserProfileIfNeeded(message: Message) {
  if (message.author.bot) return;

  const userProfile = await getAnonProfileById(message.author.id);
  if (!userProfile.success) {
    await createAnonProfile({
      id: message.author.id,
      name: getRandomAnonName(),
      dc_name: message.author.globalName,
      dc_pfp: message.author.avatarURL(),
      dc_uid: message.author.id,
      is_anon: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

async function sendNotConfigMessage(client: Client, message: Message) {
  const em = new EmbedBuilder()
    .setTitle("Configure settings!")
    .setDescription(
      "Your server needs to be **CONFIGURED** first. Use `$configure`.",
    )
    .setThumbnail(
      client.user?.avatarURL() || message.author.displayAvatarURL(),
    );

  if (
    message.channel instanceof TextChannel ||
    message.channel instanceof ThreadChannel
  ) {
    await message.channel.send({ embeds: [em] });
  }
}

async function sendNotiFlowMod(message: Message, roleId: string) {
  const em = new EmbedBuilder()
    .setTitle("Request Denied!")
    .setColor("Red")
    .setDescription(
      `You need <@&${roleId}> role to index this on web.\n Pls ask <@${message.guild?.ownerId}> to assign you this role.\n\n Or you can create your own thread with your question.`,
    );

  if (
    message.channel instanceof TextChannel ||
    message.channel instanceof ThreadChannel
  ) {
    await message.channel.send({ embeds: [em] });
  }
}
