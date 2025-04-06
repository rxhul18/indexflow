"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {  Mails, Users } from "lucide-react";
import Image from "next/image";
import type { ServerType } from "@iflow/types";
import { Button } from "@/components/ui/button";

export default function CommunityGrid({
    filteredServers = [],
}: {
    filteredServers?: ServerType[];
}) {    

    const renderLogo = (server: ServerType, size = 56) => (
        server.logo ? (
            <Image
                src={server.logo}
                alt={server.name || "Server"}
                width={size}
                height={size}
                className="object-cover w-full h-full rounded-full"
            />
        ) : (
            <div className="flex items-center justify-center w-full h-full text-lg font-semibold bg-secondary">
                {server.name?.[0] || "S"}
            </div>
        )
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
                                <div className="relative flex-shrink-0 w-14 h-14 rounded-full bg-secondary border overflow-hidden">
                                    {renderLogo(server)}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex flex-col lg:flex-row justify-between md:items-center mb-2">
                                        <div className="flex items-center">
                                            <span className="font-medium text-primary truncate text-base">
                                                {server.name}
                                            </span>
                                            {/* {server.is_config && ( */}
                                            <Badge variant="secondary" className="text-xs ml-3 h-5">
                                                Configured
                                            </Badge>
                                        </div>
                                        <Button className="w-full lg:w-auto mt-2 md:mt-0" onClick={() => {
                                            if (server.invite_url) {
                                                window.open(server.invite_url);
                                            }
                                        }}>
                                            Join community
                                        </Button>
                                    </div>

                                    <div className="flex flex-col lg:flex-row">
                                        {server.invite_url && (
                                            <div className="flex items-center text-muted-foreground text-sm gap-1 md:mr-3">
                                                <Mails className="size-4 text-primary" />
                                                <span>100 posts</span>
                                            </div>
                                        )}
                                        <div className="flex items-center text-muted-foreground text-sm gap-1">
                                            <Users className="size-4 text-primary" />
                                            <span>Owner ID: {server.owner_id}</span>
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground text-sm mt-2">
                                        This server is a community for the server. It is a place where you can find other people who are interested in the server.
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
                    <p className="text-muted-foreground text-sm">Try adjusting your search or filter criteria</p>
                </div>
            )}
        </div>
    );
} 