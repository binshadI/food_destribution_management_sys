import type { ListingStatus } from "./types";

const tones: Record<ListingStatus, string> = {
  Available: "bg-mint-100 text-forest-700",
  Matched: "bg-amber-400/15 text-amber-700",
  Delivered: "bg-forest-100 text-forest-700",
  Pending: "bg-amber-300/25 text-amber-700",
  Expired: "bg-charcoal-100 text-charcoal-500",
};

const dots: Record<ListingStatus, string> = {
  Available: "bg-forest-500",
  Matched: "bg-amber-500",
  Delivered: "bg-forest-600",
  Pending: "bg-amber-500",
  Expired: "bg-charcoal-400",
};

export function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[status]}`}
    >
      <span className={`size-1.5 rounded-full ${dots[status]}`} />
      {status}
    </span>
  );
}
