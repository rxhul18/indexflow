/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import DOMPurify from "isomorphic-dompurify";
import "highlight.js/styles/github-dark.css";
import Image from "next/image";

interface MDXFormatterProps {
  children: string;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

interface LinkProps {
  href?: string;
  children?: ReactNode;
}

const MDXFormatter = ({ children }: MDXFormatterProps) => {
  const sanitizedContent = useMemo(
    () => DOMPurify.sanitize(children),
    [children],
  );

  return (
    <div className="prose max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          code({ inline = false, children = null }: CodeProps) {
            return inline ? (
              <code className="inline-flex max-w-max bg-black dark:bg-secondary/100 dark:text-white px-1 py-0.5 rounded">
                {children}
              </code>
            ) : (
              <div className="p-2 rounded-md dark:bg-secondary/100 bg-black text-white w-fit overflow-x-auto">
                <pre className="whitespace-pre-wrap">
                  <code className="block w-full">{children}</code>
                </pre>
              </div>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-medium">{children}</h3>
          ),
          a: ({ href, children }: LinkProps) => (
            <a href={href} className="text-blue-500 hover:underline">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-500 pl-4 italic">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
          ol: ({ children }) => (
            <ol className="list-decimal pl-5">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          b: ({ children }) => <b className="font-bold">{children}</b>,
          em: ({ children }) => <em className="italic">{children}</em>,
          img: ({ src, alt }) => (
            <Image
              src={src!}
              alt={alt!}
              width={600}
              height={400}
              className="max-w-[600px] h-auto rounded-md my-2"
            />
          ),
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MDXFormatter;
