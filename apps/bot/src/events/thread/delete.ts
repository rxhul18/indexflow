import { Client, AnyThreadChannel, ChannelType } from "discord.js";

export default async function handleThreadDelete(
  client: Client & { config: { owner: string[]; noprefix: string[] } },
): Promise<void> {
  client.on("threadDelete", async (thread: AnyThreadChannel) => {
    if (thread.type === ChannelType.PublicThread) {
      console.log(`A thread has been deleted: ${thread.name}`);
    }
  });
}
