import { CONFIG } from "../configs/config";
import { ServerType } from "../types";

const api = CONFIG.BOT_API_ENDPOINT;
const bearer = CONFIG.BOT_BEARER_TOKEN;

async function createServer(serverData: ServerType) {
    const response = await fetch(`${api}/server/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${bearer}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serverData)
    });
    const data = await response.json();
    return data;
}

async function getServerById(id: string) {
    const response = await fetch(`${api}/server/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearer}`,
            'Content-Type': 'application/json'
        },
    });
    
    if (response.status !== 200) {
        return {success: false, response};
    }
    
    const data = await response.json();
    return { success: true, data };
}

export {createServer, getServerById}