import { cn } from "@/lib/utils"

interface SpinnerProps extends React.ComponentPropsWithoutRef<"div"> {
  size?: "sm" | "md" | "lg"
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-[#1877f2] border-t-transparent transition-all duration-300 ease-in-out",
        size === "sm" && "h-4 w-4",
        size === "md" && "h-6 w-6", 
        size === "lg" && "h-18 w-18",
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}
