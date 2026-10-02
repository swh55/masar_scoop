"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";
import { useFocusMode } from "@/hooks/use-focus-mode";
import { cn } from "@/lib/utils";

/**
 * Focus mode toggle button.
 * When enabled: hides header, footer, and TOC for distraction-free reading.
 */
export function FocusModeToggle({ className }: { className?: string }) {
  const { isFocusMode, toggle } = useFocusMode();

  return (
    <button
      onClick={toggle}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all border",
        isFocusMode
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground",
        className
      )}
      aria-label={isFocusMode ? "إنهاء وضع التركيز" : "تفعيل وضع التركيز"}
      title={isFocusMode ? "إنهاء وضع التركيز (ESC)" : "وضع التركيز للقراءة"}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isFocusMode ? "exit" : "enter"}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-1.5"
        >
          {isFocusMode ? (
            <>
              <Minimize2 className="h-3.5 w-3.5" />
              <span>إنهاء التركيز</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-3.5 w-3.5" />
              <span>وضع التركيز</span>
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
