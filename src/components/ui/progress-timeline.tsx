import { Check } from "./icons";

export type TimelineStep = {
  label: string;
  detail?: string;
  state: "done" | "active" | "upcoming";
};

const markerStyles: Record<TimelineStep["state"], string> = {
  done: "bg-forest-700 text-white",
  active: "bg-amber-400 text-forest-900 ring-4 ring-amber-400/25",
  upcoming: "bg-white text-forest-600 ring-1 ring-sage-300",
};

const labelStyles: Record<TimelineStep["state"], string> = {
  done: "text-forest-700",
  active: "text-forest-900",
  upcoming: "text-charcoal-400",
};

export function ProgressTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="md:flex md:items-start">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li
            key={step.label}
            className="relative flex gap-3 pb-6 last:pb-0 md:min-w-0 md:flex-1 md:flex-col md:items-center md:gap-2 md:pb-0 md:text-center"
          >
            {!isLast ? (
              <span
                aria-hidden="true"
                className="absolute left-4 top-4 bottom-0 w-0.5 bg-sage-200 md:bottom-auto md:left-1/2 md:top-4 md:h-0.5 md:w-full md:-translate-x-1/2"
              />
            ) : null}

            <span
              className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${markerStyles[step.state]}`}
            >
              {step.state === "done" ? (
                <Check className="size-4" />
              ) : (
                index + 1
              )}
            </span>

            <div className="min-w-0 pt-0.5">
              <p
                className={`text-sm font-semibold ${labelStyles[step.state]}`}
              >
                {step.label}
              </p>
              {step.detail ? (
                <p className="mt-0.5 text-xs text-charcoal-400">
                  {step.detail}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}