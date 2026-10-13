"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock,
  Inbox,
  MapPin,
} from "@/components/ui/icons";
import { btnPrimary, card } from "@/components/ui/styles";
import { useLocalStore } from "@/lib/local-store";
import { tasksStore } from "./store";
import type { DeliveryTask } from "./types";

type TabId = "all" | "nearby" | "urgent";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All tasks" },
  { id: "nearby", label: "Nearby" },
  { id: "urgent", label: "Urgent" },
];

function distanceKm(distance: string): number {
  const value = Number.parseFloat(distance);
  if (Number.isNaN(value)) return Infinity;
  return distance.includes("km") ? value : value / 1000;
}

export function AvailableTasks() {
  const toast = useToast();
  const [tasks, setTasks] = useLocalStore(tasksStore);
  const [tab, setTab] = useState<TabId>("all");

  const visible = useMemo(() => {
    const open = tasks.filter((task) => task.status !== "Completed");
    switch (tab) {
      case "nearby":
        return open.filter((task) => distanceKm(task.distance) <= 2);
      case "urgent":
        return open.filter((task) => task.urgent);
      default:
        return open;
    }
  }, [tasks, tab]);

  function accept(task: DeliveryTask) {
    setTasks((prev) =>
      prev.map((item) =>
        item.id === task.id ? { ...item, status: "Claimed" } : item,
      ),
    );
    toast({
      tone: "success",
      title: "Task accepted",
      description: `${task.pickup} → ${task.dropoff} is now yours.`,
    });
  }

  return (
    <section id="tasks" className={`${card} scroll-mt-24 p-6 sm:p-8`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-forest-900">
          Available tasks
        </h2>
        <span className="text-xs font-medium text-charcoal-400">
          {visible.length} nearby
        </span>
      </div>

      <div className="mt-5">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
      </div>

      {visible.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-sage-300 bg-sage-50 px-6 py-12 text-center">
          <span className="grid size-11 place-items-center rounded-full bg-white text-charcoal-400">
            <Inbox className="size-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-forest-900">
            No tasks here
          </p>
          <p className="mt-1 max-w-xs text-xs text-charcoal-600">
            Nothing matches this filter right now. Check back soon for new
            pickups.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {visible.map((task) => (
            <li
              key={task.id}
              className="flex flex-col rounded-2xl border border-sage-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold text-charcoal-400">
                  {task.id}
                </p>
                {task.urgent ? (
                  <Badge tone="red">
                    <AlertTriangle className="size-3.5" />
                    Urgent
                  </Badge>
                ) : (
                  <Badge tone={task.status === "Open" ? "amber" : "forest"}>
                    {task.status}
                  </Badge>
                )}
              </div>

              <div className="mt-3 space-y-1.5">
                <p className="flex items-center gap-2 text-sm font-semibold text-forest-900">
                  <MapPin className="size-4 shrink-0 text-forest-600" />
                  {task.pickup}
                </p>
                <p className="flex items-center gap-2 pl-1 text-charcoal-400">
                  <ArrowRight className="size-3.5" />
                </p>
                <p className="flex items-center gap-2 text-sm font-semibold text-forest-900">
                  <MapPin className="size-4 shrink-0 text-forest-600" />
                  {task.dropoff}
                </p>
              </div>

              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-charcoal-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-forest-600" />
                  {task.window}
                </span>
                <span className="text-sage-300">•</span>
                <span>{task.distance}</span>
                <span className="text-sage-300">•</span>
                <span>{task.items}</span>
              </p>

              {task.status === "Open" ? (
                <button
                  type="button"
                  onClick={() => accept(task)}
                  className={`${btnPrimary} mt-4 w-full`}
                >
                  <Check className="size-4" />
                  Accept task
                </button>
              ) : (
                <p className="mt-4 rounded-xl bg-sage-50 px-3 py-2 text-center text-xs font-semibold text-forest-700">
                  {task.status}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
