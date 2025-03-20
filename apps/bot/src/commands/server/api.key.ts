
import {
  Client,
  Message,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "api-key",
  aliases: ["apik", "apk"],
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
        const svr = interaction.guildId;

        await interaction.reply({
          content: `**🔑 API_KEY:** \`iflow_${api}\` \n\n **🔗 API_ENDPOINT:** \`https://api.indexflow.site/v1/data/${svr}\``,
          flags: 64,
        });
      });
    }
  },
};
