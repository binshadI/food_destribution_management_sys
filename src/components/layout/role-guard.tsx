"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  roleHomePath,
  roleLabel,
  useSession,
  type UserRole,
} from "@/lib/session";

const ROLE_BY_PREFIX: { prefix: string; role: UserRole }[] = [
  { prefix: "/donor", role: "donor" },
  { prefix: "/receiver", role: "receiver" },
  { prefix: "/volunteer", role: "volunteer" },
  { prefix: "/admin", role: "admin" },
];

function requiredRole(pathname: string): UserRole | null {
  return (
    ROLE_BY_PREFIX.find((entry) => pathname.startsWith(entry.prefix))?.role ??
    null
  );
}

export function RoleGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSession();
  const role = requiredRole(pathname);

  const mismatched = Boolean(user && role && user.role !== role);

  useEffect(() => {
    if (mismatched && user && role) {
      router.replace(roleHomePath(user.role));
    }
  }, [mismatched, user, role, router]);

  if (mismatched && user && role) {
    return (
      <div className="grid min-h-dvh place-items-center bg-sage-50 px-5">
        <div className="max-w-sm rounded-2xl border border-sage-200 bg-white p-6 text-center shadow-soft">
          <p className="text-sm font-semibold text-forest-900">
            Wrong portal for this account
          </p>
          <p className="mt-2 text-sm text-charcoal-600">
            {user.email} is a {roleLabel(user.role).toLowerCase()} account.
            Taking you to the {roleLabel(user.role).toLowerCase()} portal…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
