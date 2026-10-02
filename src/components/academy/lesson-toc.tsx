"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type TocItem = {
  id: string;
  text: string;
  level: number; // 1, 2, or 3
};

/**
 * Extract headings from markdown content.
 * Supports # ## ### syntax (ATX headings).
 */
function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const items: TocItem[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    // Track code blocks to skip headings inside them
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Match ATX headings: # Title, ## Title, ### Title
    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\*\*/g, "").replace(/`/g, "").trim();
      // Skip the first H1 (it's the lesson title, shown elsewhere)
      if (level === 1 && items.length === 0) continue;
      const id = text
        .toLowerCase()
        .replace(/[^\u0600-\u06FF\w\s-]/g, "") // keep Arabic + word chars
        .replace(/\s+/g, "-");
      items.push({ id, text, level });
    }
  }

  return items;
}

/**
 * Lesson table of contents — a floating sidebar showing the lesson's headings.
 * Clicking a heading scrolls to it. Active heading is highlighted.
 *
 * On desktop: floating sidebar on the left (in LTR) / right (in RTL).
 * On mobile: a button that opens a dropdown.
 */
export function LessonTableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const toc = useMemo(() => extractToc(content), [content]);

  // Generate heading IDs in the DOM and track scroll position
  useEffect(() => {
    if (toc.length === 0) return;

    // Find all h2/h3 in the prose content
    const proseContainer = document.querySelector(".prose-academy");
    if (!proseContainer) return;

    const headings = Array.from(
      proseContainer.querySelectorAll("h2, h3")
    ) as HTMLElement[];

    // Assign IDs based on TOC
    headings.forEach((h, i) => {
      if (toc[i]) {
        h.id = toc[i].id;
      }
    });

    // Intersection observer to track active heading
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first entry that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach((h) => observer.observe(h));

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  const handleHeadingClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // account for sticky header
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile trigger button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted transition-colors w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4" />
            محتويات الدرس
          </span>
          <span className="text-xs text-muted-foreground">{toc.length} أقسام</span>
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-2"
            >
              <div className="rounded-lg border border-border bg-card p-2 max-h-80 overflow-y-auto">
                {toc.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleHeadingClick(item.id)}
                    className={cn(
                      "block w-full text-start px-2 py-1.5 rounded text-sm transition-colors",
                      item.level === 3 && "ps-6",
                      activeId === item.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop floating sidebar */}
      <aside className="hidden lg:block fixed start-4 top-32 w-56 max-h-[calc(100vh-160px)] overflow-y-auto">
        <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-3">
          <div className="flex items-center gap-2 mb-3 px-1">
            <List className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide">
              المحتويات
            </span>
          </div>
          <nav className="space-y-0.5">
            {toc.map((item) => (
              <button
                key={item.id}
                onClick={() => handleHeadingClick(item.id)}
                className={cn(
                  "block w-full text-start px-2 py-1 rounded text-xs leading-relaxed transition-colors",
                  item.level === 3 && "ps-5",
                  activeId === item.id
                    ? "bg-primary/10 text-primary font-medium border-s-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.text}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
