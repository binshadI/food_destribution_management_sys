import type { ComponentType } from "react";

type StatTone = "forest" | "amber" | "red" | "mint";

const bubbleTones: Record<StatTone, string> = {
  forest: "bg-sage-100 text-forest-700",
  mint: "bg-mint-100 text-forest-700",
  amber: "bg-amber-300/25 text-amber-700",
  red: "bg-red-100 text-red-600",
};

export function StatCard({
  label,
  value,
  support,
  supportTone = "muted",
  tone = "forest",
  icon: Icon,
}: {
  label: string;
  value: string;
  support: string;
  supportTone?: "green" | "muted";
  tone?: StatTone;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <article className="rounded-2xl border border-sage-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-charcoal-600">{label}</p>
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full ${bubbleTones[tone]}`}
        >
          <Icon className="size-[18px]" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-forest-900">
        {value}
      </p>
      <p
        className={`mt-1 text-xs font-medium ${
          supportTone === "green" ? "text-forest-600" : "text-charcoal-400"
        }`}
      >
        {support}
      </p>
    </article>
  );
}