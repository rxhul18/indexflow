"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Gem, Globe, MapPin, Star } from "lucide-react"
import type { UserType } from "@iflow/types"
import { useState, useEffect } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"
import { useRouter, useSearchParams } from "next/navigation"

export default function UserGrid({
  filteredUsers,
}: {
  filteredUsers?: UserType[] | undefined
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const username = searchParams.get("username")
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Handle URL-based dialog opening
  useEffect(() => {
    if (username && filteredUsers) {
      const user = filteredUsers.find(u => u.name.toLowerCase().replace(/\s+/g, "") === username)
      if (user) {
        setSelectedUser(user)
        setIsDialogOpen(true)
      }
    }
  }, [username, filteredUsers])

  const handleUserClick = (user: UserType) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
    // Update URL with username
    router.push(`?username=${user.name.toLowerCase().replace(/\s+/g, "")}`)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    router.push("?")
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUsers?.length ? (
          filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="overflow-hidden transition-all duration-200 hover:shadow-md group py-1 cursor-pointer"
              onClick={() => handleUserClick(user)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-14 h-14 flex items-center justify-center rounded-full bg-secondary border overflow-hidden`}
                    >
                      {user.image ? (
                        <Image
                          src={user.image || "/placeholder.svg"}
                          alt={user.name || "User Image"}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full rounded-full transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-lg font-semibold">
                          {user.name ? user.name.charAt(0) : "U"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User info */}
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <Link
                        href="#"
                        className="font-medium text-primary hover:underline truncate text-base"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {user.name}
                      </Link>

                      {/* Reputation */}
                      {user.reputation !== null && (
                        <div className="flex items-center text-amber-500 gap-0.5 ml-1">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span className="text-xs font-medium">{user.reputation}</span>
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    {user.location && (
                      <div className="flex items-center text-muted-foreground text-xs mt-1 gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{user.location}</span>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {user?.recentTags?.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-1.5 py-0 text-xs font-normal hover:bg-secondary/80 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link href="#" className="hover:underline">
                            {tag}
                          </Link>
                        </Badge>
                      ))}
                    </div>
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

      {/* User Detail Popup */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="p-0 overflow-hidden md:min-w-md max-w-[95%]">
          {selectedUser && (
            <>
              <div className="relative">
                {/* Banner Image - using a placeholder for now */}
                <div className="w-full h-32 bg-cover bg-center bg-gradient-to-r from-pink-500 to-purple-500" />

                {/* Profile Image */}
                <div className="absolute -bottom-10 left-4">
                  <div className="h-20 w-20 rounded-full border-4 border-background overflow-hidden">
                    {selectedUser.image ? (
                      <Image
                        src={selectedUser.image || "/placeholder.svg"}
                        alt={selectedUser.name || "User Image"}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-pink-600 text-white text-xl font-semibold">
                        {selectedUser.name ? selectedUser.name.charAt(0) : "U"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="pt-8 px-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                    <Badge variant="outline">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Gem className="text-blue-400 mr-0.5 size-4 border-none" />
                          </TooltipTrigger>
                          <TooltipContent className="dark px-2 py-1 text-xs">
                            Premium Acount
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex">
                            <Star className="h-4 w-4 text-amber-500 fill-current" />
                            <span className="text-xs font-medium ml-1 text-amber-500">04</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="dark px-2 py-1 text-xs">
                            Got 04 Reputions
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Badge>
                  </div>
                  <div className="flex items-center">
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="text-muted-foreground">@{selectedUser.name.toLowerCase().replace(/\s+/g, "")}</p>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Mumbai, India</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                    <a href="#" className="text-muted-foreground hover:text-primary hover:underline">
                      {selectedUser.name.toLowerCase().replace(/\s+/g, "")}.dev
                    </a>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-2">
                  <p className="text-muted-foreground text-sm">
                    {/* {selectedUser.bio || "No bio available."} */}
                    Hi i m Rahul Shah, a passionate software engineer with a knack for creating innovative solutions. I love coding and exploring new technologies.
                  </p>
                </div>
                {/* Tags */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Recent Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">typescript</Badge>
                    <Badge variant="secondary">react</Badge>
                    <Badge variant="secondary">nextjs</Badge>
                    <Badge variant="secondary">tailwindcss</Badge>
                    <Badge variant="secondary">javascript</Badge>
                  </div>
                </div>

                {/* Connected Aount */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Connected Accounts</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-[#5865F2] text-white"><Icons.discord className="mr-0.5"/>Discord</Badge>
                    <Badge className="bg-[#DB4437] text-white"> <Icons.google className="mr-0.5"/>Google</Badge>
                    <Badge className="bg-[#333] text-white"><Icons.gitHub className="mr-0.5"/>Github</Badge>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
