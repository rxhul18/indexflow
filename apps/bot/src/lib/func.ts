import { CONFIG } from "../configs/config";
import { ConfigType, IndexAnsType, IndexQnsType, ServerType } from "../types";

const api = CONFIG.BOT_API_ENDPOINT;
const bearer = CONFIG.BOT_BEARER_TOKEN;

async function createServer(serverData: ServerType) {
  const response = await fetch(`${api}/server/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serverData),
  });
  const data = await response.json();
  return data;
}

async function getServerById(id: string) {
  const response = await fetch(`${api}/server/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    return { success: false, response };
  }

  const data = await response.json();
  return { success: true, data };
}

async function createServerConfig(serverConfigData: ConfigType) {
  const response = await fetch(`${api}/server/config/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serverConfigData),
  });
  const data = await response.json();
  return data;
}

async function getServerConfigById(id: string) {
  const response = await fetch(`${api}/server/config/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200) {
    return { success: false, response };
  }

  const data = await response.json();
  return { success: true, data };
}

async function indexQns(QnsData: IndexQnsType) {
  const response = await fetch(`${api}/index/qns/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(QnsData),
  });
  const data = await response.json();
  return data;
}

async function indexAns(AnsData: IndexAnsType) {
  const response = await fetch(`${api}/index/ans/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(AnsData),
  });
  const data = await response.json();
  return data;
}

export { createServer, getServerById, indexAns, indexQns, createServerConfig, getServerConfigById };
