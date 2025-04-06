"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useUser } from "@/context/user.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, Sun, Moon } from "lucide-react";

import { SignInBtn } from "./sign-up.btn";
import Logo from "../logo";
import SearchInputCommand from "./search.comp";
// import NotificationsComp from "@/components/notify";
import ProfileBtn from "../user/profile.btn";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/90 flex justify-center">
      <div className="min-w-[90%] md:container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-10">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/users"
              className="font-medium transition-colors hover:text-primary"
            >
              Users
            </Link>
            <Link
              href="/support"
              className="font-medium transition-colors hover:text-primary"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3 flex-1 px-2 pl-6">
          <SearchInputCommand />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            {!loading && user ? (
              <ProfileBtn userId={user.id} pfp={user.image || ""} name={user.name || "Guest"} username={user.username || ""} bio={user.bio || ""} website={user.website || ""} tags={ user.recentTags || []} />
            ) : (
              <SignInBtn />
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <div className="relative">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
              <Moon className="absolute top-0 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </div>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-500 flex h-[calc(100vh-4rem)] w-full flex-col justify-between bg-background p-6 md:hidden">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10"
              />
            </div>
            <nav className="flex flex-col gap-6 text-base">
              <Link
                href="/"
                className="font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/users"
                className="font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Users
              </Link>
              <Link
                href="/about"
                className="font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </nav>
            <div className="flex flex-col gap-2">
              {!loading && user ? (
                <ProfileBtn userId={user.id} pfp={user.image || ""} name={user.name || "Guest"} username={user.username || ""} bio={user.bio || ""} website={user.website || ""} tags={ user.recentTags || []} />
              ) : (
                <SignInBtn />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
