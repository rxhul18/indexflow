import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default function UserBtn({ pfp, name }: { pfp: string; name: string }) {
  return (
    <Button className="gap-0 rounded-full py-0 ps-0">
      <div className="me-0.5 flex aspect-square h-full p-1.5">
        <Image
          className="h-auto w-full rounded-full"
          src={pfp || "/img/logo.png"}
          alt="Profile image"
          width={24}
          height={24}
          aria-hidden="true"
        />
      </div>
      {name || "undefined"}
    </Button>
  );
}
