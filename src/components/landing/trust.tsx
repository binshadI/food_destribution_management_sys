import { Check, ShieldCheck } from "./icons";
import { Reveal } from "./reveal";
import { Container, eyebrow } from "./ui";

const PRINCIPLES = [
  {
    title: "Verified community partners",
    body: "Every organisation is checked and approved before it can receive food.",
  },
  {
    title: "Clear pickup and delivery tracking",
    body: "Each listing shows exactly who collected what, and when.",
  },
  {
    title: "Safe food handling",
    body: "Simple, food-safety-first guidance from listing through to hand-over.",
  },
  {
    title: "Respectful, reliable support",
    body: "Distribution that protects the dignity of every person we serve.",
  },
];

export function Trust() {
  return (
    <section id="trust" className="scroll-mt-24 bg-cream">
      <Container className="grid gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <Reveal>
          <p className={eyebrow}>
            <span className="size-1.5 rounded-full bg-amber-500" />
            Why people trust us
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-forest-900 sm:text-4xl lg:text-[2.75rem]">
            Built on trust. Designed for dignity.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-600">
            Rescue only works when everyone involved feels safe and respected.
            We keep food handling standards tight and every hand-over
            transparent, so donors, partners and the people they serve can rely
            on one another.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-charcoal-600">
            No wasted food. No wasted goodwill. Just a calm, dependable system
            that treats a meal as what it is — a shared basic need.
          </p>

          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-forest-900/8 bg-white p-5 shadow-soft">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-700 text-mint-100">
              <ShieldCheck className="size-6" />
            </span>
            <p className="text-sm leading-relaxed text-charcoal-600">
              <strong className="font-semibold text-forest-800">
                Every partner is verified.
              </strong>{" "}
              Donations are logged end-to-end so nothing goes unaccounted for.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ul className="flex h-full flex-col justify-center divide-y divide-forest-900/8 overflow-hidden rounded-3xl border border-forest-900/8 bg-white shadow-soft">
            {PRINCIPLES.map((item) => (
              <li key={item.title} className="flex gap-4 p-6">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-700">
                  <Check className="size-4" />
                </span>
                <span>
                  <span className="block font-semibold text-forest-900">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-charcoal-600">
                    {item.body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
