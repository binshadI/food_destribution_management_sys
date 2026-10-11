import Image from "next/image";
import { QuoteGlyph } from "./icons";
import { Reveal } from "./reveal";
import { Container } from "./ui";

export function Testimonial() {
  return (
    <section className="bg-white">
      <Container className="py-16 lg:py-24">
        <Reveal>
          <figure className="relative grid overflow-hidden rounded-[2.5rem] border border-forest-900/8 bg-mint-100 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-64 lg:min-h-full">
              <Image
                src="/images/testimonial.jpg"
                alt="People sitting around a table sharing plates of food"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>

            <div className="relative flex flex-col justify-center gap-6 p-8 sm:p-12 lg:p-14">
              <QuoteGlyph
                aria-hidden="true"
                className="absolute right-8 top-8 size-16 text-amber-400/50"
              />
              <blockquote className="relative text-2xl font-semibold leading-snug tracking-tight text-forest-900 sm:text-[1.75rem] lg:text-3xl">
                &ldquo;It&apos;s more than a delivery. It&apos;s knowing our
                neighbours have better food on the table.&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-forest-700 text-sm font-bold text-mint-100">
                  AO
                </span>
                <span className="leading-tight">
                  <span className="block font-semibold text-forest-900">
                    Amara Okafor
                  </span>
                  <span className="block text-sm text-charcoal-600">
                    Volunteer driver &amp; community cook
                  </span>
                </span>
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
