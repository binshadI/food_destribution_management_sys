"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast";
import {
  Calendar,
  ClipboardList,
  Clock,
  Leaf,
  Utensils,
} from "@/components/ui/icons";
import { eyebrow } from "@/components/ui/styles";
import { firstName, useSession } from "@/lib/session";
import { ListingsPanel } from "./listings-panel";
import { ImpactCard, NextPickupCard } from "./next-pickup-card";
import { PickupModal } from "./pickup-modal";
import { ShareSurplusForm } from "./share-surplus-form";
import type { Listing } from "./types";

type Metric = {
  label: string;
  value: string;
  support: string;
  supportTone: "green" | "muted";
  valueTone: "forest" | "amber";
  icon: typeof Calendar;
};

export function DonorDashboard() {
  const toast = useToast();
  const user = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [pickupOpen, setPickupOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadListings() {
      if (!user) {
        setListings([]);
        setListingsLoading(false);
        return;
      }
      setListingsLoading(true);
      try {
        const response = await fetch(`/api/food-items?userId=${user.id}`);
        const data = (await response.json().catch(() => null)) as {
          listings?: Listing[];
          error?: string;
        } | null;
        if (cancelled) return;
        if (!response.ok || !data) {
          throw new Error(data?.error ?? "Could not load listings.");
        }
        setListings(data.listings ?? []);
      } catch (error: unknown) {
        if (cancelled) return;
        setListings([]);
        toast({
          tone: "error",
          title: "Couldn't load listings",
          description:
            error instanceof Error && error.message
              ? error.message
              : "Something went wrong.",
        });
      } finally {
        if (!cancelled) setListingsLoading(false);
      }
    }

    loadListings();
    return () => {
      cancelled = true;
    };
  }, [user, toast]);

  const activeListings = listings.filter(
    (listing) =>
      listing.status !== "Delivered" && listing.status !== "Expired",
  ).length;
  const matchedListings = listings.filter(
    (listing) => listing.status === "Matched",
  ).length;
  const availableListings = listings.filter(
    (listing) => listing.status === "Available",
  ).length;

  const metrics: Metric[] = [
    {
      label: "Active listings",
      value: String(activeListings),
      support: `${matchedListings} matched · ${availableListings} available`,
      supportTone: "muted",
      valueTone: "forest",
      icon: ClipboardList,
    },
    {
      label: "Pending pickups",
      value: String(matchedListings),
      support: "Matched, awaiting collection",
      supportTone: "muted",
      valueTone: "amber",
      icon: Calendar,
    },
    {
      label: "Meals rescued",
      value: "1,240",
      support: "+180 this month",
      supportTone: "green",
      valueTone: "forest",
      icon: Utensils,
    },
    {
      label: "Food rescued",
      value: "372 kg",
      support: "Since joining",
      supportTone: "muted",
      valueTone: "forest",
      icon: Leaf,
    },
  ];

  function addListing(listing: Listing) {
    setListings((prev) => [listing, ...prev]);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <p className={eyebrow}>Donor portal overview</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-forest-900 sm:text-4xl">
          Good morning, {firstName(user?.name ?? "there")}.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-charcoal-600 sm:text-base">
          Your surplus can save someone&apos;s day. Here&apos;s what&apos;s
          happening.
        </p>
      </header>

      <section
        id="impact"
        aria-label="Impact summary"
        className="grid grid-cols-1 gap-4 scroll-mt-24 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article
              key={metric.label}
              className="rounded-2xl border border-sage-200 bg-white p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-charcoal-600">
                  {metric.label}
                </p>
                <span
                  className={`grid size-9 place-items-center rounded-full ${
                    metric.valueTone === "amber"
                      ? "bg-amber-300/25 text-amber-700"
                      : "bg-sage-100 text-forest-700"
                  }`}
                >
                  <Icon className="size-[18px]" />
                </span>
              </div>
              <p
                className={`mt-3 text-3xl font-bold tracking-tight ${
                  metric.valueTone === "amber"
                    ? "text-amber-600"
                    : "text-forest-900"
                }`}
              >
                {metric.value}
              </p>
              <p
                className={`mt-1 text-xs font-medium ${
                  metric.supportTone === "green"
                    ? "text-forest-600"
                    : "text-charcoal-400"
                }`}
              >
                {metric.support}
              </p>
            </article>
          );
        })}
      </section>

      {(() => {
        const upcoming = listings.find(
          (listing) => listing.status === "Matched" || listing.status === "Pending",
        );
        if (!upcoming) return null;
        return (
          <div className="flex items-center gap-3 rounded-2xl border border-mint-200 border-l-4 border-l-forest-500 bg-mint-50 p-4 sm:p-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-forest-700">
              <Calendar className="size-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-forest-900">
                {upcoming.volunteer
                  ? "A volunteer accepted your pickup"
                  : "A pickup has been scheduled"}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-charcoal-600">
                {upcoming.receiver} is matched to {upcoming.quantity} of{" "}
                {upcoming.food.toLowerCase()} ({upcoming.id}, expires{" "}
                {upcoming.expiry.toLowerCase()}).{" "}
                {upcoming.volunteer
                  ? `Volunteer ${upcoming.volunteer} will collect it for ${upcoming.receiver}.`
                  : `Please have the food ready and labelled for ${upcoming.receiver}.`}
              </p>
            </div>
          </div>
        );
      })()}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <ShareSurplusForm onPublish={addListing} />

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div id="pickup" className="scroll-mt-24">
            <NextPickupCard onViewDetails={() => setPickupOpen(true)} />
          </div>
          <ImpactCard />
        </div>
      </div>

      {listingsLoading ? (
        <p className="rounded-2xl border border-sage-200 bg-white px-5 py-8 text-center text-sm text-charcoal-600">
          Loading your listings…
        </p>
      ) : (
        <ListingsPanel listings={listings} />
      )}

      <PickupModal open={pickupOpen} onClose={() => setPickupOpen(false)} />

      <div className="flex items-center gap-2 px-1 text-xs text-charcoal-400">
        <Clock className="size-3.5" />
        Dashboard last synced a moment ago.
      </div>
    </div>
  );
}
