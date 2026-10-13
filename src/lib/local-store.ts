"use client";

import { useSyncExternalStore } from "react";

type Listener = () => void;

export type LocalStore<T> = {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (next: T | ((prev: T) => T)) => void;
};

export function createLocalStore<T>(key: string, fallback: T): LocalStore<T> {
  let raw: string | null = null;
  let value: T = fallback;
  let initialized = false;
  const listeners = new Set<Listener>();

  function read(): T {
    let nextRaw: string | null = null;
    try {
      nextRaw = window.localStorage.getItem(key);
    } catch {
      nextRaw = null;
    }
    if (initialized && nextRaw === raw) return value;
    raw = nextRaw;
    initialized = true;
    try {
      value = nextRaw === null ? fallback : (JSON.parse(nextRaw) as T);
    } catch {
      value = fallback;
    }
    return value;
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) {
          initialized = false;
          read();
          listener();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getSnapshot: read,
    getServerSnapshot: () => fallback,
    set(next) {
      const current = read();
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(current) : next;
      raw = null;
      try {
        const serialized = JSON.stringify(resolved);
        window.localStorage.setItem(key, serialized);
        raw = serialized;
      } catch {
        /* storage unavailable — keep in-memory value */
      }
      value = resolved;
      initialized = true;
      listeners.forEach((listener) => listener());
    },
  };
}

export function useLocalStore<T>(store: LocalStore<T>) {
  const value = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  return [value, store.set] as const;
}
