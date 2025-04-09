import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Have a look at this Question on IndexFlow",
  description: "Browse and search questions from all over the world Discord communities",
  keywords: [
    "questions",
    "answers",
    "discord",
    "community",
    "indexflow",
    "search",
    "questions and answers",
    "discord questions",
    "discord answers",
    "discord search",
    "discord index",
    "discord index flow",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://indexflow.site/",
    title: "Have a look at this Question on IndexFlow",
    description: "Browse and search questions from all over the world Discord communities",
    siteName: "IndexFlow",
    images: [
      {
        url: "https://indexflow.site/qs-og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Have a look at this Question on IndexFlow",
    description: "Browse and search questions from all over the world Discord communities",
    images: [
      {
        url: "https://indexflow.site/qs-og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function layout({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-center w-full">{children}</div>;
}
