import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Link2Icon, PlusIcon } from "lucide-react";
import { Icons } from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { authClient } from "@iflow/auth";

export default function ConnectedAcount() {
  const [isDiscordLinked, setIsDiscordLinked] = useState(false);
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);
  const [isGithubLinked, setIsGithubLinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [is1Acc, setIs1Acc]  = useState(false);

  const CALLBACK_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://indexflow.site";

  const handleAccountLinking = async (type: "discord" | "google" | "github") => {
    await authClient.linkSocial({
      provider: type,
      callbackURL: CALLBACK_URL
  });
  }

  const handleAccountUnLinking = async (type: "discord" | "google" | "github") => {
    const accounts = await authClient.listAccounts();
    const accountId = accounts.data?.find((acc) => acc.provider === type)?.id;
    if (!accountId) {
      console.error(`No account found for provider: ${type}`);
      return;
    }
    await authClient.unlinkAccount({
      providerId: type,
      accountId,
    });
  }

  useEffect(() => {
    (async () => {
      const accounts = await authClient.listAccounts();
      console.log("Linked Accs:", accounts);
      if ("data" in accounts) {
        const hasDiscord = accounts.data?.some(
          (acc) => acc.provider === "discord"
        );
        const hasGoogle = accounts.data?.some(
          (acc) => acc.provider === "google"
        );
        const hasGitHub = accounts.data?.some(
          (acc) => acc.provider === "github"
        );
        setIsDiscordLinked(!!hasDiscord);
        setIsGoogleLinked(!!hasGoogle);
        setIsGithubLinked(!!hasGitHub);

        const linkedCount = [hasDiscord, hasGoogle, hasGitHub].filter(Boolean).length;
        setIs1Acc(linkedCount <= 1);
        setLoading(false);
        
      }
    })();
  }, []);
  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="3">
      <AccordionItem value={"1"} key={"1"} className="py-2">
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger className="focus-visible:border-ring cursor-pointer focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
            <span className="flex items-center gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <Link2Icon />
              </span>
              <span className="flex flex-col space-y-1">
                <span>Connected Accounts</span>
                <span className="text-sm font-normal">
                  Manage all yours social connected accounts. You can also use
                  one of them to login to your iFlow account.
                </span>
              </span>
            </span>
            <PlusIcon
              size={16}
              className="pointer-events-none shrink-0 opacity-60 transition-transform duration-200"
              aria-hidden="true"
            />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
        <AccordionContent className="text-muted-foreground ms-3 ps-10 pb-2 mt-2">
          {loading ? "Loading..." : (
            <div className="flex flex-col gap-2">
            {isDiscordLinked ? <Button
              size={"lg"}
              variant={"secondary"}
              className="bg-[#1877f2] w-full hover:bg-[#1877f2]/90"
              disabled={is1Acc}
              onClick={(e) => {
                e.preventDefault();
                handleAccountUnLinking("discord")}}
            >
              <Icons.discord />
              Disconnect Discord Account
            </Button> : <Button
              size={"lg"}
              variant={"outline"}
              className="w-full"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                handleAccountLinking("discord")}}
            >
              <Icons.discord />
              Connect Discord Account
            </Button>}
  
            {isGithubLinked ? <Button size={"lg"} variant={"secondary"}
              disabled={is1Acc} onClick={(e) => {
                e.preventDefault();
                handleAccountUnLinking("github")}}>
              <Icons.gitHub />
              Disconnect GitHub Account
            </Button> : <Button size={"lg"} variant={"outline"}
              className="w-full"
              disabled={loading} onClick={(e) => {
                e.preventDefault();
                handleAccountLinking("github");
              }}>
              <Icons.gitHub />
              Connect GitHub Account
            </Button>}
            
            {isGoogleLinked ? <Button
              size={"lg"}
              variant={"secondary"}
              className="bg-[#DB4437] w-full hover:bg-[#DB4437]/90"
              disabled={is1Acc}
              onClick={(e) => {
                e.preventDefault();
                handleAccountUnLinking("google")}}
            >
              <Icons.google />
              Disconnect Google Account
            </Button> : <Button
              size={"lg"}
              variant={"outline"}
              className="w-full"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                handleAccountLinking("google")}}
            >
              <Icons.google />
              Connect Google Account
            </Button>}
          </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
