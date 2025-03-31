"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

export default function Logo() {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-center h-full w-full">
      {theme == "dark" ? (
        <Image
          className="h-auto w-full rounded-full"
          src="/img/logo.png"
          alt="Profile image"
          width={40}
          height={40}
          aria-hidden="true"
        />
      ) : (
        <Image
          className="h-auto w-full rounded-full"
          src="/img/logo2.png"
          alt="Profile image"
          width={40}
          height={40}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
