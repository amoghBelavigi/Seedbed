"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  return (
    <div className={`max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2 text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-[15px] font-bold mt-3 mb-1.5 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-semibold mt-2.5 mb-1 text-foreground">{children}</h3>,
          p: ({ children }) => <p className="text-[13px] leading-relaxed text-muted-foreground mb-2">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 text-[13px] text-muted-foreground space-y-1 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 text-[13px] text-muted-foreground space-y-1 mb-2">{children}</ol>,
          li: ({ children }) => <li className="text-[13px] leading-relaxed text-muted-foreground">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          u: ({ children }) => <u className="underline">{children}</u>,
          code: ({ children }) => <code className="rounded-md bg-muted px-1.5 py-0.5 text-[12px] font-mono text-foreground">{children}</code>,
          pre: ({ children }) => <pre className="rounded-lg bg-muted p-3 text-[12px] font-mono overflow-x-auto mb-2">{children}</pre>,
          hr: () => <hr className="my-3 border-border" />,
          blockquote: ({ children }) => <blockquote className="border-l-2 border-primary/30 pl-3 italic text-muted-foreground mb-2">{children}</blockquote>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
