import { ColorResolvable, TextChannel, ThreadChannel } from "discord.js";
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
import { getServerConfigById, indexAns, indexQns } from "../../lib/func";

export default {
  name: "index",
  aliases: ["ind", "iqs", "inx"],
  adminPermit: false,
  ownerPermit: false,
  cat: "indexing",
  run: async (
    client: Client & { config: { default_color: ColorResolvable } },
    message: Message,
  ) => {
    if (!message.reference || !message.channel) {
      return message.reply("❌ | You need to reply to a message to index it!");
    }

    const repliedMessage = await message.channel.messages.fetch(
      message.reference.messageId as string,
    );

    const isConfig = await getServerConfigById(repliedMessage.guildId!);

    // if (!isConfig.success) {
    //   return message.reply("❌ | Fuck Config.");
    // }

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

    // If it's a text channel, ask for Question/Answer selection
    const confirmEmbed = new EmbedBuilder()
      .setColor(client.config.default_color)
      .setDescription(
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
      time: 30000, // 30 seconds timeout
    });

    collector.on("collect", async (interaction: ButtonInteraction) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({
          content: "❌ | Only the command initiator can interact with this.",
          flags: 64,
        });
      }

      await interaction.deferUpdate();

      const updatedActionRow =
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("index_question")
            .setLabel("Index the Question")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("index_answer")
            .setLabel("Index as Answer")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("index_cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true),
        );

      if (interaction.customId === "index_question") {
        // Fetch thread channel
        const threadChannel = message.channel as ThreadChannel;
        // Fetch the first message in the thread (thread owner's message)
        const firstMessage = await threadChannel.fetchStarterMessage();
        if (!firstMessage) {
          return interaction.reply({
            content: "❌ | Couldn't fetch the thread owner's message.",
            ephemeral: true,
          });
        }

        await indexQns({
          id: firstMessage.id,
          title: threadChannel.name,
          author: firstMessage.author.id,
          content: firstMessage.content,
          server_id: firstMessage.guildId,
          thread_id: threadChannel.id,
          msg_url: firstMessage.url,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.default_color)
              .setDescription("✅ | Message indexed as a **Question**!"),
          ],
          components: [updatedActionRow],
        });
        // Perform the indexing action as a "Question" here
      } else if (interaction.customId === "index_answer") {
        // Fetch thread channel
        const threadChannel = message.channel as ThreadChannel;
        // Fetch the first message in the thread (thread owner's message)
        const firstMessage = await threadChannel.fetchStarterMessage();
        if (!firstMessage) {
          return interaction.reply({
            content: "❌ | Couldn't fetch the thread owner's message.",
            ephemeral: true,
          });
        }
        await indexQns({
          id: firstMessage.id,
          title: threadChannel.name,
          author: firstMessage.author.id,
          content: firstMessage.content,
          server_id: firstMessage.guildId,
          thread_id: threadChannel.id,
          msg_url: firstMessage.url,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await indexAns({
          id: repliedMessage.id,
          author: repliedMessage.author.id,
          content: repliedMessage.content,
          qns_id: firstMessage.id,
          server_id: firstMessage.guildId,
          thread_id: threadChannel.id,
          msg_url: repliedMessage.url,
          is_correct: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Fetch all messages in the thread
        const messages = await threadChannel.messages.fetch();
        const filteredMessages = messages.filter(
          (msg) =>
            msg.id !== firstMessage.id &&
            msg.id !== repliedMessage.id &&
            !msg.author.bot,
        );

        // Index all other messages as answers
        for (const msg of filteredMessages.values()) {
          await indexAns({
            id: msg.id,
            author: msg.author.id,
            content: msg.content,
            qns_id: firstMessage.id,
            server_id: msg.guildId,
            thread_id: threadChannel.id,
            msg_url: msg.url,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.default_color)
              .setDescription("✅ | Message indexed as an **Answer**!"),
          ],
          components: [updatedActionRow],
        });
        // Perform the indexing action as an "Answer" here
      } else if (interaction.customId === "index_cancel") {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.default_color)
              .setDescription("❌ | Indexing **cancelled**."),
          ],
          components: [updatedActionRow],
        });
      }

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
        await replyMessage.reply(
          "⏰ | No response. Indexing request timed out.",
        );
      }
    });
  },
};
