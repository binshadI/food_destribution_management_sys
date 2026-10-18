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
import type { FoodRequest } from "./types";

export function ReceiverDashboard() {
  const toast = useToast();
  const user = useSession();
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadRequests() {
      if (!user) {
        setRequests([]);
        setRequestsLoading(false);
        return;
      }
      setRequestsLoading(true);
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
        if (!cancelled) setRequestsLoading(false);
      }
    }

    loadRequests();
    return () => {
      cancelled = true;
    };
  }, [user, toast]);

  const activeRequest = useMemo(
    () =>
      requests.find((request) => request.status === "Matched") ??
      requests.find((request) => request.status === "Ready") ??
      requests[0],
    [requests],
  );

  const openCount = requests.filter(
    (request) => request.status === "Pending",
  ).length;

  function addRequest(request: FoodRequest) {
    setRequests((prev) => [request, ...prev]);
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
          value="12"
          support="+4 vs last month"
          supportTone="green"
          tone="forest"
          icon={HeartHandshake}
        />
        <StatCard
          label="Meals received"
          value="1,860"
          support="All time"
          tone="mint"
          icon={Utensils}
        />
        <StatCard
          label="People served"
          value="640"
          support="Across 3 locations"
          tone="forest"
          icon={Leaf}
        />
      </section>

      <Banner
        icon={<CheckCircle className="size-[18px]" />}
        title="New match confirmed"
        description="Green Table Kitchen will provide 80 vegetable biryani meals today at 18:00 for Northgate Community Hall."
        action="Track request"
        onAction={() => {
          document
            .getElementById("active")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <NewRequestForm onAdd={addRequest} />

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {activeRequest ? (
            <ActiveRequestCard request={activeRequest} />
          ) : null}
          <VerificationCard />
        </div>
      </div>

      {requestsLoading ? (
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
