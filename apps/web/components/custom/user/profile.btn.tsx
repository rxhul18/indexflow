
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AtSignIcon,
  CheckIcon,
  LogOut,
} from "lucide-react";
import { useId, useState } from "react";
import Image from "next/image";
import UserBtn from "./user.btn";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConnectedAcount from "./connected.acount";
import AdvanceSettings from "./advance.settings";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { useTagsStore } from "@/lib/zustand";
import { authClient } from "@iflow/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfileBtn({
  userId,
  pfp,
  name,
  username,
  bio,
  website,
  tags
}: {
  userId: string;
  pfp: string;
  name: string;
  username: string;
  bio: string;
  website: string;
  tags: string[];
}) {
  const id = useId();
  const fstName = name.split(" ")[0];
  const lstName = name.split(" ")[1] || "";
  const maxLength = 180;
  const nameMaxLength = 25;
  const [usernameV, setUsernameV] = useState(username?.length !== 0 ? username : null)
  const [websiteV, setWebsiteV] = useState(website?.length !== 0 ? website : null)
  const [tagsV, setTagsV] = useState<string[]>(Array.isArray(tags) ? tags : []);
  const [isTyping, setIsTyping] = useState(false);

  const {
    value: bioValue,
    characterCount: bioCharacterCount,
    handleChange: bioHandleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
    initialValue: bio
  });

  const {
    value: nameValue,
    characterCount: nameCharacterCount,
    handleChange: nameHandleChange,
    maxLength: nameLimit,
  } = useCharacterLimit({
    maxLength: nameMaxLength,
    initialValue: fstName
  });

  const {
    value: nameLValue,
    characterCount: nameLCharacterCount,
    handleChange: nameLHandleChange,
    maxLength: nameLLimit,
  } = useCharacterLimit({
    maxLength: nameMaxLength,
    initialValue: lstName
  });

  const fullName = nameValue + " " + nameLValue;
  const router = useRouter();
  const { tags: defTags } = useTagsStore();
  const tagOptions: Option[] = defTags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  const handleTagsChange = (options: Option[]) => {
    setTagsV(options.map((opt) => opt.value));
  };
  
  const USER_ENDPOINT = process.env.NODE_ENV == "development" ? "http://localhost:3001/v1/user/update" : "https://api.indexflow.site/v1/user/update"

  const handleSaveBtn = async () => {
    const res = await fetch(USER_ENDPOINT, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        name: fullName,
        username: usernameV,
        website: websiteV,
        bio: bioValue,
        tags: tagsV,
      }),
    });
  
    if (!res.ok) {
      toast.error("Failed to update profile");
      return;
    }
  
    toast.success("Profile updated successfully");
    router.refresh();
  }

  const handleSingOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
          window.location.reload();
        },
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <UserBtn pfp={pfp} name={name} />
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Edit profile
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Make changes to your profile here. You can change your photo and set a
          username.
        </DialogDescription>
        <div className="overflow-y-auto">
          <ProfileBg defaultImage="https://avatar.vercel.sh/jill" />
          <Avatar pfp={pfp} />
          <ScrollArea className="h-[calc(100vh-25rem)] w-full">
            <div className="px-6 pt-4 pb-6">
              <form className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`${id}-first-name`}>First name</Label>
                    <Input
                      id={`${id}-first-name`}
                      placeholder="Ra.."
                      defaultValue={nameValue}
                      maxLength={nameMaxLength}
                      onChange={(e) => {
                        nameHandleChange(e)
                      }}
                      type="text"
                      required
                    />
                    <p
                    id={`${id}-description`}
                    className="text-muted-foreground mt-2 text-right text-xs"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="tabular-nums">
                      {nameLimit - nameCharacterCount}
                    </span>{" "}
                    characters left
                  </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`${id}-last-name`}>Last name</Label>
                    <Input
                      id={`${id}-last-name`}
                      placeholder="Dhal"
                      defaultValue={nameLValue}
                      maxLength={nameMaxLength}
                      onChange={(e) => {
                        nameLHandleChange(e)
                      }}
                      type="text"
                      required
                    />
                    <p
                    id={`${id}-description`}
                    className="text-muted-foreground mt-2 text-right text-xs"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="tabular-nums">
                      {nameLLimit - nameLCharacterCount}
                    </span>{" "}
                    characters left
                  </p>
                  </div>
                </div>
                <div className="*:not-first:mt-2">
                  <Label htmlFor={`${id}-username`}>Username</Label>
                  <div className="relative">
                    <Input
                      id={`${id}-username`}
                      className="peer ps-9"
                      placeholder="rahulshah69"
                      defaultValue={usernameV!}
                      onChange={(e) => {setUsernameV(e.target.value); setIsTyping(true);}}
                      type="text"
                      required
                    />
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                      <AtSignIcon size={16} aria-hidden="true" />
                    </div>
                    {isTyping ? (
                      <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3">
                        <svg
                          className="animate-spin h-4 w-4 text-muted-foreground/80"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                        <CheckIcon size={16} className="text-emerald-500" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="*:not-first:mt-2">
                  <Label htmlFor={`${id}-website`}>Website</Label>
                  <div className="flex rounded-md shadow-xs">
                    <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm">
                      https://
                    </span>
                    <Input
                      id={`${id}-website`}
                      className="-ms-px rounded-s-none shadow-none"
                      placeholder="www.devwtf.in"
                      defaultValue={websiteV!}
                      onChange={(e) => {setWebsiteV(e.target.value)}}
                      type="text"
                    />
                  </div>
                </div>
                <div className="*:not-first:mt-2">
                  <Label>Tags</Label>
                  <MultipleSelector
                    commandProps={{
                      label: "Select frameworks",
                    }}
                    value={tagOptions.filter((opt) => tagsV.includes(opt.value))}
                    defaultOptions={tagOptions}
                    placeholder="Select Tags (max 5)"
                    hidePlaceholderWhenSelected
                    onChange={(e) => {handleTagsChange(e)}}
                    emptyIndicator={
                      <p className="text-center text-sm">No results found</p>
                    }
                    maxSelected={5}
                    
                    onMaxSelected={() => {
                      toast.error("You can only select up to 5 tags");
                    }}
                  />
                </div>
                <div className="*:not-first:mt-2">
                  <Label htmlFor={`${id}-bio`}>Biography</Label>
                  <Textarea
                    id={`${id}-bio`}
                    placeholder="Write a few sentences about yourself"
                    defaultValue={bioValue}
                    maxLength={maxLength}
                    onChange={(e) => {bioHandleChange(e)}}
                    aria-describedby={`${id}-description`}
                  />
                  <p
                    id={`${id}-description`}
                    className="text-muted-foreground mt-2 text-right text-xs"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="tabular-nums">
                      {limit - bioCharacterCount}
                    </span>{" "}
                    characters left
                  </p>
                </div>
                {/* <Separator />
                <ConnectedServers /> */}
                <Separator />
                <ConnectedAcount />
                <Separator />
                <AdvanceSettings isDisabled />
              </form>
            </div>
          </ScrollArea>
        </div>
        {/* </ScrollArea> */}
        <DialogFooter className="border-t px-6 py-4 !flex !justify-between">
          <DialogClose asChild>
            <Button variant="destructive" onClick={handleSingOut}>
              <LogOut /> Logout
            </Button>
          </DialogClose>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSaveBtn}>Save changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBg({ defaultImage }: { defaultImage?: string }) {
  // const [hideDefault, setHideDefault] = useState(false);
  // const {
  //   previewUrl,
  //   // fileInputRef,
  //   // handleThumbnailClick,
  //   // handleFileChange,
  //   // handleRemove,
  // } = useImageUpload();

  // const currentImage = previewUrl || (!hideDefault ? defaultImage : null);

  // const handleImageRemove = () => {
  //   handleRemove();
  //   setHideDefault(true);
  // };

  return (
    <div className="h-32">
      <div className="bg-muted relative flex h-full w-full items-center justify-center overflow-hidden">
      <Image
            className="h-full w-full object-cover"
            src={defaultImage!}
            alt={"Default profile background"
            }
            draggable={false}
            width={512}
            height={96}
          />
        {/* {currentImage && (
          <Image
            className="h-full w-full object-cover"
            src={currentImage}
            alt={
              previewUrl
                ? "Preview of uploaded image"
                : "Default profile background"
            }
            draggable={false}
            width={512}
            height={96}
          />
        )} */}
        {/* <div className="absolute inset-0 flex items-center justify-center gap-2">
          <button
            type="button"
            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
            onClick={handleThumbnailClick}
            aria-label={currentImage ? "Change image" : "Upload image"}
          >
            <ImagePlusIcon size={16} aria-hidden="true" />
          </button>
          {currentImage && (
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={handleImageRemove}
              aria-label="Remove image"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div> */}
      </div>
      {/* <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        aria-label="Upload image file"
      /> */}
    </div>
  );
}

function Avatar({ pfp }: { pfp?: string }) {
  return (
    <div className="-mt-10 px-6">
      <div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
        <Image
          src={pfp || "https://avatar.vercel.sh/jane"}
          className="h-full w-full object-cover"
          width={80}
          height={80}
          alt="Profile image"
          draggable={false}
        />
      </div>
    </div>
  );
}
