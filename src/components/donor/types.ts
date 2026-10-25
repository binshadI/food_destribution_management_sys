export type ListingStatus =
  | "Available"
  | "Matched"
  | "Delivered"
  | "Pending"
  | "Expired";

export type Listing = {
  id: string;
  food: string;
  quantity: string;
  expiry: string;
  receiver: string;
  volunteer?: string | null;
  status: ListingStatus;
  category?: string;
};

export const DRAFT_KEY = "second-serving:draft";

export const UNIT_LABELS: Record<string, string> = {
  Portions: "portions",
  Kilograms: "kg",
  Boxes: "boxes",
  Packs: "packs",
};

export function formatExpiry(value: string | Date): string {
  const date =
    typeof value === "string"
      ? new Date(value.length <= 10 ? `${value}T00:00:00` : value)
      : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const days = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days > 1 && days <= 6) return `In ${days} days`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
