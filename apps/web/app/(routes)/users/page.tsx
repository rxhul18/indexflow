"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { subDays, parseISO } from "date-fns";
import { users } from "@/json/dummy";
import UserGrid from "./usercard";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = subDays(now, 7).getTime();
    const thirtyDaysAgo = subDays(now, 30).getTime();

    return users.filter((user) => {
      if (
        searchQuery &&
        !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      ) {
        return false;
      }

      if (userTypeFilter === "active" && user.lastActive) {
        return parseISO(user.lastActive).getTime() >= sevenDaysAgo;
      }

      if (userTypeFilter === "new" && user.createdAt) {
        return parseISO(user.createdAt).getTime() >= thirtyDaysAgo;
      }

      if (userTypeFilter === "anonymous") {
        return !user.location;
      }

      return userTypeFilter === "all";
    });
  }, [searchQuery, userTypeFilter]);

  return (
    <div className="flex w-full justify-center h-[calc(100vh-120px)] overflow-hidden py-5">
      <div className="flex flex-col gap-4 max-w-[1400px] w-full px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold">Users</h1>
          <div className="relative w-full sm:w-96 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Filter by user..."
              className="pl-10 border-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs
            value={userTypeFilter}
            onValueChange={setUserTypeFilter}
            className="w-full sm:w-auto"
          >
            <TabsList className="gap-1 p-1 bg-muted/30 border rounded-md">
              <TabsTrigger value="all">All users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="new">New users</TabsTrigger>
              <TabsTrigger value="anonymous">Anonymous</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="overflow-y-auto h-full overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <UserGrid filteredUsers={filteredUsers} />
        </div>
      </div>
    </div>
  );
}
