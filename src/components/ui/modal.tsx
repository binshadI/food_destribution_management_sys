"use client";

import { useEffect, type ReactNode } from "react";
import { Close } from "./icons";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[110] grid place-items-end bg-forest-950/40 p-0 sm:place-items-center sm:p-4"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 h-full w-full"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-sage-200 bg-white p-5 shadow-lift sm:m-4">
        <header className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold text-forest-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid size-8 shrink-0 place-items-center rounded-full text-charcoal-400 transition hover:bg-sage-100 hover:text-forest-800"
          >
            <Close className="size-4" />
          </button>
        </header>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}