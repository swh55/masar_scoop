"use client";

import { useSyncExternalStore, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Trophy,
  Zap,
  Code2,
  Target,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUI } from "@/lib/store";
import { cn } from "@/lib/utils";

const ONBOARDING_KEY = "academy-onboarding-completed";

function getOnboardingCompleted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    return true;
  }
}

const emptySubscribe = () => () => {};

function useOnboardingCompleted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    getOnboardingCompleted,
    () => true
  );
}

type Step = {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  emoji: string;
  color: string;
};

const STEPS: Step[] = [
  {
    id: 1,
    icon: BookOpen,
    title: "اختر مسارًا للبدء",
    description:
      "ابدأ بمسار TypeScript الأساسي إن كنت جديدًا. كل مسار يبني على ما قبله، فالترتيب مهم.",
    emoji: "📚",
    color: "from-sky-400 to-blue-500",
  },
  {
    id: 2,
    icon: Code2,
    title: "اقرأ الدرس وجرّب الكود",
    description:
      "كل درس يحتوي على شرح + مثال كود + محرر تفاعلي. عدّل الكود واضغط 'تشغيل' لترى النتيجة فورًا!",
    emoji: "💻",
    color: "from-emerald-400 to-teal-500",
  },
  {
    id: 3,
    icon: Target,
    title: "اختبر فهمك",
    description:
      "بعد كل درس، اختبار قصير من سؤالين. تحتاج 60% للنجاح. الإجابات الخاطئة تظهر مع شرح يوضّح الصواب.",
    emoji: "✅",
    color: "from-amber-400 to-orange-500",
  },
  {
    id: 4,
    icon: Zap,
    title: "اربح نقاط الخبرة (XP)",
    description:
      "كل درس مكتمل = +50 XP. كل اختبار مجتاز = +30 XP. نتيجة كاملة = +50 إضافية. ارتقِ في المستويات!",
    emoji: "⚡",
    color: "from-violet-400 to-fuchsia-500",
  },
  {
    id: 5,
    icon: Trophy,
    title: "حافظ على سلسلتك",
    description:
      "تعلّم يوميًا يحافظ على سلسلتك (streak) ويربح شارات إنجاز. لا تكسر السلسلة!",
    emoji: "🔥",
    color: "from-rose-400 to-pink-500",
  },
  {
    id: 6,
    icon: Sparkles,
    title: "أنت جاهز!",
    description:
      "كل ما عليك الآن هو البدء. لا تخف من الأخطاء — البرمجة كلها تجربة وتعلّم. بالتوفيق!",
    emoji: "🚀",
    color: "from-emerald-400 to-teal-600",
  },
];

export function OnboardingModal() {
  const completed = useOnboardingCompleted();
  const [userDismissed, setUserDismissed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { openTrack } = useUI();

  // Modal is open if: client has hydrated (completed !== true means not completed
  // because getOnboardingCompleted returns true on SSR and actual value on client),
  // the user hasn't dismissed it, and there's a 300ms delay for nicer entrance.
  // We use completed === false as the signal that the client has hydrated AND
  // onboarding was not yet completed.
  const shouldShow = completed === false && !userDismissed;

  const isLastStep = currentStep === STEPS.length - 1;

  const handleClose = () => {
    try {
      window.localStorage.setItem(ONBOARDING_KEY, "true");
    } catch {
      // ignore
    }
    setUserDismissed(true);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleClose();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const step = STEPS[currentStep];

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative gradient header */}
            <div className={cn("relative h-32 bg-gradient-to-br overflow-hidden", step.color)}>
              <div className="absolute inset-0 bg-grid opacity-20" />
              <motion.div
                aria-hidden
                className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-white/20 blur-2xl"
                animate={{
                  x: [0, 20, 0],
                  y: [0, -10, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                aria-hidden
                className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/20 blur-2xl"
                animate={{
                  x: [0, -15, 0],
                  y: [0, 15, 0],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <button
                onClick={handleSkip}
                className="absolute top-3 end-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                aria-label="تخطّي"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="text-6xl"
                >
                  {step.emoji}
                </motion.div>
              </div>
            </div>

            {/* Step content */}
            <div className="p-6 sm:p-8">
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5 mb-6">
                {STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentStep(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === currentStep
                        ? "w-6 bg-primary"
                        : i < currentStep
                        ? "w-1.5 bg-primary/50"
                        : "w-1.5 bg-muted-foreground/30"
                    )}
                    aria-label={`الخطوة ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md bg-gradient-to-br",
                    step.color
                  )}
                >
                  <step.icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  خطوة {currentStep + 1} من {STEPS.length}
                </span>
              </div>

              <h2
                id="onboarding-title"
                className="text-2xl font-extrabold mb-2"
              >
                {step.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {step.description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-muted-foreground"
                >
                  تخطّي الكل
                </Button>
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep((s) => s - 1)}
                      className="gap-1.5"
                    >
                      <ArrowRight className="h-4 w-4" />
                      السابق
                    </Button>
                  )}
                  {isLastStep ? (
                    <Button
                      onClick={handleClose}
                      className="gap-1.5 shadow-lg shadow-primary/20"
                    >
                      <GraduationCap className="h-4 w-4" />
                      ابدأ رحلتي
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="gap-1.5 shadow-lg shadow-primary/20"
                    >
                      التالي
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * A button to manually reopen the onboarding (e.g., in the footer).
 */
export function ReopenOnboardingButton() {
  const [shouldShow, setShouldShow] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          try {
            window.localStorage.removeItem(ONBOARDING_KEY);
            setShouldShow(true);
            setTimeout(() => {
              window.location.reload();
            }, 50);
          } catch {
            // ignore
          }
        }}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        إعادة عرض المقدمة
      </button>
      {shouldShow ? null : null}
    </>
  );
}
