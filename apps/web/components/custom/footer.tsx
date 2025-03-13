import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background flex justify-center w-screen">
      <div className="container py-8">
        <div className="max-w-lg">
          <Link href="/" className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DevOverflow</span>
          </Link>
          <p className="mt-4 text-md text-muted-foreground">
            A community-driven platform for developers to ask questions and
            share knowledge.
          </p>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between border-t pt-8 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">© DEVOVERFLOW 2025</p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link
              href="https://github.com/SkidGod4444/indexflow"
              className="text-xs text-muted-foreground"
            >
              GITHUB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
