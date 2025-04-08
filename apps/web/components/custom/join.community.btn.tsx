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
import { SignInBtn } from "./navbar/sign-up.btn";
import { useUser } from "@/context/user.context";

export function JoinCommunityBtn({
  InvUrl,
  name,
}: {
  InvUrl: string;
  name?: string;
}) {
  const { user, loading } = useUser();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {!loading && user ? (
          <Button className="ml-4" variant="default">
            {name && name.length !== 0 ? name : "Join"}
          </Button>
        ) : (
          <SignInBtn name={name || "Join"} type="default" />
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ready to join this community?</AlertDialogTitle>
          <AlertDialogDescription>
            Clicking continue will open the community invite link in a new tab.
            Each community has its own rules—please be respectful and follow
            them.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href={InvUrl} target="_blank" rel="noopener noreferrer">
              Continue
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
