"use client";

import { useMemo } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Banner } from "@/components/ui/banner";
import {
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  Clock,
  Leaf,
  Truck,
  Utensils,
} from "@/components/ui/icons";
import { eyebrow } from "@/components/ui/styles";
import { useLocalStore } from "@/lib/local-store";
import { firstName, useSession } from "@/lib/session";
import { ActiveDelivery } from "./active-delivery";
import { AvailableTasks } from "./available-tasks";
import { ChecklistCard } from "./checklist";
import { ContactsCard } from "./contacts";
import { ImpactBanner } from "./impact-banner";
import { tasksStore } from "./store";

export function VolunteerDashboard() {
  const user = useSession();
  const [tasks] = useLocalStore(tasksStore);

  const activeTask = useMemo(
    () =>
      tasks.find((task) => task.status === "In transit") ??
      tasks.find((task) => task.status === "Claimed"),
    [tasks],
  );

  const openTasks = tasks.filter((task) => task.status === "Open").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <p className={eyebrow}>Volunteer portal overview</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-forest-900 sm:text-4xl">
          Good morning, {firstName(user?.name ?? "there")}.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-charcoal-600 sm:text-base">
          Keep matched donations moving and track your route in real time.
        </p>
      </header>

      <section
        aria-label="Volunteer summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Active deliveries"
          value={activeTask ? "1" : "0"}
          support={activeTask ? "In transit now" : "No active route"}
          supportTone={activeTask ? "green" : "muted"}
          tone="amber"
          icon={Truck}
        />
        <StatCard
          label="Completed"
          value="48"
          support="+5 this week"
          supportTone="green"
          tone="forest"
          icon={CheckCircle}
        />
        <StatCard
          label="Meals delivered"
          value="1,320"
          support="Since joining"
          tone="mint"
          icon={Utensils}
        />
        <StatCard
          label="Distance covered"
          value="210 km"
          support="By bike & car"
          tone="forest"
          icon={Leaf}
        />
      </section>

      <Banner
        icon={<AlertTriangle className="size-[18px]" />}
        title="New delivery assigned"
        description="Corner Bakery has 6 trays of bread and pastry to collect for Hope Street Pantry before 19:30 today."
        action="View route"
        tone="amber"
        onAction={() => {
          document
            .getElementById("active")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      {activeTask ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <ActiveDelivery task={activeTask} />

          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <ContactsCard />
            <ChecklistCard />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-sage-200 bg-white px-5 py-8 text-center text-sm text-charcoal-600">
          No active delivery right now — accept a task below to get moving.
        </div>
      )}

      <AvailableTasks />

      <ImpactBanner />

      <div className="flex items-center gap-2 px-1 text-xs text-charcoal-400">
        <ClipboardList className="size-3.5" />
        {openTasks} open task{openTasks === 1 ? "" : "s"} near you.
        <span className="mx-1 text-sage-300">•</span>
        <Clock className="size-3.5" />
        Dashboard last synced a moment ago.
      </div>
    </div>
  );
}
