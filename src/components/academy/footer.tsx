import { GraduationCap, Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="font-bold">أكاديمية البرمجة</div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              منصة تعليمية تفاعلية تُعلّمك أحدث تقنيات تطوير الويب —
              TypeScript، React، Next.js، Tailwind CSS، Prisma، و Zustand —
              خطوة بخطوة مع أمثلة عملية واختبارات قصيرة.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">المسارات التعليمية</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>TypeScript الأساسي</li>
              <li>React 19</li>
              <li>Next.js 16</li>
              <li>Tailwind CSS 4</li>
              <li>Prisma ORM</li>
              <li>Zustand</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">حول المشروع</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>مبني بـ Next.js 16 + TypeScript</li>
              <li>تنسيق Tailwind CSS + shadcn/ui</li>
              <li>قاعدة بيانات Prisma + SQLite</li>
              <li>إدارة حالة Zustand</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3">اختصارات لوحة المفاتيح</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded border border-border bg-muted">J</kbd>
                <span>الصفحة الرئيسية</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded border border-border bg-muted">K</kbd>
                <span>تقدّمي</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded border border-border bg-muted">B</kbd>
                <span>المحفوظات</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded border border-border bg-muted">T</kbd>
                <span>الإنجازات</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded border border-border bg-muted">F</kbd>
                <span>وضع التركيز (في الدرس)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            صُنع بـ <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> لتعلّم البرمجة
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                try {
                  window.localStorage.removeItem("academy-onboarding-completed");
                  window.location.reload();
                } catch {
                  // ignore
                }
              }}
              className="hover:text-foreground transition-colors"
            >
              إعادة عرض المقدمة
            </button>
            <span>© 2025 أكاديمية البرمجة</span>
            <Github className="h-4 w-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
