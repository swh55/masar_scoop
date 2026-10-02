"use client";

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Download,
  Upload,
  FileJson,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useSessionId } from "@/hooks/use-session-id";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ProgressExportImport() {
  const sessionId = useSessionId();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const exportMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `/api/progress/export?sessionId=${encodeURIComponent(sessionId)}`
      );
      if (!res.ok) throw new Error("Export failed");
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `academy-progress-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("تم تصدير تقدّمك بنجاح!", {
        description: `${data.stats.totalXP} XP · ${data.stats.lessonsCompleted} دروس`,
      });
    },
    onError: () => {
      toast.error("فشل التصدير", {
        description: "حاول مرة أخرى لاحقًا",
      });
    },
  });

  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const text = await file.text();
      const data = JSON.parse(text);
      const res = await fetch("/api/progress/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, data }),
      });
      if (!res.ok) throw new Error("Import failed");
      return res.json();
    },
    onSuccess: (result) => {
      const { imported } = result;
      setImportResult({
        success: true,
        message: `تم استيراد: ${imported.lessonProgress} درس، ${imported.trackProgress} مسار، ${imported.bookmarks} إشارة مرجعية، ${imported.ratings} تقييم`,
      });
      toast.success("تم استيراد تقدّمك بنجاح!", {
        description: `${imported.lessonProgress} دروس · ${imported.bookmarks} إشارات`,
      });
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
    },
    onError: () => {
      setImportResult({
        success: false,
        message: "فشل الاستيراد — تأكد من صحة الملف",
      });
      toast.error("فشل الاستيراد", {
        description: "تأكد من صحة ملف JSON",
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importMutation.mutate(file);
    }
    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-muted/40">
        <h3 className="font-bold text-base flex items-center gap-2">
          <FileJson className="h-5 w-5 text-primary" />
          نسخ احتياطي للتقدّم
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          صدّر تقدّمك كملف JSON أو استورده على جهاز آخر
        </p>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export button */}
          <Button
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            variant="outline"
            className="gap-2 h-auto py-3 flex-col items-start"
          >
            <div className="flex items-center gap-2">
              {exportMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              )}
              <span className="font-bold">تصدير التقدّم</span>
            </div>
            <span className="text-xs text-muted-foreground font-normal text-start">
              احفظ نسخة احتياطية من كل تقدّمك
            </span>
          </Button>

          {/* Import button */}
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={importMutation.isPending}
            variant="outline"
            className="gap-2 h-auto py-3 flex-col items-start"
          >
            <div className="flex items-center gap-2">
              {importMutation.isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              )}
              <span className="font-bold">استيراد التقدّم</span>
            </div>
            <span className="text-xs text-muted-foreground font-normal text-start">
              استعد تقدّمك من ملف JSON
            </span>
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="اختر ملف JSON"
        />

        {/* Import result */}
        {importResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-3 rounded-xl p-3 text-sm flex items-start gap-2",
              importResult.success
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400"
            )}
          >
            {importResult.success ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <span>{importResult.message}</span>
          </motion.div>
        )}

        <p className="text-[10px] text-muted-foreground mt-3 text-center">
          💡 ملاحظة: الاستيراد يدمج البيانات مع الموجود ولا يحذف ما لديك
        </p>
      </div>
    </Card>
  );
}
