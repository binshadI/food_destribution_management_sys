import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export const eyebrow =
  "inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-forest-600";

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-forest-800 focus-visible:outline-amber-500";

export const btnAmber =
  "inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-forest-950 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-amber-300 focus-visible:outline-forest-900";

export const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-full border border-forest-200 bg-white/70 px-6 py-3 text-sm font-semibold text-forest-900 transition duration-200 hover:-translate-y-0.5 hover:border-forest-300 hover:bg-white";

export function Pill({
  children,
  tone = "mint",
}: {
  children: ReactNode;
  tone?: "mint" | "amber" | "forest";
}) {
  const tones = {
    mint: "bg-mint-100 text-forest-700",
    amber: "bg-amber-400/15 text-amber-700",
    forest: "bg-forest-700 text-mint-100",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
