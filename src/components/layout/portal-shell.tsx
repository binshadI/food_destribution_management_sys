"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type ReactNode,
} from "react";
import { useToast } from "@/components/ui/toast";
import {
  Bell,
  BrandMark,
  Calendar,
  ChevronDown,
  ClipboardList,
  Close,
  Grid,
  HeartHandshake,
  HelpCircle,
  Leaf,
  Menu,
  MessageCircle,
  Settings,
  ShieldCheck,
  Truck,
} from "@/components/ui/icons";
import { btnQuiet } from "@/components/ui/styles";
import {
  clearSession,
  initials,
  roleHomePath,
  roleLabel,
  useSession,
  type UserRole,
} from "@/lib/session";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  soon?: boolean;
};

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  donor: [
    { label: "Overview", href: "/donor", icon: Grid },
    { label: "My listings", href: "/donor#listings", icon: ClipboardList },
    { label: "Pickup schedule", href: "/donor#pickup", icon: Calendar },
    { label: "My impact", href: "/donor#impact", icon: HeartHandshake },
    { label: "Messages", href: "#", icon: MessageCircle, soon: true },
    { label: "Settings", href: "#", icon: Settings, soon: true },
  ],
  receiver: [
    { label: "Overview", href: "/receiver", icon: Grid },
    { label: "My requests", href: "/receiver#requests", icon: ClipboardList },
    { label: "Track request", href: "/receiver#active", icon: HeartHandshake },
    { label: "Verification", href: "/receiver#verification", icon: ShieldCheck },
  ],
  volunteer: [
    { label: "Overview", href: "/volunteer", icon: Grid },
    { label: "Active delivery", href: "/volunteer#active", icon: Truck },
    { label: "Available tasks", href: "/volunteer#tasks", icon: ClipboardList },
    { label: "My impact", href: "/volunteer#impact", icon: HeartHandshake },
  ],
  admin: [
    { label: "Overview", href: "/admin", icon: Grid },
    { label: "Users", href: "#", icon: HeartHandshake, soon: true },
    { label: "Audit log", href: "#", icon: ClipboardList, soon: true },
  ],
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const toast = useToast();
  const router = useRouter();
  const user = useSession();
  const role: UserRole = user?.role ?? "donor";
  const home = roleHomePath(role);
  const [selected, setSelected] = useState<string | null>(null);
  const activeHref = selected ?? home;

  function signOut() {
    clearSession();
    onNavigate?.();
    router.push("/login");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 pb-6 pt-6">
        <span className="grid size-9 place-items-center rounded-full bg-forest-700 text-mint-100">
          <BrandMark className="size-5" />
        </span>
        <span className="text-lg font-bold tracking-tight text-forest-900">
          Second Serving
        </span>
      </div>

      <div className="px-6 pb-5">
        <div className="rounded-xl border border-sage-200 bg-sage-50 px-4 py-3">
          <p className="truncate text-sm font-semibold text-forest-900">
            {user?.name ?? "Guest"}
          </p>
          <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-charcoal-400">
            {roleLabel(role)} account
          </p>
        </div>
      </div>

      <nav
        aria-label={`${roleLabel(role)} portal`}
        className="flex-1 overflow-y-auto px-3"
      >
        <ul className="space-y-1">
          {NAV_BY_ROLE[role].map((item) => {
            const Icon = item.icon;
            const active = !item.soon && activeHref === item.href;
            const baseClass =
              "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition";
            const stateClass = active
              ? "bg-mint-100 text-forest-800"
              : "text-charcoal-600 hover:bg-sage-100 hover:text-forest-800";

            if (item.soon) {
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      toast({
                        tone: "info",
                        title: `${item.label} is coming soon`,
                        description:
                          "We're still building this part of the portal.",
                      });
                      onNavigate?.();
                    }}
                    className={`${baseClass} ${stateClass}`}
                  >
                    <Icon className="size-[18px] shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-charcoal-400">
                      Soon
                    </span>
                  </button>
                </li>
              );
            }

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => {
                    setSelected(item.href);
                    onNavigate?.();
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`${baseClass} ${stateClass}`}
                >
                  <Icon className="size-[18px] shrink-0" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-3 p-4">
        <div className="rounded-2xl border border-mint-200 bg-mint-50 p-4">
          <span className="grid size-8 place-items-center rounded-full bg-white text-forest-600">
            <Leaf className="size-4" />
          </span>
          <p className="mt-3 text-sm font-semibold text-forest-900">
            Good food. Shared.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-charcoal-600">
            Every listing you add keeps good food out of landfill and puts a
            warm meal on someone&apos;s table.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            toast({
              tone: "info",
              title: "Help center",
              description: "Reach our team at support@secondserving.org.",
            })
          }
          className={`${btnQuiet} w-full justify-start`}
        >
          <HelpCircle className="size-[18px]" />
          Help center
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-sage-200 bg-white px-3 py-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-forest-100 text-sm font-semibold text-forest-700">
            {user ? initials(user.name) : "?"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-forest-900">
              {user?.name ?? "Guest"}
            </p>
            <p className="truncate text-xs text-charcoal-400">
              {user?.email ?? "Not signed in"}
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            title="Sign out"
            aria-label="Sign out"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-charcoal-400 transition hover:bg-sage-100 hover:text-forest-800"
          >
            <ChevronDown className="size-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}

let cachedToday: string | null = null;

function getToday(): string {
  if (cachedToday === null) {
    cachedToday = new Date().toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }
  return cachedToday;
}

const subscribeNoop = () => () => {};
const getServerEmpty = () => "";

export function PortalShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useSession();
  const [open, setOpen] = useState(false);
  const today = useSyncExternalStore(subscribeNoop, getToday, getServerEmpty);
  const role: UserRole = user?.role ?? "donor";

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user, router]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-dvh bg-sage-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-sage-200 bg-white lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full bg-forest-950/40"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col border-r border-sage-200 bg-white shadow-lift">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 grid size-9 place-items-center rounded-full text-charcoal-400 transition hover:bg-sage-100 hover:text-forest-800"
            >
              <Close className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-sage-200 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              className="grid size-10 place-items-center rounded-xl border border-sage-200 text-forest-800 transition hover:bg-sage-100 lg:hidden"
            >
              <Menu className="size-5" />
            </button>

            <nav
              aria-label="Breadcrumb"
              className="min-w-0 flex-1 truncate text-sm"
            >
              <span className="text-charcoal-400">
                {roleLabel(role)} portal
              </span>
              <span className="mx-1.5 text-sage-300">/</span>
              <span className="font-semibold text-forest-900">Overview</span>
            </nav>

            <span className="hidden text-xs font-medium text-charcoal-400 sm:block">
              {today}
            </span>

            <button
              type="button"
              aria-label="Notifications"
              className="relative grid size-10 place-items-center rounded-xl border border-sage-200 text-forest-800 transition hover:bg-sage-100"
            >
              <Bell className="size-5" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-amber-400 ring-2 ring-white" />
            </button>

            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-full bg-forest-100 text-sm font-semibold text-forest-700"
            >
              {user ? initials(user.name) : "?"}
            </span>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
