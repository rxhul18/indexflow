
import { IndexAnsType, IndexQnsType } from "@iflow/types";
const QNS_API_ENDPOINT = process.env.NODE_ENV == "development" ? "http://localhost:3001/v1/bot/index/qns/all" : "https://api.indexflow.site/v1/bot/index/qns/all";
const ANS_API_ENDPOINT = process.env.NODE_ENV == "development" ? "http://localhost:3001/v1/bot/index/ans/all" : "https://api.indexflow.site/v1/bot/index/ans/all";

async function fetchIndexedQns() {
    const data = await fetch(QNS_API_ENDPOINT);
    const response = await data.json();
    const qns: IndexQnsType[] = response?.qns;
    return qns;
}

async function fetchIndexedAns() {
    const data = await fetch(ANS_API_ENDPOINT);
    const response = await data.json();
    const ans: IndexAnsType[] = response?.ans;
    return ans;
}

export {fetchIndexedAns, fetchIndexedQns};