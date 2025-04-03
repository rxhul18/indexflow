"use client";

import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useImageUpload } from "@/hooks/use-image-upload";
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
import { AtSignIcon, CheckIcon, ImagePlusIcon, LogOut, XIcon } from "lucide-react";
import { useId, useState } from "react";
import Image from "next/image";
import UserBtn from "./user.btn";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConnectedAcount from "./connected.acount";
import AdvanceSettings from "./advance.settings";
import MultipleSelector, { Option } from "@/components/ui/multiselect"
import { useTagsStore } from "@/lib/zustand";


export default function ProfileBtn({
  pfp,
  name,
}: {
  pfp: string;
  name: string;
}) {
  const id = useId();

  const maxLength = 180;
  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({
    maxLength,
    initialValue:
      "Hey, I am Rahul Shah, a web developer who loves turning ideas into amazing websites!",
  });

  const { tags } = useTagsStore();
  const tagOptions:Option[] = tags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

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
          <ProfileBg defaultImage="/sai-bg.png" />
          <Avatar defaultImage="/rahul.jpeg" />
          <ScrollArea className="h-[calc(100vh-25rem)] w-full">
            <div className="px-6 pt-4 pb-6">
              <form className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`${id}-first-name`}>First name</Label>
                    <Input
                      id={`${id}-first-name`}
                      placeholder="Ra.."
                      defaultValue="Rahul"
                      type="text"
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`${id}-last-name`}>Last name</Label>
                    <Input
                      id={`${id}-last-name`}
                      placeholder="Sha..."
                      defaultValue="Shah"
                      type="text"
                      required
                    />
                  </div>
                </div>
                <div className="*:not-first:mt-2">
                  <Label htmlFor={`${id}-username`}>Username</Label>
                  <div className="relative">
                    <Input id={`${id}-username`} className="peer ps-9" placeholder="rahulshah69"
                      defaultValue="SkidGod4444"
                      type="text"
                      required />
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                      <AtSignIcon size={16} aria-hidden="true" />
                    </div>
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                      <CheckIcon
                        size={16}
                        className="text-emerald-500"
                        aria-hidden="true"
                      />
                    </div>
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
                      placeholder="rahulwtf.in"
                      defaultValue="www.devwtf.in"
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
                  value={tagOptions.slice(0, 0)}
                  defaultOptions={tagOptions}
                    placeholder="Select frameworks"
                    hideClearAllButton
                    hidePlaceholderWhenSelected
                    emptyIndicator={<p className="text-center text-sm">No results found</p>}
                  />
                </div>
                <div className="*:not-first:mt-2">
                  <Label htmlFor={`${id}-bio`}>Biography</Label>
                  <Textarea
                    id={`${id}-bio`}
                    placeholder="Write a few sentences about yourself"
                    defaultValue={value}
                    maxLength={maxLength}
                    onChange={handleChange}
                    aria-describedby={`${id}-description`}
                  />
                  <p
                    id={`${id}-description`}
                    className="text-muted-foreground mt-2 text-right text-xs"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="tabular-nums">{limit - characterCount}</span>{" "}
                    characters left
                  </p>
                </div>
                <Separator />
                <ConnectedAcount />
                <Separator />
                <AdvanceSettings />
              </form>
            </div>
          </ScrollArea>
        </div>
        {/* </ScrollArea> */}
        <DialogFooter className="border-t px-6 py-4 !flex !justify-between">
          <Button variant="destructive">
            <LogOut /> Logout
          </Button>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button">Save changes</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProfileBg({ defaultImage }: { defaultImage?: string }) {
  const [hideDefault, setHideDefault] = useState(false);
  const {
    previewUrl,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
  } = useImageUpload();

  const currentImage = previewUrl || (!hideDefault ? defaultImage : null);

  const handleImageRemove = () => {
    handleRemove();
    setHideDefault(true);
  };

  return (
    <div className="h-32">
      <div className="bg-muted relative flex h-full w-full items-center justify-center overflow-hidden">
        {currentImage && (
          <Image
            className="h-full w-full object-cover"
            src={currentImage}
            alt={
              previewUrl
                ? "Preview of uploaded image"
                : "Default profile background"
            }
            width={512}
            height={96}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2">
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
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        aria-label="Upload image file"
      />
    </div>
  );
}

function Avatar({ defaultImage }: { defaultImage?: string }) {
  const { previewUrl, fileInputRef, handleThumbnailClick, handleFileChange } =
    useImageUpload();

  const currentImage = previewUrl || defaultImage;

  return (
    <div className="-mt-10 px-6">
      <div className="border-background bg-muted relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 shadow-xs shadow-black/10">
        {currentImage && (
          <Image
            src={currentImage}
            className="h-full w-full object-cover"
            width={80}
            height={80}
            alt="Profile image"
          />
        )}
        <button
          type="button"
          className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
          onClick={handleThumbnailClick}
          aria-label="Change profile picture"
        >
          <ImagePlusIcon size={16} aria-hidden="true" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          aria-label="Upload profile picture"
        />
      </div>
    </div>
  );
}
