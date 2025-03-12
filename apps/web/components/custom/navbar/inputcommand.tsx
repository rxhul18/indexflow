"use client";
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export default function SearchInputCommand() {
    const [commandOpen, setCommandOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setCommandOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <div className="hidden md:flex md:items-center md:gap-3 flex-1 px-2 pl-6">
            <div className="relative w-full flex-1 items-center flex">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-10 relative"
                    onClick={() => setCommandOpen(true)}
                />
                <>
                    <p className="text-sm cursor-pointer-none w-10 gap-1 flex absolute right-3">
                        <kbd className="flex h-6 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[12px] font-medium text-muted-foreground opacity-100">
                            <span className="text-sm">⌘</span><span>+</span> J
                        </kbd>
                    </p>
                    <CommandDialog open={commandOpen} onOpenChange={(open) => setCommandOpen(open)}>
                        <CommandInput placeholder="Type a command or search..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                <CommandItem>
                                    <Calendar />
                                    <span>Calendar</span>
                                </CommandItem>
                                <CommandItem>
                                    <Smile />
                                    <span>Search Emoji</span>
                                </CommandItem>
                                <CommandItem>
                                    <Calculator />
                                    <span>Calculator</span>
                                </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Settings">
                                <CommandItem>
                                    <User />
                                    <span>Profile</span>
                                    <CommandShortcut>⌘P</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <CreditCard />
                                    <span>Billing</span>
                                    <CommandShortcut>⌘B</CommandShortcut>
                                </CommandItem>
                                <CommandItem>
                                    <Settings />
                                    <span>Settings</span>
                                    <CommandShortcut>⌘S</CommandShortcut>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </CommandDialog>
                </>
            </div>
        </div>
    )
}