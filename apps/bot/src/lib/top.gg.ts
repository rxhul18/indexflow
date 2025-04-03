import { Api } from "@top-gg/sdk";
import { CONFIG } from "../configs/config";

const TopGGApi = new Api(CONFIG.TOPGG_TOKEN!)

async function hasVotedOnTopGG(id:string) {
    const res = await TopGGApi.hasVoted(id);
    return res;
}
export {TopGGApi, hasVotedOnTopGG};