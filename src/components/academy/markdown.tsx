"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "") || "bash";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="group relative my-4 rounded-xl overflow-hidden border border-border bg-[#1e1e2e] shadow-md">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
          <span className="ms-2 text-xs font-mono text-white/60" dir="ltr">
            {lang}
          </span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
          aria-label="نسخ الكود"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> تم النسخ
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> نسخ
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed" dir="ltr">
        <code className="font-mono text-white/90">{children}</code>
      </pre>
    </div>
  );
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-academy">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }: any) => {
            const isBlock = className && className.includes("language-");
            const text = String(children).replace(/\n$/, "");
            if (isBlock) {
              return <CodeBlock className={className}>{text}</CodeBlock>;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          a: ({ children, ...props }) => (
            <a target="_blank" rel="noreferrer" {...props}>
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-border">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
