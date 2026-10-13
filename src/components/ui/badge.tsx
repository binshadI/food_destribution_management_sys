export type BadgeTone =
  | "mint"
  | "forest"
  | "amber"
  | "orange"
  | "red"
  | "neutral";

const tones: Record<BadgeTone, { pill: string; dot: string }> = {
  mint: { pill: "bg-mint-100 text-forest-700", dot: "bg-forest-500" },
  forest: { pill: "bg-forest-100 text-forest-800", dot: "bg-forest-600" },
  amber: { pill: "bg-amber-300/25 text-amber-700", dot: "bg-amber-500" },
  orange: { pill: "bg-orange-100 text-orange-800", dot: "bg-orange-500" },
  red: { pill: "bg-red-100 text-red-700", dot: "bg-red-500" },
  neutral: { pill: "bg-sage-100 text-charcoal-600", dot: "bg-charcoal-400" },
};

export function Badge({
  tone = "neutral",
  dot = true,
  children,
  className,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone].pill} ${className ?? ""}`}
    >
      {dot ? (
        <span className={`size-1.5 rounded-full ${tones[tone].dot}`} />
      ) : null}
      {children}
    </span>
  );
}