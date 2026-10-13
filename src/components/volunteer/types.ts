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
export const TASKS_KEY = "second-serving:volunteer-tasks";

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

export const SEED_TASKS: DeliveryTask[] = [
  {
    id: "SS-TK-2011",
    pickup: "Green Table Kitchen",
    dropoff: "Northgate Community Hall",
    distance: "2.4 km",
    window: "Today · 17:30 – 18:00",
    items: "3 crates · 80 meals",
    status: "In transit",
    urgent: false,
  },
  {
    id: "SS-TK-2012",
    pickup: "Corner Bakery",
    dropoff: "Hope Street Pantry",
    distance: "1.1 km",
    window: "Today · 19:00 – 19:30",
    items: "6 trays · bread & pastry",
    status: "Open",
    urgent: true,
  },
  {
    id: "SS-TK-2013",
    pickup: "Harbour Hotel",
    dropoff: "Riverside Shelter",
    distance: "3.8 km",
    window: "Tomorrow · 09:00 – 09:45",
    items: "4 crates · 60 meals",
    status: "Open",
    urgent: false,
  },
  {
    id: "SS-TK-2014",
    pickup: "Maple Grocers",
    dropoff: "St. Anne's Kitchen",
    distance: "900 m",
    window: "Tomorrow · 11:15 – 11:45",
    items: "10 boxes · fresh produce",
    status: "Open",
    urgent: false,
  },
];
