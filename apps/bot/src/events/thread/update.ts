import { Client, AnyThreadChannel, ChannelType } from "discord.js";

export default async function handleThreadUpdate(
  client: Client & { config: { owner: string[]; noprefix: string[] } },
): Promise<void> {
  client.on("threadUpdate", async (oldThread: AnyThreadChannel, newThread: AnyThreadChannel) => {
    console.log("old: ", oldThread)
    console.log("new: ", newThread)
    if (oldThread.type === ChannelType.PublicThread && newThread.type === ChannelType.PublicThread) {
        // console.log(`A thread has been deleted: ${thread.name}`);
      }
  });
}
