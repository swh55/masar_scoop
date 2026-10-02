"use client";

import {
  FileCode2,
  Atom,
  Globe,
  Palette,
  Database,
  Boxes,
  Code2,
  Trophy,
  Award,
  GraduationCap,
  Footprints,
  Languages,
  Zap,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  FileCode2,
  Atom,
  Globe,
  Palette,
  Database,
  Boxes,
  Code2,
  Trophy,
  Award,
  GraduationCap,
  Footprints,
  Languages,
  Zap,
  Sparkles,
  Star,
};

export function TrackIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Code2;
  return <Icon className={className} />;
}
