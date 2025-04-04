/* eslint-disable @next/next/no-img-element */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "./ui/badge"
import { Gem } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

export default function PremiumOnlyBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <Badge variant={"secondary"}><Gem /> Premium Only</Badge>
        </TooltipTrigger>
        <TooltipContent className="py-3 flex bg-muted/95 w-[500px] h-full items-center justify-center z-[5000]">
          <div className="space-y-2">
            <img
              className="w-auto rounded"
              src="/sai-bg.png"
              width={382}
              height={216}
              alt="Content image"
            />
            <div className="space-y-1">
              <p className="text-[13px] font-medium dark:text-white text-black">
                This is a Premium Only feature you can&apos;t make changes
              </p>
              <p className="text-muted-foreground text-xs">
                Unlock Premium features by becoming an iFlow Supporter through purchase, or get them FREE when you UP-VOTE us on Top.gg! Thanks.
              </p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <Link href={"/support"}>
              <Button size={"sm"}>
              <Gem /> Get Premium for Free
              </Button>
              </Link>
            </div>
          </div>
        </TooltipContent>
        
      </Tooltip>
    </TooltipProvider>
  )
}
