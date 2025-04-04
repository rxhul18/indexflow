import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "./icons"
import Tos from "./tos"
import { authClient } from "@iflow/auth"
import { toast } from "sonner"
import useLocalStorage from "@/hooks/use-local"

export function LoginCards({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [inv, setInvite] = useLocalStorage("isInviteProccess", false)

  const CALLBACK_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/invite"
      : "https://indexflow.site/invite";

  const authHandler = async (provider: "google" | "discord" | "github") => {
    switch (provider) {
      case "google":
        await authClient.signIn.social({
          provider: provider,
          callbackURL: CALLBACK_URL,
          fetchOptions: {
            onSuccess() {
              setInvite(!inv);
              toast.success("Successfully logged in throw Google!");
            },
            onError() {
              setInvite(!inv);
              toast.success("Oops Error Occured!");
            }
          },
        });
        break;
      case "github":
        await authClient.signIn.social({
          provider: provider,
          callbackURL: CALLBACK_URL,
          fetchOptions: {
            onSuccess() {
              setInvite(!inv);
              toast.success("Successfully logged in throw GitHub!");
            },
            onError() {
              setInvite(!inv);
              toast.success("Oops Error Occured!");
            }
          },
        });
        break;
      case "discord":
        await authClient.signIn.social({
          provider: provider,
          callbackURL: CALLBACK_URL,
          fetchOptions: {
            onSuccess() {
              setInvite(true);
              toast.success("Successfully logged in throw Discord!");
            },
            onError() {
              setInvite(false);
              toast.success("Oops Error Occured!");
            }
          },
        });
        break;
      default:
        break;
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to IndexFlow</CardTitle>
          <CardDescription>
            You need to create an account in order to use our iFlow bot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button 
                type="button"
                variant="outline" 
                className="bg-[#1877f2] w-full hover:bg-[#1877f2]/90" 
                onClick={(e) => {
                  e.preventDefault();
                  authHandler("discord");
                }}
              >
                <Icons.discord/>
                Continue with Discord
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className="bg-[#DB4437] w-full hover:bg-[#DB4437]/90" 
                onClick={(e) => {
                  e.preventDefault();
                  authHandler("google");
                }}
              >
                <Icons.google/>
                Continue with Google
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Developer?
              </span>
            </div>
            <div className="grid gap-6">
              <Button 
                type="button"
                variant="outline" 
                className="w-full" 
                onClick={(e) => {
                  e.preventDefault();
                  authHandler("github");
                }}
              >
                <Icons.gitHub/>
                Continue with GitHub
              </Button>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account? Just continue.
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our  <Tos />.
      </div>
    </div>
  )
}
