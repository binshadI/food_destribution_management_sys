import { Leaf, TrendingUp } from "@/components/ui/icons";

const STATS = [
  { label: "Deliveries", value: "48" },
  { label: "Meals moved", value: "1,320" },
  { label: "Distance", value: "210 km" },
  { label: "Hours given", value: "36 h" },
];

export function ImpactBanner() {
  return (
    <section
      id="impact"
      className="scroll-mt-24 rounded-2xl border border-mint-200 bg-mint-50 p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-forest-600">
            <Leaf className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-forest-900">
              Your deliveries are doing good.
            </h2>
            <p className="mt-1 max-w-xl text-sm text-charcoal-600">
              Every trip you take keeps good food out of landfill and puts a
              warm meal on someone&apos;s table.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-forest-700">
          <TrendingUp className="size-3.5" />
          +12% this month
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white/80 px-4 py-3">
            <dt className="text-xs text-charcoal-400">{stat.label}</dt>
            <dd className="mt-1 text-xl font-bold text-forest-800">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
