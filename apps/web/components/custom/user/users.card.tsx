"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Gem, Globe, MapPin, Star } from "lucide-react";
import type { UserType } from "@iflow/types";
import { useState, useEffect, useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { Icons } from "@/components/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useTagsStore } from "@/lib/zustand";
// import { authClient } from "@iflow/auth";

export default function UserCards({
  filteredUsers = [],
}: {
  filteredUsers?: UserType[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get("username") ?? "";
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [isDiscordLinked, setIsDiscordLinked] = useState(false);
  // const [isGoogleLinked, setIsGoogleLinked] = useState(false);
  // const [isGithubLinked, setIsGithubLinked] = useState(false);

  const {tags} = useTagsStore();

  const normalizedUsername = useMemo(
    () => usernameParam.toLowerCase().replace(/\s+/g, ""),
    [usernameParam]
  );

  useEffect(() => {
    if (!normalizedUsername) return;

    const matchedUser = filteredUsers.find(
      (u) =>
        u.name?.toLowerCase().replace(/\s+/g, "") === normalizedUsername
    );

    if (matchedUser) {
      setSelectedUser(matchedUser);
      setIsDialogOpen(true);
    } else {
      setSelectedUser(null);
      setIsDialogOpen(false);
    }
  }, [normalizedUsername, filteredUsers]);

  // useEffect(() => {
  //   (async () => {
  //     const accounts = await authClient.listAccounts();
  //     console.log("Linked Accs:", accounts);
  //     if ("data" in accounts) {
  //       const hasDiscord = accounts.data?.some(
  //         (acc) => acc.provider === "discord"
  //       );
  //       const hasGoogle = accounts.data?.some(
  //         (acc) => acc.provider === "google"
  //       );
  //       const hasGitHub = accounts.data?.some(
  //         (acc) => acc.provider === "github"
  //       );
  //       setIsDiscordLinked(!hasDiscord);
  //       setIsGoogleLinked(!hasGoogle);
  //       setIsGithubLinked(!hasGitHub);
  //     }
  //   })();
  // }, []);

  const handleUserClick = (user: UserType) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
    router.push(`?username=${user.name?.toLowerCase().replace(/\s+/g, "")}`);
  };

  const handleDialogClose = () => {
    setSelectedUser(null);
    setIsDialogOpen(false);
    router.push("?");
  };

  const renderAvatar = (user: UserType, size = 56) => (
    user.image ? (
      <Image
        src={user.image}
        alt={user.name || "User"}
        width={size}
        height={size}
        className="object-cover w-full h-full rounded-md"
      />
    ) : (
      <div className="flex items-center justify-center w-full h-full text-lg font-semibold">
        {user.name?.[0] || "U"}
      </div>
    )
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="overflow-hidden transition-all duration-200 hover:shadow-md group py-1 cursor-pointer"
              onClick={() => handleUserClick(user)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0 w-14 h-14 overflow-hidden">
                    {renderAvatar(user)}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-medium text-primary truncate text-base"
                      >
                        {user.name}
                      </span>
                      {user.reputation?.length !== 0 && (
                        <div className="flex items-center text-amber-500 gap-0.5 ml-1">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-xs font-medium">{user.reputation || "00"}</span>
                        </div>
                      )}
                    </div>

                    {user.username && (
                      <div className="flex items-center text-muted-foreground text-sm mt-1 gap-1">
                        {/* <MapPin className="h-3 w-3" /> */}
                        <span className="truncate">@{user.username || "anon69"}</span>
                      </div>
                    )}

                    {user.recentTags && user.recentTags.length > 0 && (
                      <div className=" mt-4">
                        {/* <h3 className="text-sm font-medium mb-2">Interests</h3> */}
                        <div className="flex w-full flex-wrap gap-2">
                          {user.recentTags.map((tagId, idx) => {
                            const tag = tags.find(t => t.id === tagId);
                            return tag ? (
                              <Badge key={idx} variant="secondary">{tag.name}</Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-medium mb-1">No users found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="p-0 overflow-hidden md:min-w-xl max-w-[95%] rounded-lg">
          {selectedUser && (
            <div className="flex flex-col">
              <div className="relative h-36 bg-gradient-to-r from-blue-400 to-blue-600">
                <div className="absolute -bottom-12 left-4 h-24 w-24 rounded-full border-4 border-background overflow-hidden bg-white">
                  {renderAvatar(selectedUser, 96)}
                </div>
              </div>

              <div className="pt-16 px-4 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                    <p className="text-muted-foreground text-sm">@{selectedUser.username || "anon69"}</p>
                  </div>
                  {/* <button className="border text-sm rounded-full px-4 py-1 font-medium hover:bg-accent transition">Message</button> */}
                  <Badge variant="outline" className="gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="cursor-pointer">
                            <Gem className="text-blue-400 size-4" />
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">Premium Account</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="cursor-pointer">
                            <div className="flex">
                              <Star className="h-4 w-4 text-amber-500 fill-current" />
                              <span className="text-xs font-medium ml-1 text-amber-500">
                                {selectedUser.reputation ?? "00"}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">
                            Got {selectedUser.reputation ?? "00"} Reputations
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Badge>
                </div>

                {selectedUser.bio && (
                  <p className="mt-2 text-sm">{selectedUser.bio}</p>
                )}

                <div className="flex gap-4 text-sm text-muted-foreground mt-3 flex-wrap">
                  {selectedUser.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedUser.location || "Mars"}</span>
                    </div>
                  )}
                  {selectedUser.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <a
                        href={`https://${selectedUser.website}`}
                        className="hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedUser.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>
                {selectedUser.recentTags && selectedUser.recentTags.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Interested Topics</h3>
                        <div className="flex w-full flex-wrap gap-2">
                          {selectedUser.recentTags.map((tagId, idx) => {
                            const tag = tags.find(t => t.id === tagId);
                            return tag ? (
                              <Badge key={idx} variant="secondary">{tag.name}</Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                {/* <div className="mt-4">
                  <h3 className="mb-2 font-semibold text-sm">Connected Accounts</h3>
                  <div className="flex flex-wrap gap-2">
                    {isDiscordLinked && <Badge className="bg-[#5865F2] text-white"><Icons.discord className="mr-0.5" />Discord</Badge>}
                    {isGoogleLinked && <Badge className="bg-[#DB4437] text-white"><Icons.google className="mr-0.5" />Google</Badge>}
                    {isGithubLinked && <Badge className="bg-[#333] text-white"><Icons.gitHub className="mr-0.5" />GitHub</Badge>}
                  </div>
                </div> */}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
