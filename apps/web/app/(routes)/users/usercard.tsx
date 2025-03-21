"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";
import { UserType } from "@iflow/types";

export default function UserGrid({ filteredUsers }: { filteredUsers?: UserType[] | undefined }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredUsers?.length ? (
        filteredUsers.map((user) => (
          <Card
            key={user.id}
            className="overflow-hidden transition-all duration-200 hover:shadow-md group py-1"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-full bg-pink-600 border overflow-hidden`}
                  >
                    {user.image ? (
                      <Image
                        src={user.image || "/placeholder.svg"}
                        alt={user.name}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full rounded-full transition-transform group-hover:scale-105"
                      />
                    ) : user.name ? (
                      <div className="flex items-center justify-center w-full h-full">
                        {user.name}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-lg font-semibold">
                        {user.name.charAt(0)}
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
                    >
                      {user.name}
                    </Link>

                    {/* Reputation */}
                    {user.reputation !== null && <div className="flex items-center text-amber-500 gap-0.5 ml-1">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-medium">
                        {user.reputation}
                      </span>
                    </div>}
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
          <p className="text-muted-foreground text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
