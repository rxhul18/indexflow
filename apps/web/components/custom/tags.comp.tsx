import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { TagType } from "@iflow/types";

interface TagsCompProps {
  tags: TagType[];
  onTagSelect?: (selectedTagName: string) => void;
  isLoading?: boolean;
}

export default function TagsComp({ tags, onTagSelect, isLoading }: TagsCompProps) {
  return (
    <Suspense fallback={<div>Loading tags...</div>}>
      <TagsCompContent tags={tags} onTagSelect={onTagSelect} isLoading={isLoading} />
    </Suspense>
  );
}

function TagsCompContent({ tags, onTagSelect, isLoading }: TagsCompProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tagName = useMemo(() => searchParams.get("filter") || "", [searchParams]);

  useEffect(() => {
    if (onTagSelect) {
      onTagSelect(tagName);
    }
  }, [tagName, onTagSelect]);

  const handleTagClick = (tag: string) => {
    const newTag = tagName === tag ? "" : tag;
    const params = new URLSearchParams(searchParams.toString());

    if (newTag) {
      params.set("filter", newTag);
    } else {
      params.delete("filter");
    }

    router.replace(params.toString() ? `?${params.toString()}` : "/", { scroll: false });
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Badge key={index} className="w-16 h-5 bg-secondary rounded-md animate-pulse" />
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
          <span className="ml-1 text-xs text-muted-foreground">× {tag.usages}</span>
        </Badge>
      ))}
    </div>
  );
}
