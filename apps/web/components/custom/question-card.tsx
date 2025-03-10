import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowBigUp, CalendarRange, Eye, MessageSquare } from "lucide-react";
import React from "react";
import { format } from "date-fns";

interface QuestionCardProps {
  question: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    votes: number;
    answers: number;
    views: number;
    author: {
      name: string;
      avatar: string;
    };
    createdAt: string;
  };
}

const QuestionCard = React.forwardRef<HTMLDivElement, QuestionCardProps>(
  ({ question }, ref) => {
    return (
      <div ref={ref} className="overflow-hidden">
        <Card className="overflow-hidden p-0">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2 sm:space-y-3">
              <Link href={`/questions/${question.id}`}>
                <h3 className="text-lg sm:text-xl font-semibold hover:text-primary hover:underline line-clamp-2">
                  {question.title}
                </h3>
              </Link>
              <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
                {question.content}
              </p>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
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
                <span className="text-xs sm:text-sm">{question.votes} votes</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs sm:text-sm">{question.answers} answers</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span className="text-xs sm:text-sm">{question.views} views</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
                <CalendarRange className="h-4 w-4" />
                <span className="text-xs sm:text-sm">{format(new Date(question.createdAt), "dd MMM yyyy")}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={question.author.avatar} alt={question.author.name} />
                <AvatarFallback>{question.author.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="text-xs sm:text-sm">
                <span className="text-muted-foreground">Asked by </span>
                <span className="font-medium">{question.author.name}</span>
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
