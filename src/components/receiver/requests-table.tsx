"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Download, Inbox } from "@/components/ui/icons";
import { btnOutline, card } from "@/components/ui/styles";
import {
  STATUS_TONES,
  formatServings,
  type FoodRequest,
  type RequestStatus,
} from "./types";

type TabId = "all" | "open" | "matched" | "received";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All requests" },
  { id: "open", label: "Open" },
  { id: "matched", label: "Matched" },
  { id: "received", label: "Received" },
];

function matchesTab(status: RequestStatus, tab: TabId): boolean {
  switch (tab) {
    case "open":
      return status === "Pending";
    case "matched":
      return status === "Matched" || status === "Ready";
    case "received":
      return status === "Received";
    default:
      return true;
  }
}

export function RequestsTable({ requests }: { requests: FoodRequest[] }) {
  const toast = useToast();
  const [tab, setTab] = useState<TabId>("all");

  const visible = useMemo(
    () => requests.filter((request) => matchesTab(request.status, tab)),
    [requests, tab],
  );

  function exportCsv() {
    const header = [
      "ID",
      "Food",
      "Category",
      "Servings",
      "Needed by",
      "Urgency",
      "Area",
      "Status",
      "Donor",
    ];
    const rows = visible.map((request) => [
      request.id,
      request.food,
      request.category,
      String(request.servings),
      request.neededBy,
      request.urgency,
      request.area,
      request.status,
      request.donor,
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "second-serving-requests.csv";
    anchor.click();
    URL.revokeObjectURL(url);

    toast({
      tone: "success",
      title: "Export ready",
      description: `${visible.length} request${visible.length === 1 ? "" : "s"} downloaded as CSV.`,
    });
  }

  return (
    <section id="requests" className={`${card} scroll-mt-24 p-6 sm:p-8`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-forest-900">My requests</h2>
        <button type="button" onClick={exportCsv} className={btnOutline}>
          <Download className="size-4" />
          Export
        </button>
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
            Nothing here yet
          </p>
          <p className="mt-1 max-w-xs text-xs text-charcoal-600">
            No requests match this filter. Post a new request and it will show
            up here.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-sage-200 text-xs uppercase tracking-wide text-charcoal-400">
                  <th scope="col" className="pb-3 pr-4 font-semibold">
                    Food / ID
                  </th>
                  <th scope="col" className="px-4 pb-3 font-semibold">
                    Servings
                  </th>
                  <th scope="col" className="px-4 pb-3 font-semibold">
                    Needed by
                  </th>
                  <th scope="col" className="px-4 pb-3 font-semibold">
                    Area
                  </th>
                  <th scope="col" className="pb-3 pl-4 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-sage-100 last:border-0"
                  >
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-forest-900">
                        {request.food}
                      </p>
                      <p className="mt-0.5 text-xs text-charcoal-400">
                        {request.id} · {request.category}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-charcoal-600">
                      {formatServings(request.servings)}
                    </td>
                    <td className="px-4 py-4 text-charcoal-600">
                      {request.neededBy}
                    </td>
                    <td className="px-4 py-4 text-charcoal-600">
                      {request.area}
                    </td>
                    <td className="py-4 pl-4">
                      <Badge tone={STATUS_TONES[request.status]}>
                        {request.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-6 space-y-3 md:hidden">
            {visible.map((request) => (
              <li
                key={request.id}
                className="rounded-2xl border border-sage-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-forest-900">
                      {request.food}
                    </p>
                    <p className="mt-0.5 text-xs text-charcoal-400">
                      {request.id} · {request.category}
                    </p>
                  </div>
                  <Badge tone={STATUS_TONES[request.status]}>
                    {request.status}
                  </Badge>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <dt className="text-charcoal-400">Servings</dt>
                    <dd className="mt-0.5 font-medium text-forest-900">
                      {formatServings(request.servings)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-charcoal-400">Needed by</dt>
                    <dd className="mt-0.5 font-medium text-forest-900">
                      {request.neededBy}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-charcoal-400">Area</dt>
                    <dd className="mt-0.5 font-medium text-forest-900">
                      {request.area}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
