"use client";

import { useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Banner } from "@/components/ui/banner";
import { useToast } from "@/components/ui/toast";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  HeartHandshake,
  Leaf,
  Utensils,
} from "@/components/ui/icons";
import { eyebrow } from "@/components/ui/styles";
import { firstName, useSession } from "@/lib/session";
import { ActiveRequestCard, VerificationCard } from "./active-request-card";
import { NewRequestForm } from "./new-request-form";
import { RequestsTable } from "./requests-table";
import type { FoodRequest, NewRequestInput } from "./types";

export function ReceiverDashboard() {
  const toast = useToast();
  const user = useSession();
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadRequests() {
      if (!user) {
        setRequests([]);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/food-requests?userId=${user.id}`);
        const data = (await response.json().catch(() => null)) as {
          requests?: FoodRequest[];
          error?: string;
        } | null;
        if (cancelled) return;
        if (!response.ok || !data) {
          throw new Error(data?.error ?? "Could not load requests.");
        }
        setRequests(data.requests ?? []);
      } catch (error: unknown) {
        if (cancelled) return;
        setRequests([]);
        toast({
          tone: "error",
          title: "Couldn't load requests",
          description:
            error instanceof Error && error.message
              ? error.message
              : "Something went wrong.",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadRequests();
    return () => {
      cancelled = true;
    };
  }, [user, refreshToken, toast]);

  const activeRequest = useMemo(
    () =>
      requests.find((request) => request.status === "Ready") ??
      requests.find((request) => request.status === "Matched") ??
      requests[0],
    [requests],
  );

  const openCount = requests.filter(
    (request) => request.status === "Pending",
  ).length;

  const latestUpdate = useMemo(
    () =>
      requests.find((request) => request.status === "Ready") ??
      requests.find((request) => request.status === "Matched"),
    [requests],
  );

  async function addRequest(input: NewRequestInput) {
    if (!user) throw new Error("Please sign in again to post a request.");

    const response = await fetch("/api/food-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        title: input.food,
        category: input.category,
        quantityServings: input.servings,
        neededByDate: input.date,
        neededByTime: input.time,
        urgency: input.urgency,
        deliveryArea: input.area,
        notes: input.note,
      }),
    });

    const data = (await response.json().catch(() => null)) as {
      request?: FoodRequest;
      error?: string;
    } | null;

    if (!response.ok || !data) {
      throw new Error(data?.error ?? "Could not post your request.");
    }

    if (data.request) {
      setRequests((prev) => [data.request as FoodRequest, ...prev]);
    } else {
      setRefreshToken((token) => token + 1);
    }

    if (data.request?.status === "Matched") {
      toast({
        tone: "success",
        title: "Request matched",
        description: `${data.request.donor} can supply ${data.request.servings} servings for ${data.request.area}.`,
      });
    } else {
      toast({
        tone: "success",
        title: "Request posted",
        description: "We're matching your request with nearby donors now.",
      });
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <p className={eyebrow}>Receiver portal overview</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-forest-900 sm:text-4xl">
          Good morning, {firstName(user?.name ?? "there")}.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-charcoal-600 sm:text-base">
          Track your requests and see matched donations on the way to your
          community.
        </p>
      </header>

      <section
        id="impact"
        aria-label="Request summary"
        className="grid grid-cols-1 gap-4 scroll-mt-24 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Open requests"
          value={String(openCount)}
          support="Awaiting a match"
          supportTone={openCount > 0 ? "green" : "muted"}
          tone="amber"
          icon={ClipboardList}
        />
        <StatCard
          label="Matched this month"
          value={String(
            requests.filter((request) => request.status !== "Pending").length,
          )}
          support="Matched or delivered"
          supportTone="green"
          tone="forest"
          icon={HeartHandshake}
        />
        <StatCard
          label="Meals received"
          value={String(
            requests
              .filter((request) => request.status === "Received")
              .reduce((total, request) => total + request.servings, 0),
          )}
          support="All time"
          tone="mint"
          icon={Utensils}
        />
        <StatCard
          label="Ready for pickup"
          value={String(
            requests.filter((request) => request.status === "Ready").length,
          )}
          support="Volunteer accepted"
          supportTone="muted"
          tone="forest"
          icon={Leaf}
        />
      </section>

      {latestUpdate ? (
        <Banner
          icon={<CheckCircle className="size-[18px]" />}
          title={
            latestUpdate.status === "Ready"
              ? "Volunteer on the way"
              : "New match confirmed"
          }
          description={
            latestUpdate.status === "Ready"
              ? `${latestUpdate.volunteer ?? "A volunteer"} accepted your ${latestUpdate.servings} serving ${latestUpdate.food.toLowerCase()} pickup from ${latestUpdate.donor} for ${latestUpdate.area}.`
              : `${latestUpdate.donor} will provide ${latestUpdate.servings} servings of ${latestUpdate.food.toLowerCase()} for ${latestUpdate.area} — needed by ${latestUpdate.neededBy.toLowerCase()}.`
          }
          action="Track request"
          onAction={() => {
            document
              .getElementById("active")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <NewRequestForm onAdd={addRequest} />

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {activeRequest ? (
            <ActiveRequestCard request={activeRequest} />
          ) : null}
          <VerificationCard />
        </div>
      </div>

      {loading ? (
        <p className="rounded-2xl border border-sage-200 bg-white px-5 py-8 text-center text-sm text-charcoal-600">
          Loading your requests…
        </p>
      ) : (
        <RequestsTable requests={requests} />
      )}

      <div className="flex items-center gap-2 px-1 text-xs text-charcoal-400">
        <Clock className="size-3.5" />
        Dashboard last synced a moment ago.
      </div>
    </div>
  );
}
