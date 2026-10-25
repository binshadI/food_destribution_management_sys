"use client";

import { useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Banner } from "@/components/ui/banner";
import { useToast } from "@/components/ui/toast";
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
import { firstName, useSession } from "@/lib/session";
import { ActiveDelivery } from "./active-delivery";
import { AvailableTasks } from "./available-tasks";
import { ChecklistCard } from "./checklist";
import { ContactsCard } from "./contacts";
import { ImpactBanner } from "./impact-banner";
import type { DeliveryTask } from "./types";

function taskId(task: DeliveryTask): string {
  return task.id.replace(/\D/g, "");
}

export function VolunteerDashboard() {
  const toast = useToast();
  const user = useSession();
  const [tasks, setTasks] = useState<DeliveryTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/deliveries?userId=${user.id}`);
        const data = (await response.json().catch(() => null)) as {
          tasks?: DeliveryTask[];
          error?: string;
        } | null;
        if (cancelled) return;
        if (!response.ok || !data) {
          throw new Error(data?.error ?? "Could not load tasks.");
        }
        setTasks(data.tasks ?? []);
      } catch (error: unknown) {
        if (cancelled) return;
        setTasks([]);
        toast({
          tone: "error",
          title: "Couldn't load tasks",
          description:
            error instanceof Error && error.message
              ? error.message
              : "Something went wrong.",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTasks();
    return () => {
      cancelled = true;
    };
  }, [user, refreshToken, toast]);

  async function updateStatus(
    task: DeliveryTask,
    status: "accepted" | "picked_up" | "delivered",
    success: { title: string; description: string },
  ) {
    if (!user) return;
    try {
      const response = await fetch(
        `/api/deliveries/${taskId(task)}/status`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, status }),
        },
      );
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok || !data) {
        throw new Error(data?.error ?? "Could not update the task.");
      }
      toast({ tone: "success", ...success });
      setRefreshToken((token) => token + 1);
    } catch (error: unknown) {
      toast({
        tone: "error",
        title: "Update failed",
        description:
          error instanceof Error && error.message
            ? error.message
            : "Something went wrong.",
      });
    }
  }

  function accept(task: DeliveryTask) {
    void updateStatus(task, "accepted", {
      title: "Task accepted",
      description: `${task.pickup} → ${task.dropoff} is now yours.`,
    });
  }

  function advance(
    task: DeliveryTask,
    status: "picked_up" | "delivered",
  ) {
    void updateStatus(
      task,
      status,
      status === "picked_up"
        ? {
            title: "Pickup confirmed",
            description: `${task.items} collected from ${task.pickup}.`,
          }
        : {
            title: "Delivery marked complete",
            description: "Thanks for keeping good food moving.",
          },
    );
  }

  const activeTask = useMemo(
    () =>
      tasks.find((task) => task.mine && task.status === "In transit") ??
      tasks.find((task) => task.mine && task.status === "Claimed"),
    [tasks],
  );

  const openTasks = tasks.filter((task) => task.status === "Open").length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

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
          value={String(completedTasks)}
          support="Tasks finished"
          supportTone={completedTasks > 0 ? "green" : "muted"}
          tone="forest"
          icon={CheckCircle}
        />
        <StatCard
          label="Open tasks"
          value={String(openTasks)}
          support="Waiting for a volunteer"
          supportTone={openTasks > 0 ? "green" : "muted"}
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

      {activeTask ? (
        <Banner
          icon={<AlertTriangle className="size-[18px]" />}
          title="Delivery assigned"
          description={`${activeTask.pickup} has ${activeTask.items} ready for ${activeTask.dropoff} before ${activeTask.window.toLowerCase()}.`}
          action="View route"
          tone="amber"
          onAction={() => {
            document
              .getElementById("active")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      ) : openTasks > 0 ? (
        <Banner
          icon={<AlertTriangle className="size-[18px]" />}
          title="New deliveries available"
          description={`${openTasks} matched pickup${openTasks === 1 ? "" : "s"} waiting for a volunteer. Accept one below to get moving.`}
          action="View tasks"
          tone="amber"
          onAction={() => {
            document
              .getElementById("tasks")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      ) : null}

      {activeTask ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <ActiveDelivery task={activeTask} onAdvance={advance} />

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

      <AvailableTasks tasks={tasks} loading={loading} onAccept={accept} />

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
