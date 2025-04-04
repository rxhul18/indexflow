import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

export default function UserBtn({ pfp, name }: { pfp: string; name: string }) {
  return (
    <Avatar className="rounded-md cursor-pointer">
      <AvatarImage src={pfp} alt="Kelly King" />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  );
}
