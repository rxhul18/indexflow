import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { TagType } from "@iflow/types";
import { useSearchParams, useRouter } from "next/navigation";

interface TagsCompProps {
  tags: TagType[];
  onTagSelect?: (selectedTagName: string) => void;
  isLoading?: boolean;
}

export default function TagsComp({ tags, onTagSelect, isLoading }: TagsCompProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tagName, setTagName] = useState(searchParams.get("filter") || "");

  useEffect(() => {
    if (onTagSelect) {
      onTagSelect(tagName);
    }
  }, [tagName, onTagSelect]);

  const handleTagClick = (tag: string) => {
    setTagName((prevTag) => {
      const newTag = prevTag === tag ? "" : tag;
      const newUrl = newTag ? `?filter=${newTag}` : "/";
      router.push(newUrl, { scroll: false });
      return newTag;
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Badge
            key={index}
            className="w-16 h-5 bg-secondary rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          onClick={() => handleTagClick(tag.name)}
          variant={tag.name === tagName ? "default" : "secondary"}
          className="cursor-pointer"
        >
          {tag.name}
          <span className="ml-1 text-xs text-muted-foreground">
            × {tag.usages}
          </span>
        </Badge>
      ))}
    </div>
  );
}
