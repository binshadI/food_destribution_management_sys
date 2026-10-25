"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { Download, Inbox } from "@/components/ui/icons";
import { btnOutline, card } from "@/components/ui/styles";
import { StatusBadge } from "./status-badge";
import type { Listing } from "./types";

type TabId = "all" | "active" | "pending" | "completed";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All listings" },
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending pickup" },
  { id: "completed", label: "Completed" },
];

function matchesTab(status: Listing["status"], tab: TabId): boolean {
  switch (tab) {
    case "active":
      return status === "Available";
    case "pending":
      return status === "Matched" || status === "Pending";
    case "completed":
      return status === "Delivered";
    default:
      return true;
  }
}

export function ListingsPanel({ listings }: { listings: Listing[] }) {
  const toast = useToast();
  const [tab, setTab] = useState<TabId>("all");

  const visible = useMemo(
    () => listings.filter((listing) => matchesTab(listing.status, tab)),
    [listings, tab],
  );

  function exportCsv() {
    const header = ["ID", "Food", "Quantity", "Expiry", "Receiver", "Volunteer", "Status"];
    const rows = visible.map((listing) => [
      listing.id,
      listing.food,
      listing.quantity,
      listing.expiry,
      listing.receiver,
      listing.volunteer ?? "",
      listing.status,
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
    anchor.download = "second-serving-listings.csv";
    anchor.click();
    URL.revokeObjectURL(url);

    toast({
      tone: "success",
      title: "Export ready",
      description: `${visible.length} listing${visible.length === 1 ? "" : "s"} downloaded as CSV.`,
    });
  }

  return (
    <section id="listings" className={`${card} scroll-mt-24 p-6 sm:p-8`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-forest-900">My listings</h2>
        <button type="button" onClick={exportCsv} className={btnOutline}>
          <Download className="size-4" />
          Export
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Filter listings"
        className="mt-5 flex flex-wrap gap-1.5 rounded-xl bg-sage-100 p-1.5"
      >
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-mint-100 text-forest-800 shadow-sm"
                  : "text-charcoal-600 hover:text-forest-800"
              }`}
            >
              {item.label}
            </button>
          );
        })}
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
            No listings match this filter. Share surplus food and it will show
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
                    Quantity
                  </th>
                  <th scope="col" className="px-4 pb-3 font-semibold">
                    Expiry
                  </th>
                  <th scope="col" className="px-4 pb-3 font-semibold">
                    Receiver / Pickup
                  </th>
                  <th scope="col" className="pb-3 pl-4 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((listing) => (
                  <tr
                    key={listing.id}
                    className="border-b border-sage-100 last:border-0"
                  >
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-forest-900">
                        {listing.food}
                      </p>
                      <p className="mt-0.5 text-xs text-charcoal-400">
                        {listing.id}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-charcoal-600">
                      {listing.quantity}
                    </td>
                    <td className="px-4 py-4 text-charcoal-600">
                      {listing.expiry}
                    </td>
                    <td className="px-4 py-4 text-charcoal-600">
                      {listing.receiver}
                      {listing.volunteer ? (
                        <span className="mt-0.5 block text-xs font-medium text-forest-700">
                          Volunteer {listing.volunteer} accepted
                        </span>
                      ) : null}
                    </td>
                    <td className="py-4 pl-4">
                      <StatusBadge status={listing.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-6 space-y-3 md:hidden">
            {visible.map((listing) => (
              <li
                key={listing.id}
                className="rounded-2xl border border-sage-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-forest-900">
                      {listing.food}
                    </p>
                    <p className="mt-0.5 text-xs text-charcoal-400">
                      {listing.id}
                    </p>
                  </div>
                  <StatusBadge status={listing.status} />
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <dt className="text-charcoal-400">Quantity</dt>
                    <dd className="mt-0.5 font-medium text-forest-900">
                      {listing.quantity}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-charcoal-400">Expiry</dt>
                    <dd className="mt-0.5 font-medium text-forest-900">
                      {listing.expiry}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-charcoal-400">Receiver</dt>
                    <dd className="mt-0.5 font-medium text-forest-900">
                      {listing.receiver}
                    </dd>
                  </div>
                  {listing.volunteer ? (
                    <div className="col-span-3">
                      <dt className="text-charcoal-400">Volunteer</dt>
                      <dd className="mt-0.5 font-medium text-forest-700">
                        {listing.volunteer} accepted this pickup
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
