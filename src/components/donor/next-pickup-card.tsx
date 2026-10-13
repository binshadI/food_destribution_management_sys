"use client";

import { useToast } from "@/components/ui/toast";
import {
  ArrowRight,
  Box,
  Clock,
  Leaf,
  MapPin,
  Phone,
  ShieldCheck,
  Utensils,
} from "@/components/ui/icons";
import { btnOutline, card, helperText } from "@/components/ui/styles";
import { StatusBadge } from "./status-badge";

export function NextPickupCard({
  onViewDetails,
}: {
  onViewDetails: () => void;
}) {
  const toast = useToast();

  return (
    <section className={`${card} p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-forest-900">Next pickup</h2>
        <StatusBadge status="Matched" />
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal-400">
        Scheduled
      </p>
      <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-forest-900">
        <Clock className="size-4 text-forest-600" />
        Today · 17:30 – 18:00
      </p>

      <div className="mt-4 rounded-xl bg-sage-50 p-4">
        <p className="text-sm font-semibold text-forest-900">
          Meals for Hope Shelter
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal-600">
          <ShieldCheck className="size-3.5 text-forest-600" />
          <MapPin className="size-3.5 text-forest-600" />
          Verified partner · 2.1 km away
        </p>
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-forest-800">
          <Utensils className="size-4 text-forest-600" />3 meals
          <span className="text-sage-300">•</span>
          <Box className="size-4 text-forest-600" />3 crates
        </p>
      </div>

      <div className="my-4 h-px bg-sage-200" />

      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal-400">
        Delivery details
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-forest-100 text-sm font-semibold text-forest-700">
          JM
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-forest-900">
            Jordan M.
          </p>
          <p className="truncate text-xs text-charcoal-400">
            Assigned volunteer
          </p>
        </div>
        <button
          type="button"
          aria-label="Call Jordan M."
          onClick={() =>
            toast({
              tone: "info",
              title: "Calling Jordan M.",
              description: "Opening the volunteer's contact number.",
            })
          }
          className="grid size-9 place-items-center rounded-full border border-sage-200 text-forest-700 transition hover:bg-sage-100"
        >
          <Phone className="size-4" />
        </button>
      </div>

      <p className={`${helperText} mt-4`}>
        Please have the meals cooled, labelled and ready at the back entrance
        for 17:30.
      </p>

      <button
        type="button"
        onClick={onViewDetails}
        className={`${btnOutline} mt-5 w-full`}
      >
        View pickup details
        <ArrowRight className="size-4" />
      </button>
    </section>
  );
}

export function ImpactCard() {
  return (
    <section className="rounded-2xl border border-mint-200 bg-mint-50 p-6">
      <span className="grid size-9 place-items-center rounded-full bg-white text-forest-600">
        <Leaf className="size-5" />
      </span>
      <h2 className="mt-3 text-lg font-semibold text-forest-900">
        Your surplus is doing good.
      </h2>
      <p className="mt-1 text-sm text-charcoal-600">
        Since joining, your kitchen has turned surplus into shared meals.
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white/80 px-3 py-3">
          <dt className="text-xs text-charcoal-400">Meals rescued</dt>
          <dd className="mt-1 text-xl font-bold text-forest-800">1,240</dd>
        </div>
        <div className="rounded-xl bg-white/80 px-3 py-3">
          <dt className="text-xs text-charcoal-400">Food diverted</dt>
          <dd className="mt-1 text-xl font-bold text-forest-800">372 kg</dd>
        </div>
      </dl>

      <a
        href="#impact"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 underline-offset-4 hover:underline"
      >
        Explore your impact
        <ArrowRight className="size-4" />
      </a>
    </section>
  );
}
