import { HandHeart, Sprout, Truck } from "./icons";
import { Reveal } from "./reveal";
import { Container, eyebrow } from "./ui";

const STEPS = [
  {
    icon: Sprout,
    title: "Share what you have",
    body: "Restaurants, hotels, grocers and households list surplus food in under a minute — a few details, a photo, and a pickup window.",
  },
  {
    icon: HandHeart,
    title: "Match the need",
    body: "We match each listing with nearby NGOs, shelters and community organisations by location, quantity, dietary needs and freshness.",
  },
  {
    icon: Truck,
    title: "Deliver with care",
    body: "Volunteers coordinate pickups and drop-offs, with clear tracking and reminders from the kitchen to the doorstep.",
  },
];

export function Steps() {
  return (
    <section id="how" className="scroll-mt-24 bg-mint-50">
      <Container className="py-20 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className={eyebrow}>
            <span className="size-1.5 rounded-full bg-amber-500" />
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-forest-900 sm:text-4xl lg:text-[2.75rem]">
            From extra to essential, in three steps.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-charcoal-600">
            Surplus food shouldn&apos;t be a problem to manage — it should be a
            gift to share. Here&apos;s the whole journey, from listing to
            doorstep.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 110}>
                <article className="group flex h-full flex-col rounded-3xl border border-forest-900/8 bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-mint-100 text-forest-700 transition group-hover:bg-forest-700 group-hover:text-mint-100">
                      <Icon className="size-6" />
                    </span>
                    <span className="text-sm font-bold tracking-widest text-forest-200">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-forest-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-charcoal-600">
                    {step.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
