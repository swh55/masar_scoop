"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  X,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Star,
  Zap,
  Printer,
} from "lucide-react";
import { useSessionId } from "@/hooks/use-session-id";
import { useUI } from "@/lib/store";
import { TrackIcon } from "./track-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Certificate = {
  trackId: string;
  trackTitle: string;
  trackLevel: string;
  trackColor: string;
  trackIcon: string;
  completedAt: string;
  lessonsCompleted: number;
  totalLessons: number;
  totalDuration: number;
  averageScore: number;
  studentLevel: number;
  studentLevelTitle: string;
  studentTotalXP: number;
  certificateId: string;
};

type CertificateData = {
  certificates: Certificate[];
  totalEarned: number;
};

type SingleCertificate = {
  eligible: boolean;
  message?: string;
  certificate?: Certificate;
};

const LEVEL_LABEL: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

/**
 * Certificate modal — displays a single track's completion certificate.
 */
export function CertificateModal({
  trackId,
  onClose,
}: {
  trackId: string | null;
  onClose: () => void;
}) {
  const sessionId = useSessionId();
  const { data, isLoading } = useQuery<SingleCertificate>({
    queryKey: ["certificate", sessionId, trackId],
    queryFn: () =>
      fetch(
        `/api/certificate?sessionId=${encodeURIComponent(
          sessionId
        )}&trackId=${trackId}`
      ).then((r) => r.json()),
    enabled: !!trackId && !!sessionId && sessionId !== "ssr",
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!data?.certificate) return;
    const text = `أكملت مسار "${data.certificate.trackTitle}" في أكاديمية البرمجة! 🎓 معدل: ${data.certificate.averageScore}%`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "شهادة إتمام", text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // ignore
    }
  };

  return (
    <AnimatePresence>
      {trackId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm print:bg-white print:p-0 print:items-start"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl print:rounded-none print:shadow-none print:max-h-none print:overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="mt-3 text-sm text-muted-foreground">جارٍ تحضير الشهادة...</p>
              </div>
            ) : !data?.eligible ? (
              <div className="bg-card p-8 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                  <Award className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-2">الشهادة غير متاحة</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  {data?.message ?? "أكمل المسار بنسبة 100% للحصول على الشهادة"}
                </p>
                <Button onClick={onClose} variant="outline">إغلاق</Button>
              </div>
            ) : data.certificate ? (
              <CertificateDesign
                cert={data.certificate}
                onClose={onClose}
                onPrint={handlePrint}
                onShare={handleShare}
              />
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CertificateDesign({
  cert,
  onClose,
  onPrint,
  onShare,
}: {
  cert: Certificate;
  onClose: () => void;
  onPrint: () => void;
  onShare: () => void;
}) {
  const completedDate = new Date(cert.completedAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-card print:bg-white certificate-print-area">
      {/* Action bar (hidden in print) */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border print:hidden">
        <Badge className="gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border-0">
          <CheckCircle2 className="h-3 w-3" />
          شهادة إتمام
        </Badge>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onShare}
            className="gap-1.5 h-8"
            aria-label="مشاركة"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">مشاركة</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onPrint}
            className="gap-1.5 h-8"
            aria-label="طباعة / حفظ PDF"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">طباعة / PDF</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Certificate body */}
      <div
        className={cn(
          "relative p-8 sm:p-12 overflow-hidden",
          `track-${cert.trackColor}`
        )}
      >
        {/* Decorative border */}
        <div className="absolute inset-3 border-2 border-track/30 rounded-2xl pointer-events-none print:border-track/50" />
        <div className="absolute inset-4 border border-track/20 rounded-xl pointer-events-none" />

        {/* Corner decorations */}
        <div className="absolute top-6 start-6 h-12 w-12 border-t-2 border-s-2 border-track/40 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-6 end-6 h-12 w-12 border-t-2 border-e-2 border-track/40 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-6 start-6 h-12 w-12 border-b-2 border-s-2 border-track/40 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-6 end-6 h-12 w-12 border-b-2 border-e-2 border-track/40 rounded-br-xl pointer-events-none" />

        {/* Background watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none print:opacity-[0.08]">
          <Award className="h-64 w-64" />
        </div>

        <div className="relative text-center">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              أكاديمية البرمجة
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mb-6">
            Programming Academy Certificate of Completion
          </p>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold mb-2 text-track"
          >
            شهادة إتمام
          </motion.h1>
          <p className="text-sm text-muted-foreground mb-8">
            تُمنح هذه الشهادة بكل فخر إلى
          </p>

          {/* Student name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-2xl sm:text-3xl font-bold mb-1">
              متعلّم أكاديمية البرمجة
            </p>
            <div className="mx-auto h-px w-32 bg-track/40" />
          </motion.div>

          {/* Track info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <p className="text-sm text-muted-foreground mb-3">
              لإكماله مسار
            </p>
            <div className="inline-flex items-center gap-3 rounded-2xl bg-track/10 px-5 py-3 ring-1 ring-track/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-track/15 text-track">
                <TrackIcon name={cert.trackIcon} className="h-6 w-6" />
              </div>
              <div className="text-start">
                <div className="font-bold text-lg">{cert.trackTitle}</div>
                <div className="text-xs text-muted-foreground">
                  {LEVEL_LABEL[cert.trackLevel] ?? cert.trackLevel}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-3 mb-8 max-w-md mx-auto"
          >
            <Stat
              icon={CheckCircle2}
              label="دروس مكتملة"
              value={`${cert.lessonsCompleted}/${cert.totalLessons}`}
            />
            <Stat
              icon={Star}
              label="متوسط النتائج"
              value={`${cert.averageScore}%`}
            />
            <Stat
              icon={Clock}
              label="المدة"
              value={`${cert.totalDuration}د`}
            />
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-md mx-auto pt-6 border-t border-border/40"
          >
            <div className="text-center sm:text-start">
              <div className="text-xs text-muted-foreground mb-1">تاريخ الإتمام</div>
              <div className="font-bold text-sm">{completedDate}</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <Award className="h-5 w-5" />
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">المستوى</div>
                <div className="font-bold text-sm">
                  LV{cert.studentLevel} · {cert.studentLevelTitle}
                </div>
              </div>
            </div>

            <div className="text-center sm:text-end">
              <div className="text-xs text-muted-foreground mb-1">XP الكلي</div>
              <div className="font-bold text-sm flex items-center gap-1 justify-center sm:justify-end">
                <Zap className="h-3 w-3 text-violet-500" />
                {cert.studentTotalXP}
              </div>
            </div>
          </motion.div>

          {/* Certificate ID */}
          <div className="mt-6 pt-4 border-t border-dashed border-border/40">
            <p className="text-[10px] font-mono text-muted-foreground" dir="ltr">
              Cert ID: {cert.certificateId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Star;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
      <Icon className="h-4 w-4 mx-auto mb-1 text-track" />
      <div className="text-sm font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

/**
 * Certificate list — shown on progress page.
 */
export function CertificateList() {
  const sessionId = useSessionId();
  const { data, isLoading } = useQuery<CertificateData>({
    queryKey: ["certificates", sessionId],
    queryFn: () =>
      fetch(`/api/certificate?sessionId=${encodeURIComponent(sessionId)}`).then(
        (r) => r.json()
      ),
    enabled: !!sessionId && sessionId !== "ssr",
  });

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 h-32 animate-pulse" />
    );
  }

  const certificates = data?.certificates ?? [];
  const totalEarned = data?.totalEarned ?? 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-l from-amber-500/10 via-transparent to-transparent p-5">
        <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">الشهادات</h3>
              <p className="text-xs text-muted-foreground">
                {totalEarned > 0
                  ? `${totalEarned} شهادة مكتسبة`
                  : "أكمل مسارًا للحصول على شهادة"}
              </p>
            </div>
          </div>
          {totalEarned > 0 && (
            <Badge className="gap-1 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border-0">
              <Award className="h-3 w-3" />
              {totalEarned}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4">
        {certificates.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-3">
              <Award className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-medium mb-1">لا شهادات بعد</p>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              أكمل مسارًا تعليميًا بنسبة 100% للحصول على شهادة إتمام قابلة للطباعة
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {certificates.map((cert, idx) => (
              <CertificateListItem key={cert.trackId} cert={cert} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CertificateListItem({ cert, index }: { cert: Certificate; index: number }) {
  const { openCertificate } = useUI();
  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => openCertificate(cert.trackId)}
      className={cn(
        "group flex items-center gap-3 w-full p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:shadow-sm transition-all text-start",
        `track-${cert.trackColor}`
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-track/10 text-track ring-1 ring-track/20">
        <TrackIcon name={cert.trackIcon} className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm truncate">{cert.trackTitle}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {cert.lessonsCompleted}/{cert.totalLessons}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {cert.averageScore}%
          </span>
        </div>
      </div>
      <Award className="h-5 w-5 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
    </motion.button>
  );
}
