"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpIcon, Clock, FlameIcon, Loader2, Search } from "lucide-react";
import QuestionCard from "../question-card";
import { compareDesc } from "date-fns";
import { questions } from "@/json/dummy";

export default function AllQuestions({ tagName }: { tagName: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState(searchParams.get("sort") || "");
  const [tagFil, setTagFil] = useState(searchParams.get("tag") || tagName);

  const questionsPerPage = 5;

  const getSortedQuestions = (tag: string, sort: string) => {
    return [...questions].sort((a, b) => {
      const aHasTag = a.tags.includes(tag);
      const bHasTag = b.tags.includes(tag);

      if (aHasTag && !bHasTag) return -1;
      if (!aHasTag && bHasTag) return 1;

      if (sort === "newest")
        return compareDesc(new Date(a.createdAt), new Date(b.createdAt));
      if (sort === "hot") return b.votes - a.votes;
      if (sort === "top") return b.views - a.views;

      return 0;
    });
  };

  const [sortedQuestions, setSortedQuestions] = useState(() =>
    getSortedQuestions(tagFil, filter),
  );
  const [loadedQuestions, setLoadedQuestions] = useState(() =>
    sortedQuestions.slice(0, questionsPerPage),
  );

  useEffect(() => {
    const newTag = searchParams.get("tag") || tagName;
    const newFilter = searchParams.get("sort") || "newest";

    setTagFil(newTag);
    setFilter(newFilter);

    const updatedSortedQuestions = getSortedQuestions(newTag, newFilter);
    setSortedQuestions(updatedSortedQuestions);
    setLoadedQuestions(updatedSortedQuestions.slice(0, questionsPerPage));
  }, [searchParams, tagName]);

  const loadMoreQuestions = () => {
    setLoading(true);
    setLoadedQuestions((prev) =>
      sortedQuestions.slice(0, prev.length + questionsPerPage),
    );
    setLoading(false);
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastQuestionElementRef = useRef(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        loadedQuestions.length < sortedQuestions.length
      ) {
        loadMoreQuestions();
      }
    });
    if (lastQuestionElementRef.current)
      observer.current.observe(lastQuestionElementRef.current);
  }, [loadedQuestions]);

  const handleFilterChange = (value: string) => {
    router.push(`?sort=${value}${tagFil ? `&tag=${tagFil}` : ""}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex-1 relative h-[calc(100vh-120px)] overflow-hidden py-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sticky top-0 bg-background z-10">
        <h1 className="text-3xl font-bold">All Questions</h1>

        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search questions..." className="pl-10" />
        </div>
        <Tabs
          value={filter || ""}
          onValueChange={handleFilterChange}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="newest" className="cursor-pointer">
              <Clock className="h-4 w-4 mr-2" />
              <span>Newest</span>
            </TabsTrigger>
            <TabsTrigger value="hot" className="cursor-pointer">
              <FlameIcon className="h-4 w-4 mr-2" />
              <span>Hot</span>
            </TabsTrigger>
            <TabsTrigger value="top" className="cursor-pointer">
              <ArrowUpIcon className="h-4 w-4 mr-2" />
              <span>Top</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4 relative overflow-y-auto h-full overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {loadedQuestions.map((question, index) => (
          <QuestionCard
            ref={
              index === loadedQuestions.length - 1
                ? lastQuestionElementRef
                : null
            }
            key={question.id}
            question={question}
          />
        ))}
        {loading && (
          <div className="justify-center items-center py-4 flex-1 flex">
            <Loader2 className="animate-spin mr-3" /> Loading...
          </div>
        )}
      </div>
    </div>
  );
}
