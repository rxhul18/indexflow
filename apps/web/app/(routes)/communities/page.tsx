"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo, Suspense, useEffect } from "react";
import CommunityGrid from "../../../components/custom/community/communities.card";
import { useServersStore } from "@/lib/zustand";
import { useSearchParams, useRouter } from "next/navigation";

function CommunitiesPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const { servers } = useServersStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get server name from URL params and set it as initial search query
  useEffect(() => {
    const serverName = searchParams.get("server");
    if (serverName) {
      setSearchQuery(serverName);
    }
  }, [searchParams]);

  const filteredServers = useMemo(() => {
    if (!searchQuery) {
      return servers;
    }

    const normalizedSearch = searchQuery.trim().toLowerCase();
    return servers.filter((server) => {
      const serverName = server.name?.trim().toLowerCase() || '';
      return serverName.includes(normalizedSearch);
    });
  }, [searchQuery, servers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Update URL with search parameter
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("server", value.trim().toLowerCase());
    } else {
      params.delete("server");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex w-full justify-center h-[calc(100vh-120px)] overflow-hidden py-5">
      <div className="flex flex-col min-w-[90%] md:container w-full px-4">
        <div className="flex flex-col md:flex-row min-w-full justify-between items-start mb-6 gap-4">
          <div className="relative w-full md:w-full flex flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Filter by community..."
              className="pl-10 border-muted"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div>
          </div>
        </div>
        <div className="overflow-y-auto h-full overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <CommunityGrid filteredServers={filteredServers} />
        </div>
      </div>
    </div>
  );
}

export default function CommunitiesPage() {
  return (
    <Suspense fallback={<div className="text-center py-4">Loading search...</div>}>
      <CommunitiesPageContent />
    </Suspense>
  );
}