"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState, useMemo, Suspense } from "react";
import { subDays, parseISO } from "date-fns";
import UserGrid from "../../../components/custom/user/users.card";
import { useUsersStore } from "@/lib/zustand";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const { users } = useUsersStore();

  const filteredUsers = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30).getTime();

    return users.filter((user) => {
      if (
        searchQuery && user.username &&
        !user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.location?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user?.recentTags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      ) {
        return false;
      }

      if (userTypeFilter === "new") {
        if (!user.createdAt) return false;
        const createdAtDate =
          typeof user.createdAt === "string"
            ? parseISO(user.createdAt)
            : new Date(user.createdAt);
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
                <TabsTrigger value="all" className="cursor-pointer">
                  All users
                </TabsTrigger>
                <TabsTrigger value="new" className="cursor-pointer">
                  New users
                </TabsTrigger>
                <TabsTrigger value="anonymous" className="cursor-pointer">
                  Anonymous
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* </div> */}
        </div>
        <div className="overflow-y-auto h-full overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <Suspense
            fallback={<div className="text-center py-4">Loading users...</div>}
          >
            <UserGrid filteredUsers={filteredUsers} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
