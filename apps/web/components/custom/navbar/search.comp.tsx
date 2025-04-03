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
import { useTagsStore, useUsersStore } from "@/lib/zustand";
import { questions } from "@/json/dummy";
import { useRouter } from "next/navigation";
import { TagType, UserType } from "@iflow/types";

export default function SearchInputCommand() {
  const [commandOpen, setCommandOpen] = useState(false);
  const { users } = useUsersStore();
  const { tags } = useTagsStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    users: UserType[];
    tags: TagType[];
    questions: any[];
  }>({ users: [], tags: [], questions: [] });

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults({ users: [], tags: [], questions: [] });
      return;
    }

    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const filteredTags = tags.filter((tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    const filteredQuestions = questions.filter(
      (q) =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setSearchResults({
      users: filteredUsers,
      tags: filteredTags,
      questions: filteredQuestions,
    });
  }, [searchQuery, users, tags, questions]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    console.log({
      tags: tags,
      users: users,
      questions: questions,
    });
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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

              {searchResults.users.length > 0 && (
                <CommandGroup heading="Users">
                  {searchResults.users.map((user) => (
                    <CommandItem
                      key={user.id}
                      className="cursor-pointer"
                      onSelect={() => {
                        // Use onSelect instead of onClick for better CommandItem handling
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
