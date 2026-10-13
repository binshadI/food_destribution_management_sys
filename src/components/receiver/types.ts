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
  note?: string;
};

export type NewRequestInput = {
  food: string;
  category: RequestCategory;
  servings: number;
  neededBy: string;
  urgency: Urgency;
  area: string;
  note: string;
};

export const CATEGORIES: RequestCategory[] = ["Cooked", "Raw", "Packaged"];

export const URGENCIES: Urgency[] = ["Low", "Normal", "High"];

export const REQUEST_DRAFT_KEY = "second-serving:receiver-request-draft";
export const REQUESTS_KEY = "second-serving:receiver-requests";

export const STATUS_TONES: Record<RequestStatus, BadgeTone> = {
  Pending: "amber",
  Matched: "forest",
  Ready: "orange",
  Received: "mint",
};

export const SEED_REQUESTS: FoodRequest[] = [
  {
    id: "SS-RQ-0001",
    food: "Vegetable biryani meals",
    category: "Cooked",
    servings: 80,
    neededBy: "Today · 18:00",
    urgency: "High",
    area: "Northgate Community Hall",
    status: "Matched",
    donor: "Green Table Kitchen",
  },
  {
    id: "SS-RQ-0002",
    food: "Fresh produce boxes",
    category: "Raw",
    servings: 40,
    neededBy: "Tomorrow · 10:00",
    urgency: "Normal",
    area: "Riverside Shelter",
    status: "Pending",
    donor: "Awaiting match",
  },
  {
    id: "SS-RQ-0003",
    food: "Bread & pastry packs",
    category: "Packaged",
    servings: 25,
    neededBy: "Fri 11 Oct · 09:00",
    urgency: "Low",
    area: "Hope Street Pantry",
    status: "Ready",
    donor: "Corner Bakery",
  },
  {
    id: "SS-RQ-0004",
    food: "Hot evening meals",
    category: "Cooked",
    servings: 60,
    neededBy: "Mon 14 Oct · 17:30",
    urgency: "Normal",
    area: "Northgate Community Hall",
    status: "Received",
    donor: "Harbour Hotel",
  },
];

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
