"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";
import Babel from "@babel/standalone";
import { Play, RotateCcw, Terminal, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PlaygroundProps = {
  initialCode: string;
  language?: string;
  title?: string;
};

type OutputLine = {
  type: "log" | "error" | "warn" | "info" | "result";
  text: string;
};

// Sandbox runner: captures console output and returns it
function runCode(code: string, language: string): { outputs: OutputLine[]; error: string | null } {
  const outputs: OutputLine[] = [];

  // Transpile TypeScript/JSX to plain JS
  let jsCode = code;
  const isTS = language === "ts" || language === "tsx";
  const isJSX = language === "tsx" || language === "jsx";

  try {
    if (isTS || isJSX) {
      const presets: string[] = ["typescript"];
      if (isJSX) presets.push("react");
      const result = Babel.transform(code, {
        presets,
        filename: isTS ? "snippet.ts" : "snippet.tsx",
        retainLines: true,
      });
      jsCode = result.code ?? code;
    }
  } catch (err) {
    return {
      outputs: [],
      error: `خطأ في الترجمة (Transpile): ${(err as Error).message}`,
    };
  }

  // Remove ES module syntax that won't work in eval
  jsCode = jsCode
    .replace(/^\s*import\s.+?;\s*$/gm, "// (import removed)")
    .replace(/^\s*export\s+/gm, "");

  // Build a safe-ish runner using new Function with a custom console
  const customConsole = {
    log: (...args: unknown[]) => outputs.push({ type: "log", text: args.map(formatValue).join(" ") }),
    error: (...args: unknown[]) => outputs.push({ type: "error", text: args.map(formatValue).join(" ") }),
    warn: (...args: unknown[]) => outputs.push({ type: "warn", text: args.map(formatValue).join(" ") }),
    info: (...args: unknown[]) => outputs.push({ type: "info", text: args.map(formatValue).join(" ") }),
    table: (data: unknown) => outputs.push({ type: "log", text: formatValue(data) }),
    dir: (obj: unknown) => outputs.push({ type: "log", text: formatValue(obj) }),
  };

  try {
    const fn = new Function("console", `"use strict";\n${jsCode}`);
    const result = fn(customConsole);
    if (result !== undefined) {
      outputs.push({ type: "result", text: `→ ${formatValue(result)}` });
    }
    return { outputs, error: null };
  } catch (err) {
    outputs.push({ type: "error", text: (err as Error).message });
    return { outputs, error: (err as Error).message };
  }
}

function formatValue(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  if (typeof value === "function") return "[Function]";
  if (Array.isArray(value)) {
    return `[${value.map(formatValue).join(", ")}]`;
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export function CodePlayground({
  initialCode,
  language = "ts",
  title = "جرّب الكود بنفسك",
}: PlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [outputs, setOutputs] = useState<OutputLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    // Defer to next tick so the spinner shows
    setTimeout(() => {
      const result = runCode(code, language);
      setOutputs(result.outputs);
      setError(result.error);
      setHasRun(true);
      setIsRunning(false);
    }, 10);
  }, [code, language]);

  const handleReset = useCallback(() => {
    setCode(initialCode);
    setOutputs([]);
    setError(null);
    setHasRun(false);
  }, [initialCode]);

  const lineCount = code.split("\n").length;

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-border shadow-lg bg-[#1e1e2e]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-medium text-white/90">{title}</span>
          <span className="text-xs font-mono text-white/40 ms-1" dir="ltr">
            .{language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="h-7 px-2 text-xs text-white/60 hover:text-white hover:bg-white/10 gap-1.5"
          >
            <RotateCcw className="h-3 w-3" />
            إعادة
          </Button>
          <Button
            size="sm"
            onClick={handleRun}
            disabled={isRunning}
            className="h-7 px-3 text-xs gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white border-0"
          >
            {isRunning ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Play className="h-3 w-3" />
            )}
            {isRunning ? "يعمل..." : "تشغيل"}
          </Button>
        </div>
      </div>

      {/* Code editor */}
      <div className="relative" dir="ltr">
        {/* Line numbers gutter */}
        <div className="absolute inset-y-0 start-0 w-10 bg-white/5 border-e border-white/10 py-3 px-2 select-none pointer-events-none">
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className="text-xs font-mono text-white/30 leading-5 text-end"
            >
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          dir="ltr"
          className="block w-full ps-12 pe-4 py-3 bg-transparent text-white/90 font-mono text-sm leading-5 resize-y min-h-[160px] max-h-[480px] focus:outline-none"
          style={{ tabSize: 2 }}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              const start = e.currentTarget.selectionStart;
              const end = e.currentTarget.selectionEnd;
              const newCode = code.substring(0, start) + "  " + code.substring(end);
              setCode(newCode);
              requestAnimationFrame(() => {
                if (textareaRef.current) {
                  textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
                }
              });
            }
          }}
        />
      </div>

      {/* Output panel */}
      {hasRun && (
        <div className="border-t border-white/10 bg-black/30">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
            {error ? (
              <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            )}
            <span className="text-xs font-medium text-white/70">
              {error ? "خطأ" : "الناتج"}
            </span>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto" dir="ltr">
            {outputs.length === 0 && !error ? (
              <pre className="text-xs font-mono text-white/40">
                (لا ناتج — تأكد من وجود console.log في الكود)
              </pre>
            ) : (
              outputs.map((line, i) => (
                <pre
                  key={i}
                  className={cn(
                    "text-xs font-mono whitespace-pre-wrap break-words leading-6",
                    line.type === "error" && "text-rose-300",
                    line.type === "warn" && "text-amber-300",
                    line.type === "info" && "text-sky-300",
                    line.type === "result" && "text-emerald-300 font-bold",
                    line.type === "log" && "text-white/85"
                  )}
                >
                  {line.text}
                </pre>
              ))
            )}
            {error && (
              <pre className="mt-2 text-xs font-mono text-rose-300 whitespace-pre-wrap break-words">
                {error}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to render a playground as a block within markdown
export function PlaygroundBlock({ code, language }: { code: string; language: string }) {
  return <CodePlayground initialCode={code} language={language} />;
}

// Wrapper for embedding into JSX content
export function PlaygroundWrapper({ children }: { children?: ReactNode }) {
  // This is a no-op wrapper for type compatibility
  return null;
}
