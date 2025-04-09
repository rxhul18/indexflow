/* eslint-disable @next/next/no-img-element */
"use client";
import TagName from "@/components/custom/tags.comp";
import AllQuestions from "@/components/custom/all-questions";
import { Suspense, useState } from "react";
import { JoinCommunityBtn } from "@/components/custom/join.community.btn";
import { useServersStore, useTagsStore, useQuestionsStore } from "@/lib/zustand";
import { useContent } from "@/context/content.context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import MDXFormatter from "@/components/custom/mdx.formatter";



export default function Home() {
  const [selectedTag, setSelectedTag] = useState("");
  const { servers } = useServersStore();
  const { questions } = useQuestionsStore();
  const { tags } = useTagsStore();
  const { contentLoading } = useContent();
  const router = useRouter();

  const threads = questions
    .filter((question) => {
      const questionDate = new Date(question.createdAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - questionDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 36;
    })
    .map((question) => ({
      id: question.id,
      title: question.title,
      description: question.content,
      lastActive: question.createdAt,
      replies: question.answers.length,
    }));

  return (
    <div className="flex w-full justify-center py-8">
      <div className="flex flex-col gap-4 min-w-[90%] md:container w-full px-4 relative">
        <div className="bg-card rounded-lg border p-4 w-full">
          <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
          <TagName
            tags={tags}
            onTagSelect={setSelectedTag}
            isLoading={contentLoading}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <main className="flex-1 min-w-0 py-5">
            <Suspense
              fallback={
                <div className="text-center py-4">Loading questions...</div>
              }
            >
              <AllQuestions tagName={selectedTag} selectedTag={selectedTag} isLoading={contentLoading} />
            </Suspense>
          </main>

          {/* Community Form */}
          <aside className="w-full lg:w-[350px] py-10 space-y-6 sticky lg:top-[100px] h-fit flex-shrink-0">
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center">
                <div className="relative flex size-2.5 mr-2">
                  <div className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></div>
                  <div className="relative inline-flex size-full rounded-full bg-green-500"></div>
                </div>
                <h2 className="text-xl font-bold">Active Threads</h2>
              </div>
              <div className="space-y-3 overflow-y-auto h-[calc(100vh-55vh)] overflow-x-hidden scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {contentLoading ? (
                  // Skeleton loading state
                  Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="rounded-md border bg-background p-3 transition-colors"
                    >
                      <div className="h-5 bg-muted rounded-md animate-pulse w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded-md animate-pulse w-full mb-1"></div>
                      <div className="h-4 bg-muted rounded-md animate-pulse w-2/3 mb-2"></div>
                      
                      <div className="mt-2 flex items-center gap-4">
                        <div className="h-3 bg-muted rounded-md animate-pulse w-16"></div>
                        <div className="h-3 bg-muted rounded-md animate-pulse w-20"></div>
                      </div>
                    </div>
                  ))
                ) : threads.length > 0 ? (
                  threads.map((thread) => (
                    <div
                      key={thread.id}
                      className="rounded-md border bg-background p-3 transition-colors"
                    >
                      <Link href={`/qs/${thread.id}?thread=true`} className="block">
                        <h3 className="font-medium ">{thread.title}</h3>
                        <div className="text-sm sm:text-base text-muted-foreground line-clamp-2 pointer-events-none select-none">
                          <MDXFormatter>{thread.description.slice(0, 30) + "..." || ""}</MDXFormatter>
                        </div>

                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{format(new Date(thread.lastActive), "dd MMM yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{thread.replies} replies</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No active threads found</p>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <h2 className="text-xl font-semibold mb-4">Communities</h2>
              <p className="text-muted-foreground mb-4">
                Get unstuck with the help of our community of developers.
              </p>
              {contentLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center py-2">
                      <div className="w-10 h-10 rounded-full bg-primary/90 animate-pulse mr-4" />
                      <div className="flex-1">
                        <div className="h-4 bg-primary/60 rounded animate-pulse w-24" />
                      </div>
                      <div className="w-16 h-8 bg-primary/80 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-y-auto max-h-72 overflow-x-hidden scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  {servers.map(({ id, logo, name, invite_url }) => (
                    <div key={id} className="flex items-center py-2">
                      <img
                        src={logo ?? undefined}
                        alt={name}
                        className="w-10 h-10 rounded-full mr-4 object-cover"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <h3 className="text-md font-medium truncate max-w-[15ch]">
                          {name}
                        </h3>
                      </div>
                      <JoinCommunityBtn InvUrl={invite_url ?? ""} />
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  router.push("/communities");
                }}
              >
                More Communities
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
