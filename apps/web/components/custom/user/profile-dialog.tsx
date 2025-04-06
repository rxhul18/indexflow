"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfileDialogProps {
  username: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({
  username,
  isOpen,
  onOpenChange,
}: UserProfileDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && username) {
      // Fetch user data here
      // This is a placeholder - you'll need to implement the actual API call
      fetchUserData(username).then((data) => {
        setUserData(data);
      });
    }
  }, [isOpen, username]);

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      // Remove username from URL when dialog closes
      const params = new URLSearchParams(searchParams.toString());
      params.delete("username");
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        {userData && (
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData.avatar} alt={username} />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{username}</h3>
              {/* Add more user information here */}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Placeholder function - implement your actual API call
async function fetchUserData(username: string) {
  // Implement your API call here
  return {
    avatar: `https://avatar.vercel.sh/${username}`,
    // Add other user data
  };
} 