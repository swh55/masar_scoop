"use client";

import { GraduationCap, Menu, Trophy, BarChart3, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useUI } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Header() {
  const { view, goHome, openProgress, openAchievements, setSidebarOpen } = useUI();

  const isActive = (type: string) => view.type === type;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="القائمة"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <button
            onClick={goHome}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-primary/30 blur-md" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
            <div className="hidden sm:block text-start">
              <div className="text-base font-bold leading-tight">أكاديمية البرمجة</div>
              <div className="text-[11px] leading-tight text-muted-foreground">
                تعلّم تطوير الويب الحديث
              </div>
            </div>
          </button>
        </div>

        <nav className="flex items-center gap-1">
          <Button
            variant={isActive("home") ? "secondary" : "ghost"}
            size="sm"
            onClick={goHome}
            className={cn(
              "gap-2",
              isActive("home") && "bg-secondary"
            )}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">الرئيسية</span>
          </Button>
          <Button
            variant={isActive("progress") ? "secondary" : "ghost"}
            size="sm"
            onClick={openProgress}
            className={cn("gap-2", isActive("progress") && "bg-secondary")}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">تقدّمي</span>
          </Button>
          <Button
            variant={isActive("achievements") ? "secondary" : "ghost"}
            size="sm"
            onClick={openAchievements}
            className={cn("gap-2", isActive("achievements") && "bg-secondary")}
          >
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">الإنجازات</span>
          </Button>
          <div className="me-1 ms-2 h-6 w-px bg-border" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
