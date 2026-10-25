"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ProgressTimeline, type TimelineStep } from "@/components/ui/progress-timeline";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import {
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Utensils,
} from "@/components/ui/icons";
import { btnOutline, card, helperText } from "@/components/ui/styles";
import { formatServings, type FoodRequest, type RequestStatus } from "./types";

const ORDER: Record<RequestStatus, number> = {
  Pending: 0,
  Matched: 1,
  Ready: 2,
  Received: 3,
};

function buildSteps(request: FoodRequest): TimelineStep[] {
  const index = ORDER[request.status];
  const state = (at: number): TimelineStep["state"] => {
    if (index > at) return "done";
    if (index === at) return "active";
    return "upcoming";
  };

  return [
    { label: "Request posted", detail: "Today · 09:12", state: "done" },
    {
      label: "Matched with donor",
      detail: index >= 1 ? request.donor : "Finding a nearby donor",
      state: state(1),
    },
    {
      label: "Volunteer assigned",
      detail:
        index >= 2
          ? `${request.volunteer ?? "A volunteer"} · accepted`
          : "Assigning soon",
      state: state(2),
    },
    {
      label: "Out for delivery",
      detail: index >= 3 ? "Arrived" : index === 2 ? "Awaiting pickup" : "ETA 17:35",
      state: state(3),
    },
    { label: "Received", detail: request.area, state: state(4) },
  ];
}

export function ActiveRequestCard({ request }: { request: FoodRequest }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);

  return (
    <section id="active" className={`${card} scroll-mt-24 p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-forest-900">
          Active request
        </h2>
        <Badge tone={request.status === "Received" ? "mint" : "forest"}>
          {request.status}
        </Badge>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal-400">
        Tracking
      </p>
      <div className="mt-4">
        <ProgressTimeline steps={buildSteps(request)} />
      </div>

      <div className="mt-2 rounded-xl bg-sage-50 p-4">
        <p className="text-sm font-semibold text-forest-900">{request.food}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-charcoal-600">
          <span className="flex items-center gap-1.5">
            <Utensils className="size-3.5 text-forest-600" />
            {formatServings(request.servings)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-forest-600" />
            {request.neededBy}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-forest-600" />
            {request.area}
          </span>
        </p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Avatar name={request.donor} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-forest-900">
            {request.donor}
          </p>
          <p className="truncate text-xs text-charcoal-400">Matched donor</p>
        </div>
        <button
          type="button"
          aria-label={`Call ${request.donor}`}
          onClick={() =>
            toast({
              tone: "info",
              title: `Calling ${request.donor}`,
              description: "Opening the donor's contact number.",
            })
          }
          className="grid size-9 shrink-0 place-items-center rounded-full border border-sage-200 text-forest-700 transition hover:bg-sage-100"
        >
          <Phone className="size-4" />
        </button>
      </div>

      {request.volunteer ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-mint-50 px-3 py-2.5">
          <Avatar name={request.volunteer} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-forest-900">
              {request.volunteer}
            </p>
            <p className="truncate text-xs text-charcoal-400">
              Volunteer accepted this delivery
            </p>
          </div>
          <Badge tone="forest">Assigned</Badge>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${btnOutline} mt-5 w-full`}
      >
        View request details
        <ArrowRight className="size-4" />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Request details"
      >
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              Food & quantity
            </dt>
            <dd className="mt-1 font-semibold text-forest-900">
              {formatServings(request.servings)} · {request.food}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              Matched donor
            </dt>
            <dd className="mt-1 flex items-center gap-2 font-semibold text-forest-900">
              <Avatar name={request.donor} className="size-8" />
              {request.donor}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              Delivery
            </dt>
            <dd className="mt-1 text-charcoal-600">
              {request.neededBy} · {request.area}
            </dd>
          </div>
          {request.note ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
                Notes
              </dt>
              <dd className="mt-1 text-charcoal-600">{request.note}</dd>
            </div>
          ) : null}
        </dl>
        <p className={`${helperText} mt-5`}>
          Request {request.id} · {request.urgency} priority
        </p>
      </Modal>
    </section>
  );
}

export function VerificationCard() {
  const toast = useToast();

  return (
    <section id="verification" className={`${card} scroll-mt-24 p-6`}>
      <span className="grid size-9 place-items-center rounded-full bg-mint-100 text-forest-700">
        <ShieldCheck className="size-5" />
      </span>
      <h2 className="mt-3 text-lg font-semibold text-forest-900">
        Verified recipient
      </h2>
      <p className="mt-1 text-sm text-charcoal-600">
        Your organisation is verified, so matched donors can hand over food with
        confidence.
      </p>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-charcoal-400">Status</dt>
          <dd>
            <Badge tone="mint">Approved</Badge>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-charcoal-400">Registration</dt>
          <dd className="font-medium text-forest-900">NGO-2048-SS</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-charcoal-400">Verified on</dt>
          <dd className="font-medium text-forest-900">12 Aug 2025</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() =>
          toast({
            tone: "info",
            title: "Verification details",
            description: "Your compliance documents are up to date.",
          })
        }
        className={`${btnOutline} mt-5 w-full`}
      >
        Manage verification
      </button>
    </section>
  );
}
