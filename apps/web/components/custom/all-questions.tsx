"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { compareDesc } from "date-fns";
import { Clock, FlameIcon, ArrowUpIcon, Loader2, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import QuestionCard from "@/components/custom/question-card";
import { useQuestionsStore } from "@/lib/zustand";

export default function QuestionsList({
  tagName,
  selectedTag,
  isLoading,
}: {
  tagName: string;
  selectedTag: string;
  isLoading: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const observer = useRef<IntersectionObserver | null>(null);
  const lastQuestionElementRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayedQuestions, setDisplayedQuestions] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const filter = searchParams.get("sort") || "newest";
  const tagFilter = searchParams.get("filter") || selectedTag || tagName || "";

  const { questions } = useQuestionsStore();
  const questionsPerPage = 10;

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
      if (filter === "hot") return (b.up_votes - b.down_votes) + (b.answers.length * 2) - ((a.up_votes - a.down_votes) + (a.answers.length * 2));
      if (filter === "top") return (b.up_votes - b.down_votes) - (a.up_votes - a.down_votes);
      return 0;
    });
  }, [filter, searchQuery, tagFilter, questions]);

  useEffect(() => {
    // Reset pagination when filters change
    setPage(1);
    setDisplayedQuestions(sortedQuestions.slice(0, questionsPerPage));
  }, [sortedQuestions]);

  const loadMoreQuestions = () => {
    if (loading || displayedQuestions.length >= sortedQuestions.length) return;
    
    setLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      setPage(nextPage);
      setDisplayedQuestions(
        sortedQuestions.slice(0, nextPage * questionsPerPage)
      );
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        displayedQuestions.length < sortedQuestions.length
      ) {
        loadMoreQuestions();
      }
    });

    if (lastQuestionElementRef.current) {
      observer.current.observe(lastQuestionElementRef.current);
    }

    return () => observer.current?.disconnect();
  }, [displayedQuestions, sortedQuestions]);

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
          {isLoading ? (
            // Show skeleton cards when loading
            Array.from({ length: 10 }).map((_, index) => (
              <QuestionCard
                key={`skeleton-${index}`}
                question={null}
                isLoading={true}
              />
            ))
          ) : loading ? (
            // Show skeleton cards when fetching more data
            Array.from({ length: 10 }).map((_, index) => (
              <QuestionCard
                key={`loading-more-${index}`}
                question={null}
                isLoading={true}
              />
            ))
          ) : displayedQuestions.length > 0 ? (
            // Show actual questions when available
            displayedQuestions.map((question, index) => (
              <QuestionCard
                ref={
                  index === displayedQuestions.length - 1
                    ? lastQuestionElementRef
                    : null
                }
                key={question.id}
                question={question}
                isLoading={false}
              />
            ))
          ) : (
            // Show message when no questions are available
            <div className="text-center py-8">
              <p className="text-muted-foreground">No questions found</p>
            </div>
          )}
        {loading && (
          <div className="justify-center items-center py-4 flex-1 flex">
            <Loader2 className="animate-spin mr-3" /> Loading...
          </div>
        )}
      </div>
    </div>
  );
}
