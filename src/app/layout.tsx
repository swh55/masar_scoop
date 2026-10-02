import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "أكاديمية البرمجة | تعلّم تطوير الويب خطوة بخطوة",
  description:
    "منصة تعليمية تفاعلية لتعلّم TypeScript و React و Next.js و Tailwind CSS و Prisma و Zustand — كل ما تحتاجه لبناء تطبيقات ويب حديثة.",
  keywords: [
    "تعلم البرمجة",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Prisma",
    "Zustand",
    "أكاديمية برمجة",
    "تطوير ويب",
  ],
  authors: [{ name: "Z.ai Academy" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "أكاديمية البرمجة",
    description: "تعلّم تطوير الويب الحديث خطوة بخطوة",
    type: "website",
    locale: "ar",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Sonner />
        </ThemeProvider>
      </body>
    </html>
  );
}
