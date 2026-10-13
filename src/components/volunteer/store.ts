import { createLocalStore } from "@/lib/local-store";
import { CHECKLIST_KEY, TASKS_KEY, SEED_TASKS, type DeliveryTask } from "./types";

export const tasksStore = createLocalStore<DeliveryTask[]>(
  TASKS_KEY,
  SEED_TASKS,
);

export const checklistStore = createLocalStore<Record<string, boolean>>(
  CHECKLIST_KEY,
  {},
);
