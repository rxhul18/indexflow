import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Ghost, MapPinned, PlusIcon, Settings } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import AnonProfileComp from "./anon.profile";
import PremiumOnlyBadge from "@/components/premium.badge";
import { Button } from "@/components/ui/button";

export default function AdvanceSettings({
  isDisabled,
}: {
  isDisabled: boolean;
}) {
  return (
    <Accordion type="single" className="w-full" defaultValue="1">
      <AccordionItem value={"1"} key={"1"} className="py-2">
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger className="focus-visible:border-ring cursor-pointer focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
            <span className="flex items-center gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <Settings />
              </span>
              <span className="flex flex-col space-y-1">
                <span>Advance Settings</span> <PremiumOnlyBadge />
                <span className="text-sm font-normal">
                  Access advanced settings of your account.
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
        <AccordionContent className="text-muted-foreground ms-3 ps-10 pb-2 space-y-2 mt-2">
          <div className="*:not-first:mt-2">
            <Label htmlFor={"anon"}>Anonymous Profile</Label>
            <Button size={"sm"} disabled={isDisabled}>
              <Ghost /> Create Anon Profile
            </Button>
            <AnonProfileComp isDisabled={isDisabled} />
            <Label htmlFor={"anon-name"}>Anon Identifier</Label>
            <div className="flex rounded-md shadow-xs">
              <Input
                id={"anon-name"}
                className="-me-px rounded-e-none shadow-none"
                placeholder="google"
                type="text"
                disabled={isDisabled}
              />
              <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-e-md border px-3 text-sm">
                .iflow
              </span>
            </div>
          </div>
          <Separator />
          <div className="*:not-first:mt-2">
            <Label htmlFor={"ip"}>IP Address</Label>
            <Input
              id={"ip"}
              className="bg-muted border-transparent shadow-none"
              placeholder="0.0.0.0"
              type="text"
              readOnly
            />
          </div>
          <div className="*:not-first:mt-2">
            <Label id="location">Geo Location</Label>
            <div className="relative">
              <Input
                className="peer ps-9"
                placeholder="India"
                type="text"
                disabled={isDisabled}
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <MapPinned size={16} aria-hidden="true" />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
