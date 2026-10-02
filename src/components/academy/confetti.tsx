"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ConfettiPiece = {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
};

const COLORS = [
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f43f5e", // rose
  "#eab308", // yellow
];

const EMOJIS = ["🎉", "🎊", "✨", "⭐", "🏆", "⚡", "🔥", "💫"];

/**
 * Confetti burst animation.
 * Triggers when `trigger` becomes truthy.
 *
 * Usage:
 * <ConfettiBurst trigger={showConfetti} />
 */
export function ConfettiBurst({
  trigger,
  count = 50,
  duration = 3000,
}: {
  trigger: unknown;
  count?: number;
  duration?: number;
}) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [show, setShow] = useState(false);

  const generatePieces = useCallback(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      rotation: Math.random() * 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1.5,
    }));
  }, [count]);

  useEffect(() => {
    if (trigger) {
      setPieces(generatePieces());
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setPieces([]);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration, generatePieces]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-[200] overflow-hidden"
          aria-hidden
        >
          {pieces.map((p) => {
            const isEmoji = Math.random() > 0.7;
            return (
              <motion.div
                key={p.id}
                initial={{
                  x: `${p.x}vw`,
                  y: `${p.y}vh`,
                  rotate: p.rotation,
                  opacity: 1,
                }}
                animate={{
                  y: "110vh",
                  rotate: p.rotation + 360 + Math.random() * 360,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: "easeIn",
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  fontSize: `${p.size + 8}px`,
                  color: p.color,
                }}
                className="font-bold"
              >
                {isEmoji
                  ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
                  : null}
                {!isEmoji && (
                  <div
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      background: p.color,
                      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Level-up celebration: full-screen overlay with confetti + message.
 */
export function LevelUpCelebration({
  level,
  levelTitle,
  trigger,
  onDismiss,
}: {
  level: number;
  levelTitle: string;
  trigger: unknown;
  onDismiss: () => void;
}) {
  const [dismissedTrigger, setDismissedTrigger] = useState<unknown>(null);

  const handleDismiss = () => {
    setDismissedTrigger(trigger);
    onDismiss();
  };

  // Show celebration when trigger is truthy AND user hasn't dismissed
  // this specific trigger instance yet.
  const show = !!trigger && trigger !== dismissedTrigger;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[201] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <ConfettiBurst trigger={show} count={80} duration={4000} />
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{
                rotate: [0, -10, 10, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="text-8xl mb-4"
            >
              🎊
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl font-extrabold mb-2 bg-gradient-to-l from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent"
            >
              رفع المستوى!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-1"
            >
              المستوى {level}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/80 mb-6"
            >
              {levelTitle}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={handleDismiss}
              className="px-6 py-2.5 rounded-full bg-white text-black font-bold shadow-lg hover:scale-105 transition-transform"
            >
              متابعة التعلّم 🚀
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
