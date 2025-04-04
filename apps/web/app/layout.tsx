import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/context/user.context";
import { ContentProvider } from "@/context/content.context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "IndexFlow | Index your Discord community and get your questions resolved",
    template: "%s | IndexFlow",
  },
  description:
    "A community-driven platform for developers to ask questions and share knowledge",
  keywords: [
    "programming",
    "developer",
    "coding",
    "questions",
    "answers",
    "community",
    "discord",
  ],
  authors: [{ name: "Saidev Dhal" }],
  creator: "IndexFlow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://indexflow.site",
    title: "DevOverflow | Developer Q&A Community",
    description:
      "A community-driven platform for developers to ask questions and share knowledge",
    siteName: "IndexFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "IndexFlow | Developer Q&A Community",
    description:
      "A community-driven platform for developers to ask questions and share knowledge",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <ContentProvider>
          <UserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              disableTransitionOnChange
            >
              <Toaster />
              {children}
            </ThemeProvider>
          </UserProvider>
        </ContentProvider>
      </body>
    </html>
  );
}
