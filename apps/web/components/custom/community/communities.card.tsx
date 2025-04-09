"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Barcode, FileQuestion, Users } from "lucide-react";
import Image from "next/image";
import type { ServerType } from "@iflow/types";
import { JoinCommunityBtn } from "../join.community.btn";
import { useQuestionsStore } from "@/lib/zustand";

export default function CommunityGrid({
  filteredServers = [],
}: {
  filteredServers?: ServerType[];
}) {
  const { questions } = useQuestionsStore();
  const serverQuestions = filteredServers.length > 0 
    ? questions.filter(
        (question) => question.server_id === filteredServers[0].id
      )
    : [];
  const renderLogo = (server: ServerType, size = 56) =>
    server.logo ? (
      <Image
        src={server.logo}
        alt={server.name || "Server"}
        width={size}
        height={size}
        className="object-cover w-full h-full rounded-md"
      />
    ) : (
      <div className="flex items-center justify-center w-full h-full text-lg font-semibold bg-secondary">
        {server.name?.[0] || "S"}
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
      {filteredServers.length > 0 ? (
        filteredServers.map((server) => (
          <Card
            key={server.id}
            className="overflow-hidden transition-all duration-200 hover:shadow-md group py-1 cursor-pointer"
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0 w-14 h-14 border rounded-md overflow-hidden">
                  {renderLogo(server)}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex flex-col lg:flex-row justify-between md:items-center mb-2">
                    <div className="flex items-center">
                      <span className="font-medium text-primary truncate text-base">
                        {server.name}
                      </span>
                      {/* <Badge variant="secondary" className="text-xs ml-3 h-5">
                                                Configured
                                            </Badge> */}
                    </div>
                    <JoinCommunityBtn
                      name="Join comunity"
                      InvUrl={server.invite_url!}
                    />
                  </div>

                  <div className="flex flex-col lg:flex-row">
                    <div className="flex items-center text-muted-foreground text-sm gap-1 md:mr-3">
                      <Users className="size-4 text-primary" />
                      <span>Guild Members: {server.members}+</span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm gap-1 md:mr-3">
                        <FileQuestion className="size-4 text-primary" />
                        <span>Guild Posts: {
                          questions.filter(q => q.server_id === server.id).length
                        }+</span>
                      </div>
                    <div className="flex items-center text-muted-foreground text-sm gap-1">
                      <Barcode className="size-4 text-primary" />
                      <span>Guild ID: {server.id}</span>
                    </div>
                  </div>

                  <p className="text-sm mt-2">
                    This server is a community for the server. It is a place
                    where you can find other people who are interested in the
                    server.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium mb-1">No communities found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
