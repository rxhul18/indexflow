import { logger, schedules, wait } from "@trigger.dev/sdk/v3";
import { prisma } from "@iflow/db";
import { fetch } from "undici";

interface acc {
  id: string;
  providerId: string;
  accountId: string;
  accessToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshToken: string | null;
  scope: string | null;
  createdAt: Date;
  updatedAt: Date;
}
export const firstScheduledTask = schedules.task({
  id: "iflow-guild-member-adder",
  // Every day at midnight
  cron: "0 0 * * *",
  // cron: "* * * * *", // Runs every minute
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    const discordAccounts: acc[] = [];
    const accounts = await prisma.account.findMany({
      select: {
        id: true,
        providerId: true,
        accountId: true,
        accessToken: true,
        accessTokenExpiresAt: true,
        refreshToken: true,
        scope: true,
        createdAt: true,
        updatedAt: true
      },
    });

    const now = new Date();

    for (const account of accounts) {
      if (
        account.providerId === "discord" &&
        account.accessToken &&
        account.accessTokenExpiresAt &&
        account.accessTokenExpiresAt > now
      ) {
        try {
          const res = await fetch("https://discord.com/api/users/@me", {
            headers: {
              Authorization: `Bearer ${account.accessToken}`,
            },
          });
          
          if (res.ok) {
            discordAccounts.length = 0;
            // Wait for 2 seconds
            await wait.for({ seconds: 2 });
            discordAccounts.push(account);
          } else {
            logger.warn(`Invalid token for account ${account.accountId}`);
            console.warn(`Invalid token for account ${account.accountId}`);
          }
        } catch (err) {
          logger.error(`Failed to verify token for account ${account.accountId}`, { error: err });
          console.error(`Failed to verify token for account ${account.accountId}`, { error: err });
        }
      }
    }

    const TOKEN = process.env.DISCORD_TOKEN;

    for (const acc of discordAccounts) {
      // Wait for 2 seconds
      await wait.for({ seconds: 2 });
      if (discordAccounts.length !== 0 && acc.accessToken) {
        try {
          const res = await fetch(`https://discord.com/api/guilds/1180199540922515589/members/${acc.accountId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bot ${TOKEN}`,
            },
            body: JSON.stringify({
              access_token: acc.accessToken,
              roles: ['1358482664352645341']
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            logger.warn(`Failed to add member ${acc.accountId}`, { errorData });
            console.warn(`Failed to add member ${acc.accountId}`, errorData);
          } else {
            logger.log(`Successfully added member ${acc.accountId}`);
            console.log(`Successfully added member ${acc.accountId}`);
          }
        } catch (err) {
          logger.error(`Error adding member ${acc.accountId}`, { error: err });
          console.error(`Error adding member ${acc.accountId}`, { error: err });
        }
      }
    }

    logger.log(`Found ${discordAccounts.length} Discord Accounts!`);
    console.log(`Found ${discordAccounts.length} Discord Accounts!`);
  },
});
