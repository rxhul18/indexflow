"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@/context/user.context";
import { SignInBtn } from "./navbar/sign-up.btn";

export function SubbcribeCommunityBtn({ InvUrl, isOpen, setIsOpen }: { InvUrl: string, isOpen?: boolean, setIsOpen?: (isOpen: boolean) => void }) {
  const { user, loading } = useUser();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {!loading && user ? (
          <Button className="ml-4" variant="outline" size={"lg"}>
            Subcribe
          </Button>
        ) : (
          <SignInBtn name="Subcribe" type="default" />
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Subscribe to the Thread!</AlertDialogTitle>
          <AlertDialogDescription>
            You will be redirected to the community thread. Please make sure you are a member of the community already else you need to join the community first.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href={InvUrl} target="_blank">Continue</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
