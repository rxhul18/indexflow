import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import UserBtn from "./user.btn"
import { useUser } from "@/context/user.context"

export default function AnonProfileComp() {
  const id = useId()
  const { user } = useUser();

  return (
    <div className="border-input has-data-[state=checked]:border-ring relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
      <Switch
        id={id}
        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
        aria-describedby={`${id}-description`}
      />
      <div className="flex grow items-start gap-3">
        <UserBtn pfp={user!.image!} name={user!.name} />
        <div className="grid grow gap-2">
          <Label htmlFor={id}>
            {user!.name}
            <span className="text-muted-foreground text-sm leading-[inherit] font-normal">
              .iflow
            </span>
          </Label>
          <p id={`${id}-description`} className="text-muted-foreground text-xs">
            You can enable or disable your anonymous profile.
          </p>
        </div>
      </div>
    </div>
  )
}
