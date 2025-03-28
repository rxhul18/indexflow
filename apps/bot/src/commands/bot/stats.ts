import { Client, Message, TextChannel, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction } from "discord.js";
import { getDbStats } from "../../lib/func";

export default {
    name: "stats",
    aliases: ["statistics", "stat"],
    adminPermit: false,
    ownerPermit: false,
    cat: "bot",
    run: async (client: Client, message: Message) => {
        try {
            const guildCount = client.guilds.cache.size;
            const userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

            const embed = new EmbedBuilder()
                .setTitle("📊 Bot Statistics")
                .setDescription(
                    `**Guilds:** ${guildCount}\n` +
                    `**Total Users:** ${userCount}`
                )
                .setTimestamp();

            const button = new ButtonBuilder()
                .setCustomId("more_details")
                .setLabel("More Details")
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

            if (message.channel instanceof TextChannel) {
                const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

                const collector = sentMessage.createMessageComponentCollector({ time: 60000 });

                collector.on("collect", async (interaction: Interaction) => {
                    if (!interaction.isButton() || interaction.customId !== "more_details") return;
                    await interaction.deferUpdate();

                    const dbStats = await getDbStats();
                    const { UsersCount, AnonProfilesCount, TagsCount, QuestionsCount, AnswersCount, ServersCount, ConfigsCount } = dbStats.data;

                    const updatedEmbed = new EmbedBuilder()
                        .setTitle("📊 Database Statistics")
                        .setDescription(
                            `**Users:** ${UsersCount}\n` +
                            `**AnonUsers:** ${AnonProfilesCount}\n` +
                            `**Tags:** ${TagsCount}\n` +
                            `**Questions:** ${QuestionsCount}\n` +
                            `**Answers:** ${AnswersCount}\n` +
                            `**Servers:** ${ServersCount}\n` +
                            `**Configurations:** ${ConfigsCount}`
                        )
                        .setTimestamp();

                    await sentMessage.edit({ embeds: [updatedEmbed], components: [] });
                });
            }
        } catch (error) {
            console.error("Error fetching bot stats:", error);
            if (message.channel instanceof TextChannel) {
                await message.channel.send("❌ An error occurred while fetching the bot statistics.");
            }
        }
    }
};