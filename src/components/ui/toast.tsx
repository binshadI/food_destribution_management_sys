"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Check, Close, Info } from "./icons";

type Tone = "success" | "info" | "warning" | "error";

type Toast = {
  id: number;
  tone: Tone;
  title: string;
  description?: string;
};

type ToastInput = Omit<Toast, "id">;

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside a ToastProvider");
  }
  return ctx.toast;
}

const toneStyles: Record<Tone, string> = {
  success: "bg-mint-100 text-forest-700",
  info: "bg-forest-100 text-forest-700",
  warning: "bg-amber-300/30 text-amber-700",
  error: "bg-red-100 text-red-700",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, ...input }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 5000);
    },
    [],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] flex flex-col items-stretch gap-2 p-4 sm:items-end sm:p-6"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-sage-200 bg-white p-4 shadow-lift sm:w-96"
          >
            <span
              className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${toneStyles[item.tone]}`}
            >
              {item.tone === "warning" || item.tone === "error" ? (
                <Info className="size-4" />
              ) : (
                <Check className="size-4" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-forest-900">
                {item.title}
              </p>
              {item.description ? (
                <p className="mt-0.5 text-xs leading-relaxed text-charcoal-600">
                  {item.description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              aria-label="Dismiss notification"
              className="grid size-6 shrink-0 place-items-center rounded-full text-charcoal-400 transition hover:bg-sage-100 hover:text-forest-800"
            >
              <Close className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
