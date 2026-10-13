"use client";

import { useMemo } from "react";
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
import { useLocalStore } from "@/lib/local-store";
import { firstName, useSession } from "@/lib/session";
import { ActiveRequestCard, VerificationCard } from "./active-request-card";
import { NewRequestForm } from "./new-request-form";
import { RequestsTable } from "./requests-table";
import { requestsStore } from "./store";
import type { FoodRequest, NewRequestInput } from "./types";

export function ReceiverDashboard() {
  const toast = useToast();
  const user = useSession();
  const [requests, setRequests] = useLocalStore(requestsStore);

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

  function addRequest(input: NewRequestInput) {
    setRequests((prev) => {
      const maxId = prev.reduce(
        (max, request) =>
          Math.max(max, Number(request.id.replace(/\D/g, "")) || 0),
        0,
      );
      const request: FoodRequest = {
        id: `SS-RQ-${String(maxId + 1).padStart(4, "0")}`,
        food: input.food,
        category: input.category,
        servings: input.servings,
        neededBy: input.neededBy,
        urgency: input.urgency,
        area: input.area,
        status: "Pending",
        donor: "Awaiting match",
        note: input.note || undefined,
      };
      return [request, ...prev];
    });
    toast({
      tone: "success",
      title: "Request posted",
      description: "We're matching your request with nearby donors now.",
    });
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

      <RequestsTable requests={requests} />

      <div className="flex items-center gap-2 px-1 text-xs text-charcoal-400">
        <Clock className="size-3.5" />
        Dashboard last synced a moment ago.
      </div>
    </div>
  );
}
