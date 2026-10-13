"use client";

import { Badge } from "@/components/ui/badge";
import { ProgressTimeline, type TimelineStep } from "@/components/ui/progress-timeline";
import { useToast } from "@/components/ui/toast";
import { Check, Clock, MapPin, Navigation, Phone } from "@/components/ui/icons";
import { btnPrimary, card } from "@/components/ui/styles";
import { RouteMap } from "./route-map";
import type { DeliveryTask } from "./types";

const STEPS: TimelineStep[] = [
  { label: "Assigned", detail: "Today · 16:50", state: "done" },
  { label: "Picked up", detail: "Today · 17:34", state: "done" },
  { label: "In transit", detail: "ETA 17:50", state: "active" },
  { label: "Delivered", detail: "Northgate Hall", state: "upcoming" },
];

export function ActiveDelivery({ task }: { task: DeliveryTask }) {
  const toast = useToast();

  return (
    <section id="active" className={`${card} scroll-mt-24 p-6 sm:p-7`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-forest-900">
            Active delivery
          </h2>
          <p className="mt-0.5 text-xs text-charcoal-400">
            {task.id} · {task.items}
          </p>
        </div>
        <Badge tone="orange">{task.status}</Badge>
      </div>

      <div className="mt-6">
        <ProgressTimeline steps={STEPS} />
      </div>

      <div className="mt-2">
        <RouteMap pickup={task.pickup} dropoff={task.dropoff} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-sage-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal-400">
            Pickup
          </p>
          <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-forest-900">
            <MapPin className="size-4 text-forest-600" />
            {task.pickup}
          </p>
          <p className="mt-1 flex items-center gap-2 text-xs text-charcoal-600">
            <Clock className="size-3.5 text-forest-600" />
            Today · 17:30
          </p>
        </div>
        <div className="rounded-xl bg-sage-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal-400">
            Drop-off
          </p>
          <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-forest-900">
            <MapPin className="size-4 text-forest-600" />
            {task.dropoff}
          </p>
          <p className="mt-1 flex items-center gap-2 text-xs text-charcoal-600">
            <Clock className="size-3.5 text-forest-600" />
            ETA 17:50 · {task.distance}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            toast({
              tone: "success",
              title: "Delivery marked complete",
              description: "Thanks for keeping good food moving.",
            })
          }
          className={`${btnPrimary} sm:flex-1`}
        >
          <Check className="size-4" />
          Mark as delivered
        </button>
        <button
          type="button"
          onClick={() =>
            toast({
              tone: "info",
              title: "Opening navigation",
              description: `Turn-by-turn directions to ${task.dropoff}.`,
            })
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-sage-300 bg-white px-5 py-2.5 text-sm font-semibold text-forest-900 transition hover:border-forest-300 hover:bg-sage-50 sm:flex-1"
        >
          <Navigation className="size-4" />
          Start navigation
        </button>
      </div>

      <button
        type="button"
        onClick={() =>
          toast({
            tone: "info",
            title: `Calling ${task.dropoff}`,
            description: "Opening the receiver's contact number.",
          })
        }
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 underline-offset-4 hover:underline"
      >
        <Phone className="size-4" />
        Call receiver
      </button>
    </section>
  );
}
