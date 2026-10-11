import Image from "next/image";
import { ArrowUpRight, MapPin } from "./icons";
import { Reveal } from "./reveal";
import { Container, eyebrow } from "./ui";

const STORIES = [
  {
    src: "/images/story-restaurant.jpg",
    alt: "A chef cooking in a busy restaurant kitchen",
    label: "Northgate, Leeds",
    title: "A kitchen that shares",
    body: "A neighbourhood bistro now sends every unsold tray to families a few streets away.",
  },
  {
    src: "/images/story-sorting.jpg",
    alt: "Volunteers packing boxes of donated food and supplies",
    label: "Volunteer crew",
    title: "Boxes that travel well",
    body: "Each weekend, neighbours sort and pack rescued produce into family-sized boxes.",
  },
  {
    src: "/images/story-community.jpg",
    alt: "People holding plates of food together at a community kitchen",
    label: "Riverside Community Kitchen",
    title: "Dinner, served with dignity",
    body: "Fresh produce arrives in time for the evening meal — shared openly, no questions asked.",
  },
];

export function Stories() {
  return (
    <section id="stories" className="scroll-mt-24 bg-cream">
      <Container className="py-20 lg:py-28">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className={eyebrow}>
              <span className="size-1.5 rounded-full bg-amber-500" />
              Food stories
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-forest-900 sm:text-4xl lg:text-[2.75rem]">
              Good food, close to home.
            </h2>
          </div>
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-charcoal-600">
            Small acts of rescue, happening in neighbourhoods like yours every
            single day.
          </p>
        </Reveal>

        <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 hide-scrollbar md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {STORIES.map((story, index) => (
            <Reveal
              key={story.title}
              delay={index * 110}
              className="min-w-[82%] snap-start sm:min-w-[55%] md:min-w-0"
            >
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-forest-900/8 bg-white shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={story.src}
                    alt={story.alt}
                    fill
                    sizes="(max-width: 768px) 82vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-forest-500">
                    <MapPin className="size-3.5" />
                    {story.label}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-forest-900">
                    {story.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-charcoal-600">
                    {story.body}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700">
                    Read the story
                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
