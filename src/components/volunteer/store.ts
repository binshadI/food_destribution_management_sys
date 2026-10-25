import { createLocalStore } from "@/lib/local-store";
import { CHECKLIST_KEY } from "./types";

export const checklistStore = createLocalStore<Record<string, boolean>>(
  CHECKLIST_KEY,
  {},
);
