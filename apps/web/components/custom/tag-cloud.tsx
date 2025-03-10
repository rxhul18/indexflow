import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";

interface TagCloudProps {
  tags: {
    name: string;
    count: number;
  }[];
  onTagSelect?: (selectedTagName: string) => void;
}

export default function TagCloud({ tags, onTagSelect }: TagCloudProps) {
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    if (onTagSelect) {
      onTagSelect(tagName);
    }
  }, [tagName, onTagSelect]);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.name}
          onClick={() => setTagName(tag.name)}
          variant="outline"
          className="hover:bg-secondary cursor-pointer"
        >
          {tag.name}
          <span className="ml-1 text-xs text-muted-foreground">
            × {tag.count}
          </span>
        </Badge>
      ))}
    </div>
  );
}
