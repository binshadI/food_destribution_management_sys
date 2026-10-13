"use client";

import { Check } from "@/components/ui/icons";
import { card } from "@/components/ui/styles";
import { useLocalStore } from "@/lib/local-store";
import { checklistStore } from "./store";
import { CHECKLIST } from "./types";

export function ChecklistCard() {
  const [checked, setChecked] = useLocalStore(checklistStore);
  const done = CHECKLIST.filter((item) => checked[item.id]).length;
  const percent = Math.round((done / CHECKLIST.length) * 100);

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section className={`${card} p-6`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-forest-900">
          Delivery checklist
        </h2>
        <span className="text-xs font-semibold text-forest-600">
          {done}/{CHECKLIST.length}
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Checklist progress"
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sage-200"
      >
        <span
          className="block h-full rounded-full bg-forest-500 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-4 space-y-1">
        {CHECKLIST.map((item) => {
          const active = Boolean(checked[item.id]);
          return (
            <li key={item.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 transition hover:bg-sage-50">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggle(item.id)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition ${
                    active
                      ? "border-forest-600 bg-forest-600 text-white"
                      : "border-sage-300 bg-white text-transparent"
                  }`}
                >
                  <Check className="size-3.5" />
                </span>
                <span
                  className={`text-sm transition ${
                    active
                      ? "text-charcoal-400 line-through"
                      : "text-forest-900"
                  }`}
                >
                  {item.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
