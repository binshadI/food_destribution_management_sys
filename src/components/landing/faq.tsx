"use client";

import { useState } from "react";
import { Reveal } from "./reveal";
import { Container, eyebrow } from "./ui";

const FAQS = [
  {
    q: "Who can donate surplus food?",
    a: "Restaurants, cafés, bakeries, hotels, caterers, grocers, offices and households can all list surplus food. If it's safe to eat and within date, it can find a home.",
  },
  {
    q: "Who can request food?",
    a: "Registered NGOs, charities, shelters, faith groups and community kitchens can request food. Every partner is verified before receiving donations so support stays reliable and respectful.",
  },
  {
    q: "How do volunteers get involved?",
    a: "Sign up and choose to volunteer, then pick up deliveries that fit your location and schedule. Most trips take under an hour, by car, bike or on foot.",
  },
  {
    q: "Is there a cost to join?",
    a: "No. Second Serving is a nonprofit network and free for donors, recipient organisations and volunteers. There are no listing or membership fees.",
  },
  {
    q: "How is food safety handled?",
    a: "Every listing includes handling and storage guidance, and partners agree to our food-safety standards. Donations are tracked end-to-end so nothing goes unaccounted for.",
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-5 shrink-0 text-forest-600 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-white">
      <Container className="py-20 lg:py-28">
        <Reveal className="max-w-2xl">
          <p className={eyebrow}>
            <span className="size-1.5 rounded-full bg-amber-500" />
            FAQ
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-forest-900 sm:text-4xl lg:text-[2.75rem]">
            Good questions. Simple answers.
          </h2>
        </Reveal>

        <Reveal delay={100} className="mt-12 max-w-3xl">
          <div className="divide-y divide-forest-900/10 overflow-hidden rounded-3xl border border-forest-900/8 bg-cream/40">
            {FAQS.map((item, index) => {
              const open = openIndex === index;
              return (
                <div key={item.q} className="px-6">
                  <h3>
                    <button
                      type="button"
                      id={`faq-question-${index}`}
                      aria-expanded={open}
                      aria-controls={`faq-answer-${index}`}
                      onClick={() => setOpenIndex(open ? null : index)}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    >
                      <span className="text-base font-semibold text-forest-900 sm:text-lg">
                        {item.q}
                      </span>
                      <Chevron open={open} />
                    </button>
                  </h3>
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    data-open={open}
                    className="accordion-panel"
                  >
                    <div>
                      <p className="pb-6 pr-10 text-[0.95rem] leading-relaxed text-charcoal-600">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
