"use client";

import { card, eyebrow } from "@/components/ui/styles";
import { initials, roleLabel, useSession } from "@/lib/session";

export function RoleOverview({
  eyebrowText,
  title,
  description,
}: {
  eyebrowText: string;
  title: string;
  description: string;
}) {
  const user = useSession();
  const role = user?.role ?? "donor";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className={eyebrow}>{eyebrowText}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-forest-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-charcoal-600 sm:text-base">
          {description}
        </p>
      </header>

      <section className={`${card} p-6`}>
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-forest-100 text-lg font-semibold text-forest-700">
            {user ? initials(user.name) : "?"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-forest-900">
              {user?.name ?? "Guest"}
            </p>
            <p className="truncate text-sm text-charcoal-500">
              {user?.email ?? "Not signed in"}
            </p>
            <span className="mt-1.5 inline-flex items-center rounded-full bg-mint-100 px-3 py-0.5 text-xs font-semibold text-forest-700">
              {roleLabel(role)} account
            </span>
          </div>
        </div>

        <p className="mt-6 rounded-xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-charcoal-600">
          This portal is being built. Your sign-in worked and your details were
          loaded fresh from the database.
        </p>
      </section>
    </div>
  );
}
