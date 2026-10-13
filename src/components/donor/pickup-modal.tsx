"use client";

import { useEffect, useRef } from "react";
import {
  Box,
  Check,
  Clock,
  Close,
  MapPin,
  Phone,
  ShieldCheck,
  Utensils,
} from "@/components/ui/icons";
import { btnPrimary } from "@/components/ui/styles";
import { StatusBadge } from "./status-badge";

export function PickupModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close pickup details"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-forest-950/50"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pickup-modal-title"
        className="relative z-10 max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl border border-sage-200 bg-white p-6 shadow-lift sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-600">
              Donor portal
            </p>
            <h2
              id="pickup-modal-title"
              className="mt-1 text-xl font-semibold text-forest-900"
            >
              Pickup details
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full text-charcoal-400 transition hover:bg-sage-100 hover:text-forest-800"
          >
            <Close className="size-5" />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-sage-50 p-4">
          <div>
            <p className="text-xs text-charcoal-400">Scheduled</p>
            <p className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-forest-900">
              <Clock className="size-4 text-forest-600" />
              Today · 17:30 – 18:00
            </p>
          </div>
          <StatusBadge status="Matched" />
        </div>

        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              Receiver
            </dt>
            <dd className="mt-1 font-semibold text-forest-900">
              Meals for Hope Shelter
            </dd>
            <dd className="mt-0.5 flex items-center gap-1.5 text-xs text-charcoal-600">
              <ShieldCheck className="size-3.5 text-forest-600" />
              <MapPin className="size-3.5 text-forest-600" />
              8 Fenwick Road · 2.1 km away
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              Food summary
            </dt>
            <dd className="mt-1 flex items-center gap-1.5 font-medium text-forest-800">
              <Utensils className="size-4 text-forest-600" />3 meals
              <span className="text-sage-300">•</span>
              <Box className="size-4 text-forest-600" />3 crates
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              Assigned volunteer
            </dt>
            <dd className="mt-2 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-forest-100 text-sm font-semibold text-forest-700">
                JM
              </span>
              <span className="flex-1">
                <span className="block font-semibold text-forest-900">
                  Jordan M.
                </span>
                <span className="block text-xs text-charcoal-400">
                  Cargo bike · ETA 17:35
                </span>
              </span>
              <span className="grid size-9 place-items-center rounded-full border border-sage-200 text-forest-700">
                <Phone className="size-4" />
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
              Your notes
            </dt>
            <dd className="mt-1 text-charcoal-600">
              Meals cooled and labelled. Collect from the back kitchen entrance
              — please ask for Alex.
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className={`${btnPrimary} sm:flex-1`}
          >
            <Check className="size-4" />
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
