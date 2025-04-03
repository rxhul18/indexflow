import { Client } from "discord.js";
import AutoPoster from "topgg-autoposter";
import { CONFIG } from "../../configs/config";
import { log_topgg } from "../../lib/loggers";

export default async function TOPGGstats(client: Client) {
  const ap = AutoPoster(CONFIG.TOPGG_TOKEN!, client, {interval: 3600000})

  ap.on('posted', (stats) => {
    console.log(`Posted stats to Top.gg: ${stats.serverCount} servers | ${stats.shardCount} shards.`)
    log_topgg.send(`**Posted stats to Top.gg:** ${stats.serverCount} servers | ${stats.shardCount} shards.`)
  })
}
