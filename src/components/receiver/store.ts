import { createLocalStore } from "@/lib/local-store";
import { REQUESTS_KEY, SEED_REQUESTS, type FoodRequest } from "./types";

export const requestsStore = createLocalStore<FoodRequest[]>(
  REQUESTS_KEY,
  SEED_REQUESTS,
);
