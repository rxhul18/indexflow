/* eslint-disable @next/next/no-img-element */
"use client";
import { Spinner } from "@/components/custom/spinner";
import { LoginCards } from "@/components/login-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useUser } from "@/context/user.context";
import { authClient } from "@iflow/auth";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function BotInvitePage() {
  const { loading, user } = useUser();
  const [effLoading, setEffLoading] = useState(false);
  const [isDiscordLinked, setIsDiscordLinked] = useState(false);
  const CALLBACK_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/invite"
      : "https://indexflow.site/invite";

  const handleSocialLink = async () => {
    await authClient.linkSocial({
      provider: "discord",
      callbackURL: CALLBACK_URL,
      
  });
  }

  useEffect(() => {
    if (user && isDiscordLinked && !effLoading) {
      const invlink = "https://discord.com/api/oauth2/authorize?client_id=1346709873412407319&permissions=8&scope=bot%20applications.commands";
      window.location.replace(invlink);
    }
  }, [user, isDiscordLinked, effLoading]);
  
  useEffect(() => {
    if (user && !loading) {
      setEffLoading(true);
      const getAccs = async () => {
        const accounts = await authClient.listAccounts();
        console.log("Linked Accs:", accounts)
        if ("data" in accounts) {
          const hasDiscord = accounts.data?.some(acc => acc.provider === "discord");
          if(hasDiscord) {
            setIsDiscordLinked(!isDiscordLinked);
          }
          setEffLoading(false);
        } else {
          setEffLoading(false);
          console.error("Error fetching accounts");
        }
      };
      getAccs();
    }
  }, [user, loading]);

  if ((loading && !user) || effLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <Spinner size="lg" />
      </div>
    );
  };

  if(user && !isDiscordLinked && !effLoading) {
    return (
      <BlurFade delay={0.5}>
      <div className="flex items-center justify-center h-screen w-screen relative">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Link your Discord Account</CardTitle>
          <CardDescription>
          To continue, please connect your Discord account.
          </CardDescription>
        </CardHeader>
        <CardContent>
        <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button 
                type="button"
                variant="outline" 
                className="bg-[#1877f2] w-full hover:bg-[#1877f2]/90" 
                onClick={(e) => {
                  e.preventDefault();
                  handleSocialLink();
                }}
              >
                <Icons.discord/>
                Link Discord Account
              </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t worry your data will be encrypted & safe with us.
            </div>
          </div>
          </div>
        </CardContent>
      </Card>
      </div>
      </BlurFade>
    )
  }


  return (
    <BlurFade delay={0.5}>
      <div className="flex items-center justify-center h-screen w-screen relative">
        <div className="absolute inset-0 z-0">
          <img
            src="/img/sparkels.png"
            alt="Sparkles background"
            className="object-cover"
            draggable
          />
        </div>
        <div className="flex items-center z-10">
          <img 
            src="/img/wumpus.png" 
            alt="Discord Wumpus action figure" 
            className="h-[95vh] object-contain"
            draggable
          />
          <LoginCards />
        </div>
      </div>
    </BlurFade>
  );
}