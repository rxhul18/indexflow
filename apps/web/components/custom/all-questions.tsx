"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { compareDesc } from "date-fns";
import { Clock, FlameIcon, ArrowUpIcon, Loader2, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { questions } from "@/json/dummy";
import QuestionCard from "@/components/custom/question-card";

export default function QuestionsList({
  tagName,
  selectedTag,
}: {
  tagName: string;
  selectedTag: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastQuestionElementRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filter = searchParams.get("sort") || "newest";
  const tagFilter = searchParams.get("filter") || selectedTag || tagName || "";

  const getFilteredQuestions = () => {
    return questions.filter((q) => {
      const matchesSearch =
        searchQuery.length === 0 ||
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag = !tagFilter || q.tags.includes(tagFilter);

      return matchesSearch && matchesTag;
    });
  };

  const sortedQuestions = useMemo(() => {
    const filteredQuestions = getFilteredQuestions();

    return filteredQuestions.sort((a, b) => {
      if (filter === "newest")
        return compareDesc(new Date(a.createdAt), new Date(b.createdAt));
      if (filter === "hot") return b.votes - a.votes;
      if (filter === "top") return b.views - a.views;
      return 0;
    });
  }, [filter, searchQuery, tagFilter]);

  const questionsPerPage = 5;
  const [loadedQuestions, setLoadedQuestions] = useState(
    sortedQuestions.slice(0, questionsPerPage),
  );

  useEffect(() => {
    setLoadedQuestions(sortedQuestions.slice(0, questionsPerPage));
  }, [sortedQuestions]);

  const loadMoreQuestions = () => {
    setLoading(true);
    setTimeout(() => {
      setLoadedQuestions((prev) =>
        sortedQuestions.slice(0, prev.length + questionsPerPage),
      );
      setLoading(false);
    }, 500);
  };

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

    if (lastQuestionElementRef.current) {
      observer.current.observe(lastQuestionElementRef.current);
    }

    return () => observer.current?.disconnect();
  }, [loadedQuestions, sortedQuestions]);

  const handleFilterChange = (value: string) => {
    router.push(`?sort=${value}`, { scroll: false });
  };

  return (
    <div className="flex-1 relative h-full overflow-x-hidden">
      <div className="flex flex-col justify-between items-start mb-6 gap-4 sticky top-0 bg-background z-10">
        <h1 className="text-3xl font-bold">
          {filter === "newest"
            ? "Recent Questions"
            : filter === "hot"
              ? "Hot Questions"
              : filter === "top"
                ? "Top Questions"
                : "Questions"}
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-between h-full w-full gap-4 md:gap-8">
          <div className="relative w-full flex flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search questions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs
            value={filter}
            onValueChange={handleFilterChange}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="newest" className="cursor-pointer">
                <Clock className="h-4 w-4 mr-2" />
                Newest
              </TabsTrigger>
              <TabsTrigger value="hot" className="cursor-pointer">
                <FlameIcon className="h-4 w-4 mr-2" />
                Hot
              </TabsTrigger>
              <TabsTrigger value="top" className="cursor-pointer">
                <ArrowUpIcon className="h-4 w-4 mr-2" />
                Top
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="space-y-4 relative h-full overflow-x-hidden scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
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
