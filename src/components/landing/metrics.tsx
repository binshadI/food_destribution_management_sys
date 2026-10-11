import { Reveal } from "./reveal";
import { Container, eyebrow } from "./ui";

const METRICS = [
  { value: "1.8M", label: "Meals saved from landfill" },
  { value: "240+", label: "Partner organisations" },
  { value: "92K", label: "Deliveries completed" },
  { value: "3,600", label: "Active volunteers" },
];

export function Metrics() {
  return (
    <section id="impact" className="scroll-mt-24 border-y border-forest-900/8 bg-cream">
      <Container className="py-16 lg:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className={eyebrow}>
            <span className="size-1.5 rounded-full bg-amber-500" />
            Our impact so far
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-forest-900 sm:text-4xl">
            Real food, real people, real numbers.
          </h2>
        </Reveal>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {METRICS.map((metric, index) => (
            <Reveal
              key={metric.label}
              delay={index * 90}
              className="border-t-2 border-forest-700/15 pt-5"
            >
              <dt className="sr-only">{metric.label}</dt>
              <dd className="text-5xl font-bold tracking-tight text-forest-800 sm:text-6xl">
                {metric.value}
              </dd>
              <dd className="mt-2 text-sm font-medium text-charcoal-600">
                {metric.label}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
