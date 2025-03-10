/* eslint-disable @next/next/no-img-element */
"use client"
import { Button } from "@/components/ui/button"
import TagCloud from "@/components/custom/tag-cloud"
import AllQuestions from "@/components/custom/dashboard/all-questions"
import { useState } from "react"
import { communities, popularTags } from "@/json/dummy"

export default function Home() {
  // Mock data for random communities


  const [selectedTag, setSelectedTag] = useState("");

  return (
    <div className="flex w-full justify-center">
      <div className="container py-8 flex flex-col lg:flex-row gap-4 relative">
        {/* Sidebar - Make it sticky */}
        <div className="w-full lg:w-72 space-y-6 sticky lg:top-[100px] h-fit">
          <div className="bg-card rounded-lg border p-4">
            <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
            <TagCloud tags={popularTags} onTagSelect={setSelectedTag}/>
          </div>
        </div>

        {/* Main content - Make this scrollable */}
        <AllQuestions tagName={selectedTag} />

        {/*Communities Component */}
        <div className="w-full lg:w-72 space-y-6 sticky lg:top-[100px] h-fit">
          <div className="rounded-lg border p-4">
            <h2 className="text-xl font-semibold mb-4">Communities</h2>
            <p className="text-muted-foreground mb-4">Get unstuck with the help of our community of developers.</p>
            <Button className="w-full mb-4">Join Community</Button>
            <div className="overflow-y-auto max-h-72 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {communities.map((community: { id: string; name: string; description: string; img: string; }) => (
                <div key={community.id} className="flex items-center py-2">
                  <img src={community.img} alt={community.name} className="w-10 h-10 rounded-full mr-4" />
                  <div className="flex-1">
                    <h3 className="text-md font-medium truncate max-w-[11ch] overflow-hidden whitespace-nowrap">{community.name}</h3>
                    <p className="text-xs text-muted-foreground">{community.description}</p>
                  </div>
                  <Button className="ml-4" variant={"default"}>Join</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

