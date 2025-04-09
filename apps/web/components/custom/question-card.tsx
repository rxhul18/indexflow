import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowBigUp, CalendarRange, Eye, MessageSquare } from "lucide-react";
import React from "react";
import { format } from "date-fns";
import { QuestionType } from "@iflow/types";
import { useProfilesStore, useUsersStore } from "@/lib/zustand";

interface QuestionCardProps {
  question: QuestionType | null;
  isLoading?: boolean;
}

const QuestionCard = React.forwardRef<HTMLDivElement, QuestionCardProps>(
  ({ question, isLoading = false }, ref) => {
    const authorId = question?.author;
    const { profiles } = useProfilesStore();
    console.log(profiles);
    const author = profiles.find((profile) => profile.id === authorId);
    console.log(author);
    if (isLoading) {
      return (
        <div className="overflow-y-hidden">
          <Card className="overflow-y-hidden p-0">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="h-6 bg-muted rounded-md animate-pulse w-3/4"></div>
                <div className="h-4 bg-muted rounded-md animate-pulse w-full"></div>
                <div className="h-4 bg-muted rounded-md animate-pulse w-2/3"></div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-5 bg-muted rounded-full animate-pulse w-16"></div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-between gap-4 border-t bg-muted/40 px-4 py-4 sm:px-6">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="h-4 bg-muted rounded-md animate-pulse w-16"></div>
                <div className="h-4 bg-muted rounded-md animate-pulse w-20"></div>
                <div className="h-4 bg-muted rounded-md animate-pulse w-24"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 bg-muted rounded-md animate-pulse w-24"></div>
              </div>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return (
      <div ref={ref} className="overflow-y-hidden">
              <Link href={`/qs/${question?.id}`}>
        <Card className="overflow-y-hidden p-0">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold hover:text-primary hover:underline line-clamp-2">
                  {question?.title}
                </h3>
              <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
                {question?.content}
              </p>
              <div className="flex flex-wrap gap-2">
                {question?.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-4 border-t bg-muted/40 px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <ArrowBigUp className="h-4 w-4" />
                <span className="text-xs sm:text-sm">
                  {question && question?.up_votes + question?.down_votes} votes
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs sm:text-sm">
                  {question && question?.answers.length} answers
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span className="text-xs sm:text-sm">
                {question && question?.up_votes - question?.down_votes + question?.answers.length} views
                </span>
                </div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <CalendarRange className="h-4 w-4" />
                <span className="text-xs sm:text-sm">
                  {format(new Date(question?.createdAt || ""), "dd MMM yyyy")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                src={author?.dc_pfp!}
                alt={author?.dc_name!}
                />
                <AvatarFallback>
                {author?.dc_name?.slice(0, 2)}
                </AvatarFallback>
                </Avatar>
              <div className="text-xs sm:text-sm">
                <span className="text-muted-foreground">Asked by </span>
                <span className="font-medium">{author?.dc_name!}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
                </Link>
      </div>
    );
  },
);

QuestionCard.displayName = "QuestionCard";

export default QuestionCard;
