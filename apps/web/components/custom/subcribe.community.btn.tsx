"use client";
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

export function SubbcribeCommunityBtn({ InvUrl }: { InvUrl: string }) {
  const { user, loading } = useUser();

  return (
    <AlertDialog>
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
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Click join to become a member of
            community for developers to ask questions and share knowledge.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href={InvUrl}>Continue</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
