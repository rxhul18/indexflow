import { ColorResolvable } from "discord.js";
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

    if (!repliedMessage) {
      return message.reply("❌ | Couldn't find the replied message.");
    }

    const confirmEmbed = new EmbedBuilder()
      .setColor(client.config.default_color)
      .setDescription(
        "📝 | Should I index this message as a Question or Answer?",
      );

    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("index_question")
        .setLabel("Index as Question")
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
          flags: 64
        });
      }

      await interaction.deferUpdate();

      const updatedActionRow =
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("index_question")
            .setLabel("Index as Question")
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
