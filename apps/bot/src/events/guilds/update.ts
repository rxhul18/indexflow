import { Client, EmbedBuilder, WebhookClient } from "discord.js";
import { getServerConfigById, updateServer } from "../../lib/func";

export default async function handleGuildUpdate(
    client: Client,
  ): Promise<void> {
    client.on("guildUpdate", async (oldGuild, newGuild) => {
        const configId = oldGuild.id! + oldGuild.ownerId!;
        const fetchServerConfig = await getServerConfigById(configId);

      try {
        const isNameChanged = oldGuild.name !== newGuild.name;
        const isOwnerChanged = oldGuild.ownerId !== newGuild.ownerId;
        const isIconChanged = oldGuild.iconURL() !== newGuild.iconURL();

        await updateServer({
            id: newGuild.id,
            name: isNameChanged ? newGuild.name : oldGuild.name,
            logo: isIconChanged ? newGuild.iconURL() : oldGuild.iconURL(),
            owner_id: isOwnerChanged ? newGuild.ownerId : oldGuild.ownerId,
            updatedAt: new Date(),
        })

        const embed = new EmbedBuilder().setDescription(
            "Successfully synced your guild data!" );

        const loggin_wbhk = fetchServerConfig.data.config.log_channel_webhook!;
        console.log(fetchServerConfig)
        const log_config = new WebhookClient({
          url: loggin_wbhk,
        });

        log_config.send({ embeds: [embed] });

        console.log("Successfully synced your guild data!");
      } catch (error) {
        console.error("Failed to sync guild update:", error);
        const loggin_wbhk = fetchServerConfig.data.configs.log_channel_webhook!;
        const log_config = new WebhookClient({
          url: loggin_wbhk,
        });

        log_config.send({ content: "Failed to sync guild update!" });
      }

    });
  }
