"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { subDays, parseISO } from "date-fns";
import UserGrid from "./usercard";
import { UserType as User } from "@iflow/types";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const API_ENDPOINT = process.env.NODE_ENV == "development" ? "http://localhost:3001/v1/user/public" : "https://api.indexflow.site/v1/user/public";

  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    async function fetchServers() {
      const data = await fetch(API_ENDPOINT);
      const response = await data.json();
      console.log("users", response);
      setUsers([...response?.users, ...users]);
    }

    if (users.length === 0) {
      fetchServers();
    }
  }, [users]);


  const filteredUsers = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30).getTime();

    return users.filter((user) => {
      if (
        searchQuery &&
        !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.location?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user?.recentTags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      ) {
        return false;
      }

      if (userTypeFilter === "new") {
        if (!user.createdAt) return false;
        const createdAtDate = typeof user.createdAt === 'string' ? parseISO(user.createdAt) : new Date(user.createdAt);
        return createdAtDate.getTime() >= thirtyDaysAgo;
      }

      if (userTypeFilter === "anonymous") {
        return !user.location;
      }

      return userTypeFilter === "all";
    });
  }, [searchQuery, userTypeFilter, users]);

  return (
    <div className="flex w-full justify-center h-[calc(100vh-120px)] overflow-hidden py-5">
      <div className="flex flex-col gap-4 min-w-[90%] md:container w-full px-4">
        <div className="flex flex-col md:flex-row min-w-full justify-between items-start mb-6 gap-4">
          {/* <div className="flex flex-row h-full w-full items-center justify-between gap-10"> */}
          <div className="relative w-full md:w-full flex flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Filter by user..."
              className="pl-10 border-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Tabs
              value={userTypeFilter}
              onValueChange={setUserTypeFilter}
              className="w-full sm:w-auto"
            >
              <TabsList className="gap-1 p-1 bg-muted/30 border rounded-md">
                <TabsTrigger value="all">All users</TabsTrigger>
                <TabsTrigger value="new">New users</TabsTrigger>
                <TabsTrigger value="anonymous">Anonymous</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* </div> */}
        </div>
        <div className="overflow-y-auto h-full overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <UserGrid filteredUsers={filteredUsers} />
        </div>
      </div>
    </div>
  );
}
