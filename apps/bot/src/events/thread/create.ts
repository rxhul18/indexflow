import {
  Client,
  AnyThreadChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Interaction,
  ComponentType,
  ButtonInteraction,
  Message,
} from "discord.js";

export default async function handleThreadCreate(
  client: Client & { config: { owner: string[]; noprefix: string[] } },
): Promise<void> {
  client.on(
    "threadCreate",
    async (thread: AnyThreadChannel, newlyCreated: boolean) => {
      if (newlyCreated) {
        const embed = new EmbedBuilder()
          .setTitle("Indexing threads on indexflow.site")
          .setDescription(
            `To help others find answers online, you can mark your question as solved via\n` +
              "***Replying to a message with `$index` to index your Question/Answer or both.***",
          );

        const mngPembed = new EmbedBuilder()
          .setTitle("Manage your privacy")
          .setDescription(
            `Do you want to be Annonymous while indexing this thread on [indexflow.site](devwtf.in)\n` +
              "***Reply to a message with `$index` to index your Question/Answer or both.***",
          );

        const mngPactRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("qonly_yes")
            .setLabel("Yes, hide me")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("qonly_no")
            .setLabel("No, am fine")
            .setStyle(ButtonStyle.Danger),
        );

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("mng_privacy")
            .setLabel("Manage Privacy")
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId("index_dismiss")
            .setLabel("Dismiss")
            .setStyle(ButtonStyle.Danger),
        );

        console.log(`A new thread has been created: ${thread.name}`);

        const sentMessage = await thread.send({
          embeds: [embed],
          components: [actionRow],
        });

        const collector = sentMessage.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 180000, // 3 minutes in milliseconds
        });

        collector.on("collect", async (interaction: Interaction) => {
          if (!interaction.isButton()) return;

          switch (interaction.customId) {
            case "mng_privacy":
              await interaction.reply({
                embeds: [mngPembed],
                components: [mngPactRow],
                flags: 64,
              });
              break;
            case "index_dismiss":
              await sentMessage.edit({
                embeds: [],
                components: [],
                content: "...",
              });
              break;
            default:
              await interaction.reply({
                content: "Unknown button clicked!",
                flags: 64,
              });
          }
        });

        collector.on("end", async () => {
          // actionRow.components.forEach((button) => button.setDisabled(true));
          embed.setFooter({
            text: "This session has expired. Follow the image example for indexing.",
          });

          const newActionRow =
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setLabel("More Info")
                .setStyle(ButtonStyle.Link)
                .setURL("https://indexflow.site"),

              new ButtonBuilder()
                .setLabel("Support Server")
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.gg/AEaBWNSgkf"),

              new ButtonBuilder()
                .setLabel("Sponsor")
                .setStyle(ButtonStyle.Link)
                .setURL("https://l.devwtf.in/sponsor"),
            );

          await sentMessage.edit({
            embeds: [embed],
            components: [newActionRow],
            content: "***Just fyi... 👇🏻***",
          });
        });
      }
    },
  );
}
