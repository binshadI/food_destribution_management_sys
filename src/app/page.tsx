import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { Metrics } from "@/components/landing/metrics";
import { Roles } from "@/components/landing/roles";
import { SignupCta } from "@/components/landing/signup-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Steps } from "@/components/landing/steps";
import { Stories } from "@/components/landing/stories";
import { Testimonial } from "@/components/landing/testimonial";
import { Trust } from "@/components/landing/trust";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-forest-700 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />
        <Metrics />
        <Steps />
        <Roles />
        <Stories />
        <Testimonial />
        <Trust />
        <SignupCta />
        <Faq />
      </main>

      <SiteFooter />
    </div>
  );
}
