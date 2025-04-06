"use client";
import React, { useEffect } from "react";
import { CheckIcon, Gem, RefreshCcwIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import { SignInBtn } from "@/components/custom/navbar/sign-up.btn";
import { useUser } from "@/context/user.context";

export default function PricingPage() {
  const { user, loading } = useUser();
  const id = "price";
  useEffect(() => {
    PolarEmbedCheckout.init();
  }, []);
  return (
    <div className="flex flex-col w-full items-center justify-center overflow-hidden py-10">
      <h1 className="text-3xl md:text-4xl font-bold my-6">
        “Want to support us?”
      </h1>
      <p className="text-muted-foreground mb-10 text-center max-w-xl">
        You can help by voting every 12 hours or by subscribing to a monthly
        plan. In return we will give you access to all Premium features.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 min-w-[90%] md:container w-full px-4">
        <div className="w-md max-w-[95%] border rounded-md p-4">
          <div className="mb-2 flex flex-col gap-2">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <RefreshCcwIcon className="opacity-80" size={20} />
            </div>
            <div>
              <h1 className="text-left text-2xl font-semibold">iFlow Votter</h1>
              <h3 className="text-left text-muted-foreground">
                Support us by voting on Top.gg for 12 hours
              </h3>
            </div>
          </div>

          <form className="space-y-5">
            <RadioGroup className="gap-2" defaultValue="1">
              {/* Radio card #1 */}
              <div className="border-input has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border px-4 py-2 shadow-xs outline-none">
                <RadioGroupItem
                  value="1"
                  id={`${id}-1`}
                  aria-describedby={`${id}-1-description`}
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="grid grow gap-1">
                  <Label htmlFor={`${id}-1`} className="font-bold text-lg">
                    Vote for free
                  </Label>
                  <p
                    id={`${id}-1-description`}
                    className="text-muted-foreground text-xs"
                  >
                    Every 12 Hours
                  </p>
                </div>
              </div>
            </RadioGroup>

            <div className="space-y-3">
              <p>
                <strong className="text-sm font-medium">
                  Features include:
                </strong>
              </p>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Enable anonymous indexing.
                </li>
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Enable anonymous profile.
                </li>
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Index unlimited threads.
                </li>
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Unlimited voting limits on post.
                </li>
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Get your server&apos;s API endpoint.
                </li>
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Advanced permissions.
                </li>
              </ul>
              <p className="inline-flex gap-1 bg-muted py-1 px-2 rounded-md">
                <span className="text-xs hover:underline text-muted-foreground">
                  Valid till your vote&apos;s validity (12 hours) then you need
                  to vote again to get access.
                </span>
              </p>
            </div>

            <div className="grid gap-2">
              {!loading && user ? (
                <Link
                  href="https://top.gg/bot/1346709873412407319/vote"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button type="button" className="w-full">
                    Get for a Free Vote
                  </Button>
                </Link>
              ) : (
                <SignInBtn name="Get for a Free Vote" type="default" />
              )}
            </div>
          </form>
        </div>
        <div className="w-md max-w-[95%] border rounded-md p-4">
          <div className="mb-2 flex flex-col gap-2">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <Gem className="opacity-80" size={20} />
            </div>
            <div>
              <h1 className="text-left text-2xl font-semibold">
                iFlow Supporter
              </h1>
              <h3 className="text-left text-muted-foreground">
                Support us by giving a small amount
              </h3>
            </div>
          </div>

          <form className="space-y-5">
            <RadioGroup className="gap-2" defaultValue="2">
              <div className="border-input has-data-[state=checked]:border-ring has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border px-4 py-2 shadow-sm outline-none">
                <RadioGroupItem
                  value="2"
                  id={`${id}-2`}
                  className="order-1 after:absolute after:inset-0"
                />
                <div className="grid grow gap-1">
                  <Label htmlFor={`${id}-2`} className="font-bold text-lg">
                    $1.99 Minimum
                  </Label>
                  <p
                    id={`${id}-2-description`}
                    className="text-muted-foreground text-xs"
                  >
                    Every Month
                  </p>
                </div>
              </div>
            </RadioGroup>

            <div className="space-y-3">
              <p>
                <strong className="text-sm font-medium">
                  Features include:
                </strong>
              </p>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Enable anonymous indexing.
                </li>
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Enable anonymous profile.
                </li>
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Enable anonymous server.
                </li>
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Index unlimited threads.
                </li>
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Get your server&apos;s API endpoint.
                </li>
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  No login wall on server join button.
                </li>
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Unlimited voting limits on post.
                </li>
                <li className="flex gap-2">
                  <CheckIcon
                    size={16}
                    className="text-primary mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  Advanced permissions.
                </li>
              </ul>
            </div>

            <div className="grid gap-2">
              {!loading && user ? (
                <Link
                  href="https://buy.polar.sh/polar_cl_hNh6awtLmw3ksUrnBs7IoylAnLsuwfagHz5wT2fifTb"
                  data-polar-checkout
                  data-polar-checkout-theme="dark"
                  className={buttonVariants({ variant: "default" })}
                >
                  Subscribe
                </Link>
              ) : (
                <SignInBtn name="Subscribe" type="default" />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
