import {
  Client,
  AnyThreadChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ButtonInteraction,
  MessageFlags,
} from "discord.js";
import { CONFIG } from "../../configs/config";
import { createAnonProfile, getAnonProfileById, getRandomAnonName } from "../../lib/func";

export default async function handleThreadCreate(
  client: Client & { config: { owner: string[]; noprefix: string[] } },
): Promise<void> {
  client.on("threadCreate", async (thread: AnyThreadChannel, newlyCreated: boolean) => {
    if (!newlyCreated) return;

    console.log(`A new thread has been created: ${thread.name}`);

    const embed = new EmbedBuilder()
      .setTitle("Indexing threads on indexflow.site")
      .setDescription(
        "To help others find answers online, you can mark your question as solved via\n" +
          "***Reply to the correct answer with `$index` to index this whole thread content.***",
      );

    const mngPembed = new EmbedBuilder()
      .setTitle("Manage your privacy")
      .setDescription(
        `Do you want to be Anonymous while indexing this thread on [indexflow.site](${CONFIG.WEB_URL})?\n` +
          "***Reply to the correct answer with `$index` to index this whole thread content.***",
      );

    const privacyButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("qonly_yes").setLabel("Yes, hide me").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("qonly_no").setLabel("No, am fine").setStyle(ButtonStyle.Danger),
    );

    const mainButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId("mng_privacy").setLabel("Manage Privacy").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("index_dismiss").setLabel("Dismiss").setStyle(ButtonStyle.Danger),
    );

    const sentMessage = await thread.send({
      embeds: [embed],
      components: [mainButtons],
    });

    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 180000, // 3 minutes
    });

    collector.on("collect", async (interaction: ButtonInteraction) => {
      if (!interaction.isButton()) return;

      switch (interaction.customId) {
        case "mng_privacy":
          await handleManagePrivacy(interaction, mngPembed, privacyButtons);
          break;
        case "index_dismiss":
          await interaction.update({ embeds: [], components: [], content: "..." });
          break;
        default:
          await interaction.reply({ content: "Unknown button clicked!", flags: MessageFlags.SuppressEmbeds });
      }
    });

    collector.on("end", async () => {
      const expiredEmbed = new EmbedBuilder()
      .setDescription(
        "To help others find answers online, you can mark your question as solved via\n" +
          "***Reply to the correct answer with `$index` to index this whole thread content.***",
      )
      .setFooter({
        text: "This session has expired. Follow the image example for indexing.",
      });

      const newActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setLabel("More Info").setStyle(ButtonStyle.Link).setURL("https://indexflow.site"),
        new ButtonBuilder().setLabel("Support Server").setStyle(ButtonStyle.Link).setURL("https://discord.gg/AEaBWNSgkf"),
        new ButtonBuilder().setLabel("Sponsor").setStyle(ButtonStyle.Link).setURL("https://l.devwtf.in/sponsor"),
      );

      await sentMessage.edit({
        embeds: [expiredEmbed],
        components: [newActionRow],
        content: "***Just fyi... 👇🏻***",
      });
    });
  });
}

async function handleManagePrivacy(interaction: ButtonInteraction, mngPembed: EmbedBuilder, privacyButtons: ActionRowBuilder<ButtonBuilder>) {
  const isProfileExists = await getAnonProfileById(interaction.user.id);

  if (!isProfileExists.success) {
    await interaction.deferReply({ flags: 64 });

    await createAnonProfile({
      id: interaction.user.id,
      name: getRandomAnonName(),
      is_anon: false,
      dc_uid: interaction.user.id,
      dc_name: interaction.user.globalName,
      dc_pfp: interaction.user.displayAvatarURL(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await interaction.editReply({ embeds: [mngPembed], components: [privacyButtons], content: "" });
  } else {
    await interaction.reply({ embeds: [mngPembed], components: [privacyButtons], flags: 64 });
  }
}
