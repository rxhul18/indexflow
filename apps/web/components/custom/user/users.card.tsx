"use client";

import Link from "next/link";
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
import { Icons } from "@/components/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

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
        className="object-cover w-full h-full rounded-full"
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
                  <div className="relative flex-shrink-0 w-14 h-14 rounded-full bg-secondary border overflow-hidden">
                    {renderAvatar(user)}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-medium text-primary truncate text-base"
                      >
                        {user.name}
                      </span>
                      {user.reputation != null && (
                        <div className="flex items-center text-amber-500 gap-0.5 ml-1">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-xs font-medium">{user.reputation}</span>
                        </div>
                      )}
                    </div>

                    {user.location && (
                      <div className="flex items-center text-muted-foreground text-xs mt-1 gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{user.location}</span>
                      </div>
                    )}

                    {user.recentTags && user.recentTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {user.recentTags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="px-1.5 py-0 text-xs font-normal hover:bg-secondary/80"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link href="#" className="hover:underline">{tag}</Link>
                          </Badge>
                        ))}
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
        <DialogContent className="p-0 overflow-hidden md:min-w-md max-w-[95%]">
          {selectedUser && (
            <>
              <div className="relative">
                <div className="w-full h-32 bg-gradient-to-r from-pink-500 to-purple-500" />
                <div className="absolute -bottom-10 left-4">
                  <div className="h-20 w-20 rounded-full border-4 border-background overflow-hidden">
                    {renderAvatar(selectedUser, 80)}
                  </div>
                </div>
              </div>

              <div className="pt-8 px-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                    <Badge variant="outline">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Gem className="text-blue-400 size-4" />
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">Premium Account</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex">
                              <Star className="h-4 w-4 text-amber-500 fill-current" />
                              <span className="text-xs font-medium ml-1 text-amber-500">
                                {selectedUser.reputation ?? "00"}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">
                            Got {selectedUser.reputation ?? "00"} Reputation
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col mt-2">
                  <p className="text-muted-foreground">
                    @{selectedUser.name?.toLowerCase().replace(/\s+/g, "")}
                  </p>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{selectedUser.location ?? "Unknown location"}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                    <a href="#" className="text-muted-foreground hover:text-primary hover:underline">
                      {selectedUser.name?.toLowerCase().replace(/\s+/g, "")}.dev
                    </a>
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-muted-foreground text-sm">
                    {selectedUser.bio || "This user has not added a bio yet."}
                  </p>
                </div>

                {selectedUser.recentTags && selectedUser.recentTags.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Recent Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.recentTags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Connected Accounts</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-[#5865F2] text-white"><Icons.discord className="mr-0.5" />Discord</Badge>
                    <Badge className="bg-[#DB4437] text-white"><Icons.google className="mr-0.5" />Google</Badge>
                    <Badge className="bg-[#333] text-white"><Icons.gitHub className="mr-0.5" />GitHub</Badge>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
