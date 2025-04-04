import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusIcon } from "lucide-react";
import { Icons } from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function ConnectedServers() {
  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="3">
      {/* {items.map((item) => ( */}
      <AccordionItem value={"1"} key={"1"} className="py-2">
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger className="focus-visible:border-ring cursor-pointer focus-visible:ring-ring/50 flex flex-1 items-center justify-between rounded-md py-2 text-left text-[15px] leading-6 font-semibold transition-all outline-none focus-visible:ring-[3px] [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0">
            <span className="flex items-center gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <Icons.discord />
              </span>
              <span className="flex flex-col space-y-1">
                <span>Discord Servers</span>
                <span className="text-sm font-normal">
                  View your all connected Discord Servers.
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
          {/* {item.content} */}
          <Button size={"lg"}>
            <Icons.discord />
            Link Discord Server
          </Button>
        </AccordionContent>
      </AccordionItem>
      {/* ))} */}
    </Accordion>
  );
}
