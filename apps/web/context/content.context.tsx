"use client";
import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useServersStore, useTagsStore, useUsersStore } from "@/lib/zustand";
import { ConfigType, ServerType } from "@iflow/types";

interface ContentContextType {
  contentLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [contentLoading, setContentLoading] = useState(false);

  const { servers, setServers } = useServersStore();
  const { tags, setTags } = useTagsStore();
  const { users, setUsers } = useUsersStore();

  const SERVER_API_ENDPOINT =
    process.env.NODE_ENV == "development"
      ? "http://localhost:3001/v1/bot/server/all"
      : "https://api.indexflow.site/v1/bot/server/all";
  const TAGS_API_ENDPOINT =
    process.env.NODE_ENV == "development"
      ? "http://localhost:3001/v1/bot/tag/all"
      : "https://api.indexflow.site/v1/bot/tag/all";
  const USER_API_ENDPOINT =
    process.env.NODE_ENV == "development"
      ? "http://localhost:3001/v1/user/public"
      : "https://api.indexflow.site/v1/user/public";
  const CONFIG_SERVER_API_ENDPOINT =
    process.env.NODE_ENV == "development"
      ? "http://localhost:3001/v1/bot/server/config/all"
      : "https://api.indexflow.site/v1/bot/server/config/all";


  useEffect(() => {
    async function fetchServers() {
      setContentLoading(true);
      try {
        const data = await fetch(SERVER_API_ENDPOINT);
        const configData = await fetch(CONFIG_SERVER_API_ENDPOINT);
        const response = await data.json();
        const configResponse = await configData.json();
       
        const serverIdSet = new Set(configResponse?.configs?.map((config: ConfigType) => config.server_id));
        const finalData = response?.servers?.filter((item: ServerType) => serverIdSet.has(item.id)) || [];
       
        if (response?.servers) {
          setServers(finalData);
        }
      } catch (error) {
        console.error("Error fetching server data:", error);
      } finally {
        setContentLoading(false);
      }
    }

    if (servers.length === 0) {
      fetchServers();
    }
  }, [servers, setServers]);

  useEffect(() => {
    async function fetchTags() {
      setContentLoading(true);
      const data = await fetch(TAGS_API_ENDPOINT);
      const response = await data.json();
      if (response?.tags) {
        setTags(response.tags);
      }
      setContentLoading(false);
    }

    if (tags.length === 0) {
      fetchTags();
    }
  }, [tags.length, setTags]);

  useEffect(() => {
    async function fetchUsers() {
      const data = await fetch(USER_API_ENDPOINT);
      const response = await data.json();
      if (response?.users) {
        setUsers(response.users);
      }
    }

    if (users.length === 0) {
      fetchUsers();
    }
  }, [users.length, setUsers]);

  const value = {
    contentLoading,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
