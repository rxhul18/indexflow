"use client";

import { useState } from "react";
import { RocketIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import OnboardingComp from "./onboarding";
import { useUser } from "@/context/user.context";
import useLocalStorage from "@/hooks/use-local";

export default function OnboardingBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { user, loading } = useUser();
  const [hidden, setHidden] = useLocalStorage("hideOnboardingBanner", false);

  if (!isVisible || loading || (user && hidden)) return null;

  return (
    <div className="dark bg-muted dark:bg-muted/80 text-foreground px-4 py-3">
      <div className="flex gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center">
          <div
            className="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5"
            aria-hidden="true"
          >
            <RocketIcon className="opacity-80" size={16} />
          </div>
          <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                What the F*** is this IndexFlow?
              </p>
              <p className="text-muted-foreground text-sm">
                Don&apos;t know how to use IndexFLow and convert your threads
                into webpages and index them on google? No worries click on Get
                Started.
              </p>
            </div>
            <div className="flex gap-2 max-md:flex-wrap">
              <OnboardingComp />
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => {
            setIsVisible(false);
            setHidden(true);
          }}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}
