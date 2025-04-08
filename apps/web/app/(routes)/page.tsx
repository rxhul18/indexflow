/* eslint-disable @next/next/no-img-element */
"use client";
import TagName from "@/components/custom/tags.comp";
import AllQuestions from "@/components/custom/all-questions";
import { Suspense, useState } from "react";
import { JoinCommunityBtn } from "@/components/custom/join.community.btn";
import { useQuestionsStore, useServersStore, useTagsStore } from "@/lib/zustand";
import { useContent } from "@/context/content.context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Clock, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [selectedTag, setSelectedTag] = useState("");
  const { servers } = useServersStore();
  const { tags } = useTagsStore();
  const { questions } = useQuestionsStore();
  const { contentLoading } = useContent();
  const router = useRouter();
  const RecentThreds = questions.filter((thread) => {
    const threadDate = new Date(thread.createdAt);
    const now = new Date();
    const diffHours = (now.getTime() - threadDate.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  });

  console.log("Questions: ", questions);

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
              <AllQuestions tagName={selectedTag} selectedTag={selectedTag} questions={questions} />
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
              {contentLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-md border bg-background p-3">
                      <div className="h-5 w-32 bg-primary/60 rounded animate-pulse mb-2" />
                      <div className="h-12 w-full bg-primary/40 rounded animate-pulse mb-2" />
                      <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 rounded-full bg-primary/60 animate-pulse" />
                        <div className="w-10 h-3 bg-primary/60 rounded animate-pulse" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 rounded-full bg-primary/60 animate-pulse" />
                        <div className="w-12 h-3 bg-primary/60 rounded animate-pulse" />
                      </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : RecentThreds.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No recent threads found.
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto h-[calc(100vh-55vh)] overflow-x-hidden scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                  {RecentThreds.map((thread) => (
                    <div
                      key={thread.id}
                      className="rounded-md border bg-background p-3 transition-colors"
                    >
                      <Link href={`/qs/${thread.id}`} className="block">
                        <h3 className="font-medium ">{thread.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {thread.content}
                        </p>

                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {(() => {
                                const now = new Date();
                                const created = new Date(thread.createdAt);
                                const diffMs = now.getTime() - created.getTime();
                                const diffMins = Math.floor(diffMs / (1000 * 60));
                                if (diffMins < 60) {
                                  return `${diffMins}m ago`;
                                }
                                const diffHours = Math.floor(diffMins / 60);
                                if (diffHours < 24) {
                                  return `${diffHours}h ago`;
                                }
                                const diffDays = Math.floor(diffHours / 24);
                                return `${diffDays}d ago`;
                              })()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{thread.answers?.length} replies</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              {/*  */}
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
