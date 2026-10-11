import Image from "next/image";
import { ArrowRight, Check, HandHeart } from "./icons";
import { btnOutline, btnPrimary, Container, eyebrow } from "./ui";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden scroll-mt-24 bg-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-16 -z-0 size-80 rounded-full bg-mint-200/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 -z-0 size-64 rounded-full bg-amber-300/40 blur-3xl"
      />

      <Container className="relative z-10 grid items-center gap-14 py-16 lg:grid-cols-2 lg:gap-12 lg:py-24">
        <div className="max-w-xl">
          <p className={eyebrow}>
            <span className="size-1.5 rounded-full bg-amber-500" />
            Nonprofit food rescue network
          </p>

          <h1 className="mt-5 text-[2.6rem] font-bold leading-[1.03] tracking-tight text-forest-900 sm:text-6xl lg:text-[4.1rem]">
            Rescue Food,
            <br />
            <span className="relative inline-block">
              Feed Hope.
              <svg
                aria-hidden="true"
                viewBox="0 0 220 14"
                className="absolute -bottom-2 left-0 h-3 w-full text-amber-400"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9c40-6 130-8 216-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-7 text-lg leading-relaxed text-charcoal-600">
            Every day, good food is thrown away while neighbours go without.
            Second Serving connects surplus food from kitchens big and small to
            the people who need it most — so what would be waste becomes a warm
            meal.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#join" className={btnPrimary}>
              Get started
              <ArrowRight className="size-4" />
            </a>
            <a href="#how" className={btnOutline}>
              <HandHeart className="size-4 text-forest-600" />
              See how it works
            </a>
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-forest-900/8 bg-cream px-4 py-3.5 text-sm text-charcoal-600">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-700">
              <Check className="size-4" />
            </span>
            <p>
              Trusted by{" "}
              <strong className="font-semibold text-forest-800">
                240+ restaurants, bakeries and community kitchens
              </strong>{" "}
              keeping good food out of landfill.
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-[2rem] border border-forest-900/8 shadow-card">
            <Image
              src="/images/hero-volunteers.jpg"
              alt="Volunteers stacking boxes of rescued food for distribution"
              fill
              preload
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-6 -left-4 hidden aspect-square w-40 overflow-hidden rounded-2xl border-4 border-white shadow-lift sm:block lg:w-44">
            <Image
              src="/images/hero-meal.jpg"
              alt="Neighbours sharing a community meal together"
              fill
              sizes="200px"
              className="object-cover"
            />
          </div>

          <div className="absolute -right-3 top-10 hidden aspect-4/5 w-32 overflow-hidden rounded-2xl border-4 border-white shadow-lift sm:block">
            <Image
              src="/images/hero-groceries.jpg"
              alt="A volunteer handing fresh groceries to a community member"
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-5 right-4 flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-white/95 px-4 py-3 shadow-lift backdrop-blur sm:right-8">
            <span className="grid size-10 place-items-center rounded-xl bg-forest-700 text-mint-100">
              <HandHeart className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-xl font-bold text-forest-900">
                152,400
              </span>
              <span className="block text-xs font-medium text-charcoal-400">
                meals rescued this year
              </span>
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
