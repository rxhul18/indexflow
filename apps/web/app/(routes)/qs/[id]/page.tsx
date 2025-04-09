"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowBigUp, ArrowBigDown, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SubbcribeCommunityBtn } from "@/components/custom/subcribe.community.btn";
import ShareLinkBtn from "@/components/custom/share.btn";
import MDXFormatter from "@/components/custom/mdx.formatter";
import { useQuestionsStore, useServersStore, useProfilesStore } from "@/lib/zustand";
import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { IndexAnsType, QuestionType, ServerType, AnonProfileType } from "@iflow/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { handleVote } from "@/lib/func";

interface QuestionWithDetails extends QuestionType {
  formattedAnswers?: IndexAnsType[];
}

function QuestionPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const threadParam = searchParams.get('thread');
  const { questions } = useQuestionsStore();
  const [question, setQuestion] = useState<QuestionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(!!threadParam);

  useEffect(() => {
    if (questions.length > 0) {
      const foundQuestion = questions.find(q => q.id === id);
      if (foundQuestion) {
        // Format answers from the question data
        const formattedAnswers = foundQuestion.answers?.map(answer => ({
          id: answer.id || String(Math.random()),
          content: answer.content || "",
          author: answer.author || "",
          qns_id: answer.qns_id || "",
          server_id: answer.server_id || "",
          thread_id: answer.thread_id || "",
          msg_url: answer.msg_url || "",
          createdAt: answer.createdAt || "",
          up_votes: answer.up_votes || 0,
          down_votes: answer.down_votes || 0,
          updatedAt: answer.updatedAt || "",
          is_correct: answer.is_correct || false
        })) || [];

        setQuestion({
          ...foundQuestion,
          formattedAnswers
        });
      }
      setLoading(false);
    }
  }, [questions, id]);

  useEffect(() => {
    setIsSubscribeDialogOpen(!!threadParam);
  }, [threadParam]);

  const { servers } = useServersStore();
  const server = servers.find((s: ServerType) => s.id === question?.server_id);
  const { profiles } = useProfilesStore();
  const author = profiles.find((p: AnonProfileType) => p.id === question?.author);
  const answeredBy = profiles.find((p: AnonProfileType) => p.id === question?.formattedAnswers?.[0]?.author);

  const handleVoteAction = async (postId: string, action: "increment" | "decrement", type: "qns" | "ans") => {
    // Check if user has already voted on this post
    const voteKey = `vote_${type}_${postId}`;
    const previousVote = localStorage.getItem(voteKey);
    
    // If user already voted the same way, remove the vote
    if (previousVote === action) {
      // Remove the vote from localStorage
      localStorage.removeItem(voteKey);
      
      // Perform the opposite action to cancel the vote
      const oppositeAction = action === "increment" ? "decrement" : "increment";
      const result = await handleVote(postId, oppositeAction, type);
      
      if (result.success) {
        if (type === "qns" && question) {
          setQuestion({
            ...question,
            up_votes: result.up_votes,
            down_votes: result.down_votes
          });
          toast.success("Vote removed");
        } else if (type === "ans" && question?.formattedAnswers) {
          const updatedAnswers = question.formattedAnswers.map(answer => 
            answer.id === postId 
              ? { ...answer, up_votes: result.up_votes, down_votes: result.down_votes }
              : answer
          );
          setQuestion({
            ...question,
            formattedAnswers: updatedAnswers
          });
          toast.success("Vote removed");
        }
      } else {
        toast.error(result.error || "Failed to remove vote");
      }
      return;
    }
    
    // If user voted the opposite way before, don't allow changing vote
    if (previousVote && previousVote !== action) {
      toast.error("You can only vote once per post");
      return;
    }
    
    const result = await handleVote(postId, action, type);
    
    if (result.success) {
      // Save the vote in localStorage to track user's vote
      localStorage.setItem(voteKey, action);
      
      if (type === "qns" && question) {
        setQuestion({
          ...question,
          up_votes: result.up_votes,
          down_votes: result.down_votes
        });
        toast.success(`Vote ${action === "increment" ? "up" : "down"} recorded`);
      } else if (type === "ans" && question?.formattedAnswers) {
        const updatedAnswers = question.formattedAnswers.map(answer => 
          answer.id === postId 
            ? { ...answer, up_votes: result.up_votes, down_votes: result.down_votes }
            : answer
        );
        setQuestion({
          ...question,
          formattedAnswers: updatedAnswers
        });
        toast.success(`Vote ${action === "increment" ? "up" : "down"} recorded`);
      }
    } else {
      toast.error(result.error || "Failed to vote");
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-3/4 mb-2" />
            <div className="flex flex-wrap gap-1 items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-40" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4">
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="flex flex-wrap gap-2 mt-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
            <div className="flex flex-col gap-3 md:flex-row justify-between items-start md:items-center mt-6 pt-4 border-t">
              <div className="flex">
                <Skeleton className="h-10 w-32 rounded-full" />
                <div className="flex items-center gap-2 flex-1 px-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4">
                  <Skeleton className="h-7 w-7" />
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <div className="flex justify-between items-center mt-6">
                      <Skeleton className="h-10 w-32 rounded-full" />
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-4 w-40" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return <div className="container py-8">Question not found</div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-primary hover:underline mb-2">
            ← Back to questions
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">{question.title}</h1>
          <div className="flex flex-wrap gap-1 items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                Posted on {typeof question.createdAt === 'string' ? format(new Date(question?.createdAt || ""), "dd MMM yyyy") : "recently"} in
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={server?.logo || "https://avatar.vercel.sh/jane"}
                    alt={server?.name || "Anonymous"}
                  />
                  <AvatarFallback>
                    {server?.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium text-white">
                  {server?.name || "Anonymous"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4">
        {/* Question content */}
        <div className="space-y-4">
          <div className="border p-3 rounded-xl bg-primary/5 overflow-x-auto max-w-full">
            <MDXFormatter>{question.content}</MDXFormatter>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {(question.tags || []).map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col gap-3 md:flex-row justify-between items-start md:items-center mt-6 pt-4 border-t">
            <div className="flex">
              <div className="flex items-center gap-2 md:gap-4 bg-primary/15 w-fit rounded-full p-1.5 shadow-sm">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-black hover:text-primary transition-colors"
                  aria-label="Upvote"
                  onClick={() => handleVoteAction(question.id, "increment", "qns")}
                >
                  <ArrowBigUp className="size-5" />
                </Button>
                <span className="font-semibold text-lg min-w-8 text-center">{question.up_votes || 0}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-black hover:text-primary transition-colors"
                  aria-label="Downvote"
                  onClick={() => handleVoteAction(question.id, "decrement", "qns")}
                >
                  <ArrowBigDown className="size-5" />
                </Button>
                <span className="font-semibold text-lg min-w-8 text-center">{question.down_votes || 0}</span>
              </div>
              <div className="flex items-center gap-2 flex-1 px-2">
                <SubbcribeCommunityBtn 
                  InvUrl={question.msg_url} 
                  isOpen={isSubscribeDialogOpen} 
                  setIsOpen={setIsSubscribeDialogOpen} 
                />
                <ShareLinkBtn />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                Asked by
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={author?.dc_pfp || "https://avatar.vercel.sh/jane"}
                    alt={author?.dc_name || "Anonymous"}
                  />
                  <AvatarFallback>
                    {(author?.dc_name || "AN").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">
                  {author?.dc_name || "Anonymous"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-6">
          {question.formattedAnswers?.length || 0} {(question.formattedAnswers?.length || 0) === 1 ? "Answer" : "Answers"}
        </h2>

        <div className="space-y-8">
          {question.formattedAnswers?.map((answer) => (
            <div key={answer.id} className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4">
                {/* Voting */}
                <div className="flex items-center gap-3">
                  {answer.is_correct && (
                    <CheckCircle2 className="size-7 text-green-500" />
                  )}
                  {answer.is_correct && (
                    <p className="text-md text-muted-foreground">
                      Correct Answer
                    </p>
                  )}
                </div>

                {/* Answer content */}
                <div className="space-y-4">
                  <div
                    className={`border ${answer.is_correct ? "border-green-500" : ""} py-5 px-3 rounded-xl bg-primary/5 overflow-x-auto max-w-full`}
                  >
                    <MDXFormatter>{answer.content}</MDXFormatter>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center gap-2 md:gap-4 bg-primary/15 w-fit rounded-full p-1.5 shadow-sm">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-black hover:text-primary transition-colors"
                  aria-label="Upvote"
                  onClick={() => handleVoteAction(answer.id, "increment", "ans")}
                >
                  <ArrowBigUp className="size-5" />
                </Button>
                <span className="font-semibold text-lg min-w-8 text-center">{answer.up_votes || 0}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-black hover:text-primary transition-colors"
                  aria-label="Downvote"
                  onClick={() => handleVoteAction(answer.id, "decrement", "ans")}
                >
                  <ArrowBigDown className="size-5" />
                </Button>
                <span className="font-semibold text-lg min-w-8 text-center">{answer.down_votes || 0}</span>
              </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground">
                        Answered on {typeof answer.createdAt === 'string' ? format(new Date(answer?.createdAt || ""), "dd MMM yyyy") : "recently"} by
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={answeredBy?.dc_pfp || "https://avatar.vercel.sh/jane"}
                            alt={answeredBy?.dc_name || "Anonymous"}
                          />
                          <AvatarFallback>
                            {(answeredBy?.dc_name || "AN").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium">
                          {answeredBy?.dc_name || "Anonymous"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer form */}
      {/* <div className="mt-10">
        <h2 className="text-xl font-semibold mb-6">Your Answer</h2>
        <AnswerForm questionId={id} />
      </div> */}
    </div>
  );
}

export default function QuestionPage() {
  return (
    <Suspense fallback={
      <div className="container py-8">
        <div className="mb-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    }>
      <QuestionPageContent />
    </Suspense>
  );
}
