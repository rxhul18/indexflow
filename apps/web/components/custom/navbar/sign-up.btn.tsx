import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogIn } from "lucide-react";
import { authClient } from "@iflow/auth";
import { toast } from "sonner";
import Tos from "@/components/tos";

export function SignInBtn({
  name,
  type,
}: {
  name?: string;
  type?: "default" | "secondary" | "outline" | "ghost";
}) {
  const CALLBACK_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://indexflow.site';
  const authHandler = async (provider: "google" | "discord" | "github") => {
    switch (provider) {
      case "google":
        await authClient.signIn.social({
          provider: provider,
          callbackURL: CALLBACK_URL,
          fetchOptions: {
            onSuccess() {
              toast.success("Successfully logged in throw Google!");
            },
          },
        });
        break;
      case "github":
        await authClient.signIn.social({
          provider: provider,
          callbackURL: CALLBACK_URL,
          fetchOptions: {
            onSuccess() {
              toast.success("Successfully logged in throw GitHub!");
            },
          },
        });
        break;
      case "discord":
        await authClient.signIn.social({
          provider: provider,
          callbackURL: CALLBACK_URL,
          fetchOptions: {
            onSuccess() {
              toast.success("Successfully logged in throw Discord!");
            },
          },
        });
        break;
      default:
        break;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={type ? type : "outline"}
          size="sm"
          className="gap-2 h-9 cursor-pointer"
        >
          {!name && <LogIn className="h-4 w-4" />}
          <span>{name ? name : "Log In"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle className="text-start">Got stuck? Index it</DialogTitle>
          <DialogDescription className="text-center px-10">
            Do you know you can index and answer questions anonymously 👀
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 py-4 justify-center items-center min-w-full">
          <Button
            variant={"outline"}
            className="w-fit"
            id="discord"
            onClick={() => authHandler("discord")}
          >
            <Icons.discord className="fill-black dark:fill-white h-5 w-5" />
            <span className="px-10">Continue with Discord</span>
          </Button>
          <Button
            variant={"outline"}
            className="w-fit"
            id="google"
            onClick={() => authHandler("google")}
          >
            <Icons.google className="fill-black dark:fill-white h-5 w-5" />
            <span className="px-10">Continue with Google</span>
          </Button>
          <Button
            variant={"outline"}
            className="w-fit"
            id="github"
            onClick={() => authHandler("github")}
          >
            <Icons.gitHub className="fill-black dark:fill-white h-5 w-5" />
            <span className="px-10">Continue with GitHub</span>
          </Button>
        </div>
        <div>
          <span>
            By signing-up you agree to our{" "}
            <span>
              <Tos />
            </span>
            .
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
