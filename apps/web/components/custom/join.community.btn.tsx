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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function JoinCommunityBtn({InvUrl}: {InvUrl: string}) {
  // const handleJoin = () => {
  //   const newWindow = window.open(InvUrl)
  //   if (newWindow) {
  //     toast.success("Joining community...")
  //   } else {
  //     toast.error("Failed to open invite link. Please check your popup settings.")
  //   }
  // }
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="ml-4" variant="default">Join</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Click join to become a member of community for developers to ask questions and share knowledge.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction><Link href={InvUrl}>Continue</Link></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
