"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useTagsStore, useUsersStore, useServersStore } from "@/lib/zustand";
import { questions } from "@/json/dummy";
import { useRouter } from "next/navigation";
import { TagType, UserType, ServerType } from "@iflow/types";

export default function SearchInputCommand() {
  const [commandOpen, setCommandOpen] = useState(false);
  const { users } = useUsersStore();
  const { tags } = useTagsStore();
  const { servers } = useServersStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    users: UserType[];
    tags: TagType[];
    servers: ServerType[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    questions: any[];
  }>({ users: [], tags: [], servers: [], questions: [] });

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults({ users: [], tags: [], servers: [], questions: [] });
      return;
    }

    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(normalizedSearch),
    );
    const filteredTags = tags.filter((tag) =>
      tag.name.toLowerCase().includes(normalizedSearch),
    );
    const filteredServers = servers.filter((server) =>
      server.name?.trim().toLowerCase().includes(normalizedSearch),
    );
    const filteredQuestions = questions.filter(
      (q) =>
        q.title.toLowerCase().includes(normalizedSearch) ||
        q.content.toLowerCase().includes(normalizedSearch),
    );

    setSearchResults({
      users: filteredUsers,
      tags: filteredTags,
      servers: filteredServers,
      questions: filteredQuestions,
    });
  }, [searchQuery, users, tags, servers, questions]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleServerSelect = (server: ServerType) => {
    const serverName =
      server.name?.trim().toLowerCase().replace(/\s+/g, "+") || "";
    router.push(`/communities?server=${serverName}`);
    setCommandOpen(false);
  };

  return (
    <div className="hidden md:flex md:items-center md:gap-3 flex-1 px-2 pl-6">
      <div className="relative w-full flex-1 items-center flex">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full pl-10 relative"
          onClick={() => setCommandOpen(true)}
          readOnly
        />
        <>
          <p className="text-sm cursor-pointer-none w-fit gap-1 flex absolute right-3">
            <kbd className="flex h-6 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>
              <span>+</span> K
            </kbd>
          </p>
          <CommandDialog
            open={commandOpen}
            onOpenChange={(open) => setCommandOpen(open)}
          >
            <CommandInput
              placeholder="Type a command or search..."
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              {searchResults.servers.length > 0 && (
                <CommandGroup heading="Servers">
                  {searchResults.servers.map((server) => (
                    <CommandItem
                      key={server.id}
                      className="cursor-pointer"
                      onSelect={() => handleServerSelect(server)}
                    >
                      {server.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.users.length > 0 && (
                <CommandGroup heading="Users">
                  {searchResults.users.map((user) => (
                    <CommandItem
                      key={user.id}
                      className="cursor-pointer"
                      onSelect={() => {
                        router.push(`/users`);
                        setCommandOpen(false);
                      }}
                    >
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.tags.length > 0 && (
                <CommandGroup heading="Tags">
                  {searchResults.tags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      className="cursor-pointer"
                      onSelect={() => {
                        router.push(`/?filter=${tag.name}`);
                        setCommandOpen(false);
                      }}
                    >
                      {tag.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchResults.questions.length > 0 && (
                <CommandGroup heading="Questions">
                  {searchResults.questions.map((q) => (
                    <CommandItem
                      key={q.id}
                      className="cursor-pointer"
                      onSelect={() => {
                        router.push(`/qs/${q.id}`);
                        setCommandOpen(false);
                      }}
                    >
                      {q.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </CommandDialog>
        </>
      </div>
    </div>
  );
}
