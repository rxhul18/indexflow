import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarRange, MessageSquare } from "lucide-react";
import React from "react";
import { format } from "date-fns";
import { ApiQuestionType } from "@iflow/types";

const QuestionCard = React.forwardRef<HTMLDivElement, { data: ApiQuestionType }>(
  ({ data }, ref) => {
    return (
      <div ref={ref} className="overflow-y-hidden">
        <Card className="overflow-y-hidden p-0">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2 sm:space-y-3">
              <Link href={`/qs/${data.id}`}>
                <h3 className="text-lg sm:text-xl font-semibold hover:text-primary hover:underline line-clamp-2">
                  {data.title}
                </h3>
              </Link>
              <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
                {data.content}
              </p>
              {data.tldr && (
                <p className="text-sm italic text-muted-foreground">
                  TL;DR: {data.tldr}
                </p>
              )} 
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-4 border-t bg-muted/40 px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs sm:text-sm">
                  {data.answers.length} answers
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <CalendarRange className="h-4 w-4" />
                <span className="text-xs sm:text-sm">
                  {format(new Date(data.createdAt), "dd MMM yyyy")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  {!data.is_anon ? data.author.slice(0, 2).toUpperCase() : "AN"}
                </AvatarFallback>
              </Avatar>
              <div className="text-xs sm:text-sm">
                <span className="text-muted-foreground">Asked by </span>
                {data.is_anon ? "Anonymous" : data.author}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
);

QuestionCard.displayName = "QuestionCard";

export default QuestionCard;
