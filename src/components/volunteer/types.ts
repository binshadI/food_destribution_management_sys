import type { BadgeTone } from "@/components/ui/badge";

export type TaskStatus = "Open" | "Claimed" | "In transit" | "Completed";

export type DeliveryTask = {
  id: string;
  pickup: string;
  dropoff: string;
  distance: string;
  window: string;
  items: string;
  status: TaskStatus;
  urgent: boolean;
  pickupAddress?: string;
  dropoffArea?: string;
  mine?: boolean;
};

export type Contact = {
  name: string;
  role: string;
  detail: string;
};

export type ChecklistItem = {
  id: string;
  label: string;
};

export const CHECKLIST_KEY = "second-serving:volunteer-checklist";

export const STATUS_TONES: Record<TaskStatus, BadgeTone> = {
  Open: "amber",
  Claimed: "forest",
  "In transit": "orange",
  Completed: "mint",
};

export const CONTACTS: Contact[] = [
  {
    name: "Alex D.",
    role: "Donor · Green Table Kitchen",
    detail: "Back kitchen entrance",
  },
  {
    name: "Priya S.",
    role: "Receiver · Northgate Community Hall",
    detail: "Loading bay, side door",
  },
];

export const CHECKLIST: ChecklistItem[] = [
  { id: "insulated", label: "Insulated bags clean and packed" },
  { id: "labels", label: "Confirm food labels and use-by times" },
  { id: "sealed", label: "Check containers are sealed for transport" },
  { id: "handover", label: "Sign donor handover sheet" },
  { id: "photo", label: "Take a drop-off confirmation photo" },
];

