"use client";
import { useEffect, useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

interface MDXFormatterProps {
  content: string;
}

const MDXFormatter = ({ content }: MDXFormatterProps) => {
  const [formattedContent, setFormattedContent] = useState("");

  useEffect(() => {
    const formatContent = () => {
      // Clean the HTML content first
      let cleanContent = DOMPurify.sanitize(content);

      // Find all code blocks and apply syntax highlighting
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = cleanContent;
      
      const codeBlocks = tempDiv.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });

      // Get the formatted HTML
      cleanContent = tempDiv.innerHTML;

      setFormattedContent(cleanContent);
    };

    formatContent();
  }, [content]);

  return (
    <div 
      className="prose max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};

export default MDXFormatter;