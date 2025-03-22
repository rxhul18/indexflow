import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { TagType } from "@iflow/types";

interface TagsCompProps {
  tags: TagType[];
  onTagSelect?: (selectedTagName: string) => void;
  isLoading?: boolean;
}

export default function TagsComp({ tags, onTagSelect, isLoading }: TagsCompProps) {
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    if (onTagSelect) {
      onTagSelect(tagName);
    }
  }, [tagName, onTagSelect]);

  const handleTagClick = (tag: string) => {
    setTagName((prevTag) => (prevTag === tag ? "" : tag));
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
