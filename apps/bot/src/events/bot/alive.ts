import { Client } from "discord.js";

export default async function alive(client: Client) {
  client.on("ready", async () => {
    console.log(`${client.user?.username} is ready! 🤖`);

    const activities = [
      `${client.config?.prefix}help | indexflow.site`,
      `SignUp today on indexflow.site`,
      `Your public threads!`,
      `Questions to index on indexflow.site`,
      `prompt ${client.config?.prefix}help.`,
    ];

    const randomActivity =
      activities[Math.floor(Math.random() * activities.length)];

    client.user?.setPresence({
      activities: [
        {
          name: randomActivity,
          type: 3,
        },
      ],
      status: "idle",
    });

    // Reload presence every 15 minutes
    setInterval(
      async () => {
        const randomActivity =
          activities[Math.floor(Math.random() * activities.length)];
        client.user?.setPresence({
          activities: [
            {
              name: randomActivity,
              type: 3,
            },
          ],
          status: "idle",
        });
      },
      15 * 60 * 1000,
    );
  });
}
