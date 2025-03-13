/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import TagName from "@/components/custom/tags.comp";
import AllQuestions from "@/components/custom/dashboard/all-questions";
import { Suspense, useState } from "react";
import { communities, popularTags } from "@/json/dummy";
import { JoinCommunity } from "@/components/custom/joincommunity";

export default function Home() {
  const [selectedTag, setSelectedTag] = useState("");

  return (
    <div className="flex w-full justify-center py-8">
      <div className="flex flex-col gap-4 min-w-[90%] md:container w-full px-4 relative">
        {/* TagName at the top for more space */}
        <div className="bg-card rounded-lg border p-4 w-full">
          <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
          <TagName tags={popularTags} onTagSelect={setSelectedTag} />
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <main className="flex-1 min-w-0 py-5">
            <Suspense fallback={<div>Loading...</div>}>
              <AllQuestions tagName="" selectedTag={selectedTag} />
            </Suspense>
          </main>

          <aside className="w-full lg:w-[350px] py-10 space-y-6 sticky lg:top-[100px] h-fit flex-shrink-0">
            <div className="rounded-lg border p-4">
              <h2 className="text-xl font-semibold mb-4">Communities</h2>
              <p className="text-muted-foreground mb-4">
                Get unstuck with the help of our community of developers.
              </p>
              <Button className="w-full mb-4">Join Community</Button>
              <div className="overflow-y-auto max-h-72 overflow-x-hidden scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {communities.map(({ id, name, description, img }) => (
                  <div key={id} className="flex items-center py-2">
                    <img
                      src={img}
                      alt={name}
                      className="w-10 h-10 rounded-full mr-4 object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <h3 className="text-md font-medium truncate max-w-[15ch]">
                        {name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {description}
                      </p>
                    </div>
                    <JoinCommunity />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
