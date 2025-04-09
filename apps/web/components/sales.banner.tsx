"use client";

import { useEffect, useState } from "react";
import { TicketPercent, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { useUser } from "@/context/user.context";

const getCurrentSaleEndDate = () => {
  const startDate = new Date("2025-04-10T00:00:00Z");
  const now = new Date();
  const msIn15Days = 15 * 24 * 60 * 60 * 1000;

  let periodStart = new Date(startDate.getTime());
  while (periodStart.getTime() + msIn15Days <= now.getTime()) {
    periodStart = new Date(periodStart.getTime() + msIn15Days);
  }

  return new Date(periodStart.getTime() + msIn15Days);
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export default function SalesBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { user, loading } = useUser();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const handleClick = () => {
    const end = Date.now() + 0.25 * 1000; // 0.25 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();

    setTimeout(async () => {
      window.location.href = "/support";
    }, 1000);
  };

  useEffect(() => {
    let saleEndDate = getCurrentSaleEndDate();
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = saleEndDate.getTime() - now.getTime();

      if (difference <= 0) {
        saleEndDate = getCurrentSaleEndDate();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    // Calculate immediately and then every second
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible || timeLeft.isExpired || loading || !user) return null;

  return (
    <div className="dark bg-muted dark:bg-muted/80 text-foreground px-4 py-3 mt-0.25">
      <div className="flex gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center">
          <div
            className="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5"
            aria-hidden="true"
          >
            <TicketPercent className="opacity-80" size={16} />
          </div>
          <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-primary">
                Launch Day Mega Sale is Live!
              </p>
              <p className="text-muted-foreground text-sm">
                We&apos;re celebrating with a bang! For the next 15 days only,
                get{" "}
                <span className="font-medium text-foreground">
                  1 Month of Premium—100% FREE!
                </span>{" "}
                No strings attached. Don’t miss out!
              </p>
            </div>
            <div className="flex gap-3 max-md:flex-wrap">
              <div className="divide-primary-foreground bg-primary/15 flex items-center divide-x rounded-md text-sm tabular-nums">
                {timeLeft.days > 0 && (
                  <span className="flex h-8 items-center justify-center p-2">
                    {timeLeft.days}
                    <span className="text-muted-foreground">d</span>
                  </span>
                )}
                <span className="flex h-8 items-center justify-center p-2">
                  {timeLeft.hours.toString().padStart(2, "0")}
                  <span className="text-muted-foreground">h</span>
                </span>
                <span className="flex h-8 items-center justify-center p-2">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                  <span className="text-muted-foreground">m</span>
                </span>
                <span className="flex h-8 items-center justify-center p-2">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                  <span className="text-muted-foreground">s</span>
                </span>
              </div>
              <Button size={"sm"} onClick={handleClick}>
                Claim Now 🎉
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => setIsVisible(false)}
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
