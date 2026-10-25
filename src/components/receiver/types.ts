import type { BadgeTone } from "@/components/ui/badge";

export type RequestStatus = "Pending" | "Matched" | "Ready" | "Received";

export type Urgency = "Low" | "Normal" | "High";

export type RequestCategory = "Cooked" | "Raw" | "Packaged";

export type FoodRequest = {
  id: string;
  food: string;
  category: RequestCategory;
  servings: number;
  neededBy: string;
  urgency: Urgency;
  area: string;
  status: RequestStatus;
  donor: string;
  volunteer?: string | null;
  note?: string;
};

export type NewRequestInput = {
  food: string;
  category: RequestCategory;
  servings: number;
  date: string;
  time: string;
  neededBy: string;
  urgency: Urgency;
  area: string;
  note: string;
};

export const CATEGORIES: RequestCategory[] = ["Cooked", "Raw", "Packaged"];

export const URGENCIES: Urgency[] = ["Low", "Normal", "High"];

export const REQUEST_DRAFT_KEY = "second-serving:receiver-request-draft";
export const STATUS_TONES: Record<RequestStatus, BadgeTone> = {
  Pending: "amber",
  Matched: "forest",
  Ready: "orange",
  Received: "mint",
};

export function formatServings(servings: number): string {
  return `${servings} serving${servings === 1 ? "" : "s"}`;
}

export function formatNeededBy(date: string, time: string): string {
  if (!date) return time ? `Today · ${time}` : "Not set";
  const parsed = new Date(`${date}T${time || "00:00"}:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(parsed);
  target.setHours(0, 0, 0, 0);
  const days = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  let label: string;
  if (days === 0) label = "Today";
  else if (days === 1) label = "Tomorrow";
  else
    label = parsed.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

  return time ? `${label} · ${time}` : label;
}
