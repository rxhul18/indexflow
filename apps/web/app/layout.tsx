import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

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
    default: "DevOverflow | Developer Q&A Community",
    template: "%s | DevOverflow",
  },
  description: "A community-driven platform for developers to ask questions and share knowledge",
  keywords: ["programming", "developer", "coding", "questions", "answers", "community", "discord"],
  authors: [{ name: "DevOverflow Team" }],
  creator: "DevOverflow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devoverflow.vercel.app",
    title: "DevOverflow | Developer Q&A Community",
    description: "A community-driven platform for developers to ask questions and share knowledge",
    siteName: "DevOverflow",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevOverflow | Developer Q&A Community",
    description: "A community-driven platform for developers to ask questions and share knowledge",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Toaster />
            {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
