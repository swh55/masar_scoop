"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin progress bar at the top of the page that fills as the user scrolls.
 * Useful for lesson reading progress.
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-16 inset-x-0 h-1 origin-right bg-gradient-to-l from-emerald-500 via-teal-500 to-emerald-600 z-40"
      aria-hidden
    />
  );
}
