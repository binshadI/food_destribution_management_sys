"use client";

import { useState, type ReactNode } from "react";
import { Close } from "./icons";

export function Banner({
  icon,
  title,
  description,
  action,
  tone = "mint",
  onAction,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: string;
  tone?: "mint" | "amber";
  onAction?: () => void;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-2xl border p-4 sm:p-5 ${
        tone === "amber"
          ? "border-amber-300/50 border-l-4 border-l-amber-500 bg-amber-300/15"
          : "border-mint-200 border-l-4 border-l-forest-500 bg-mint-50"
      }`}
    >
      <span
        className={`grid size-9 shrink-0 place-items-center rounded-full ${
          tone === "amber"
            ? "bg-white text-amber-700"
            : "bg-white text-forest-700"
        }`}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-forest-900">{title}</p>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-charcoal-600">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <button
          type="button"
          onClick={onAction}
          className="hidden shrink-0 text-sm font-semibold text-forest-700 underline-offset-4 transition hover:text-forest-900 hover:underline sm:inline-flex"
        >
          {action}
        </button>
      ) : null}
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => setDismissed(true)}
        className="grid size-7 shrink-0 place-items-center rounded-full text-charcoal-400 transition hover:bg-mint-100 hover:text-forest-800"
      >
        <Close className="size-4" />
      </button>
    </div>
  );
}