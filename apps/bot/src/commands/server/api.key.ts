import {
  Client,
  Message,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { getServerConfigById } from "../../lib/func";

export default {
  name: "api-key",
  aliases: ["apik", "apk", "api"],
  adminPermit: false,
  ownerPermit: false,
  cat: "server",
  run: async (
    client: Client & { config: { owner: string[] } },
    message: Message,
  ) => {
    const authorizedUsers = [...client.config.owner];
    const isSvOwner = message.author.id === message.guild?.ownerId;
    const configId = message.guildId! + message.guild?.ownerId!;
    const alreadyConfigured = await getServerConfigById(configId);
    let apiEndpoint = null;
    if (!alreadyConfigured.success) {
      return sendNotConfigMessage(client, message);
    } else {
      apiEndpoint = alreadyConfigured.data?.config.qna_endpoint;
    }

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
      .setTitle("⚠️ Make sure to keep your env details safe!")
      .setThumbnail(
        client.user?.avatarURL() || message.author.displayAvatarURL(),
      )
      .setDescription(
        "You can access your server's all indexed data by just making a **POST** request to our ``API_ENDPOINT`` along with your ``API_KEY`` passed in body **JSON** format.",
      );

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel("Get API KEY")
        .setCustomId("api_btn"),
    );

    if (message.channel instanceof TextChannel) {
      const sentMessage = await message.channel.send({
        embeds: [embed],
        components: [button],
      });

      const collector = sentMessage.createMessageComponentCollector({
        filter: (interaction) =>
          interaction.isButton() && interaction.customId === "api_btn",
        time: 60000,
      });

      collector.on("collect", async (interaction) => {
        if (!interaction.isButton()) return;
        const api = interaction.guild?.ownerId;

        await interaction.reply({
          content: `**🔑 API_KEY:** \`iflow_${api}\` \n\n **🔗 API_ENDPOINT:** \`${apiEndpoint}\``,
          flags: 64,
        });
      });
    }
  },
};

async function sendNotConfigMessage(client: Client, message: Message) {
  const em = new EmbedBuilder()
    .setTitle("Configure settings!")
    .setDescription(
      "Your server needs to be **CONFIGURED** first in order to use this command. \n\n **Don't know how to configure?** \n > Use `$configure` command.",
    )
    .setThumbnail(
      client.user?.avatarURL() || message.author.displayAvatarURL(),
    );

  if (message.channel instanceof TextChannel) {
    await message.channel.send({ embeds: [em] });
  }
}