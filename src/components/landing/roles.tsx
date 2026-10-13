import type { ComponentType, SVGProps } from "react";
import { ArrowRight, HandHeart, Sprout, Truck } from "./icons";
import { Reveal } from "./reveal";
import { Container, eyebrow } from "./ui";

type Role = {
  id?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
  link: string;
  tone: "mint" | "amber" | "forest";
};

const ROLES: Role[] = [
  {
    id: "donors",
    icon: Sprout,
    title: "Donate surplus food",
    body: "Restaurants, grocers, hotels, caterers and households can turn today's surplus into tomorrow's meals.",
    link: "Become a donor",
    tone: "mint",
  },
  {
    id: "ngos",
    icon: HandHeart,
    title: "Request food for your community",
    body: "NGOs, shelters, faith groups and community kitchens can post their needs and receive matched donations.",
    link: "Register your organisation",
    tone: "amber",
  },
  {
    icon: Truck,
    title: "Volunteer for deliveries",
    body: "Drivers, cyclists and on-foot helpers with an hour to spare keep food moving from kitchen to community.",
    link: "Join as a volunteer",
    tone: "forest",
  },
];

const tones = {
  mint: {
    icon: "bg-mint-100 text-forest-700",
    link: "text-forest-700 hover:text-forest-900",
    bar: "bg-mint-300",
  },
  amber: {
    icon: "bg-amber-400/20 text-amber-700",
    link: "text-amber-700 hover:text-amber-600",
    bar: "bg-amber-400",
  },
  forest: {
    icon: "bg-forest-700 text-mint-100",
    link: "text-forest-700 hover:text-forest-900",
    bar: "bg-forest-500",
  },
} as const;

export function Roles() {
  return (
    <section className="scroll-mt-24 bg-white">
      <Container className="py-20 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className={eyebrow}>
            <span className="size-1.5 rounded-full bg-amber-500" />
            Get involved
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-forest-900 sm:text-4xl lg:text-[2.75rem]">
            One community, many ways to help.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-charcoal-600">
            However you show up, you&apos;re part of the chain that gets good
            food to the people who need it.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {ROLES.map((role, index) => {
            const Icon = role.icon;
            const tone = tones[role.tone];
            return (
              <Reveal
                key={role.title}
                delay={index * 110}
                className="h-full"
              >
                <article
                  id={role.id}
                  className="group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-forest-900/8 bg-cream/60 p-7 transition duration-300 hover:-translate-y-1.5 hover:border-forest-200 hover:bg-white hover:shadow-lift"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 h-1.5 ${tone.bar}`}
                  />
                  <span
                    className={`grid size-12 place-items-center rounded-2xl ${tone.icon}`}
                  >
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold text-forest-900">
                    {role.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-charcoal-600">
                    {role.body}
                  </p>
                  <a
                    href="/register"
                    className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition ${tone.link}`}
                  >
                    {role.link}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
