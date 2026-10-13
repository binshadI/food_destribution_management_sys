"use client";

import { createLocalStore, useLocalStore } from "./local-store";

export type UserRole = "donor" | "receiver" | "volunteer" | "admin";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

const SESSION_KEY = "second-serving:session";
const HOME_BY_ROLE: Record<UserRole, string> = {
  donor: "/donor",
  receiver: "/receiver",
  volunteer: "/volunteer",
  admin: "/admin",
};

const userStore = createLocalStore<SessionUser | null>(SESSION_KEY, null);

export function setSession(user: SessionUser | null) {
  userStore.set(user);
}

export function clearSession() {
  userStore.set(null);
}

export function useSession(): SessionUser | null {
  const [user] = useLocalStore(userStore);
  return user;
}

export function roleHomePath(role: UserRole): string {
  return HOME_BY_ROLE[role];
}

export function roleLabel(role: UserRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? "" : "";
  return (first + last).toUpperCase();
}
