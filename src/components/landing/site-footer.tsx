import {
  ArrowRight,
  BrandMark,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  XSocial,
} from "./icons";
import { btnAmber, Container } from "./ui";

const NAV_GROUPS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "#top" },
      { label: "How it works", href: "#how" },
      { label: "Our impact", href: "#impact" },
      { label: "Food stories", href: "#stories" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { label: "For donors", href: "#donors" },
      { label: "For NGOs", href: "#ngos" },
      { label: "Volunteer", href: "/register" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

const SOCIALS = [
  { label: "Second Serving on X", href: "#", icon: XSocial },
  { label: "Second Serving on Instagram", href: "#", icon: Instagram },
  { label: "Second Serving on Facebook", href: "#", icon: Facebook },
  { label: "Second Serving on LinkedIn", href: "#", icon: Linkedin },
];

export function SiteFooter() {
  return (
    <footer className="bg-forest-950 text-mint-100">
      <Container className="pb-10 pt-16 lg:pt-20">
        <div className="grid items-center gap-8 border-b border-white/10 pb-14 lg:grid-cols-[1.3fr_1fr] lg:pb-16">
          <div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              Let&apos;s put good food to good use.
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-mint-100/70">
              Join thousands of kitchens, community organisations and
              volunteers turning surplus into something shared.
            </p>
          </div>
          <div className="flex lg:justify-end">
            <a href="/register" className={btnAmber}>
              Get started
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5" aria-label="Second Serving home">
              <span className="grid size-9 place-items-center rounded-xl bg-forest-500 text-white">
                <BrandMark className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-white">
                Second<span className="text-mint-300">Serving</span>
              </span>
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-mint-100/60">
              A nonprofit food rescue network connecting surplus food with the
              people who need it most — good food to good use.
            </p>
            <a
              href="mailto:hello@secondserving.org"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-mint-100/80 transition hover:text-white"
            >
              <Mail className="size-4" />
              hello@secondserving.org
            </a>
            <ul className="mt-6 flex gap-3">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      className="grid size-10 place-items-center rounded-full border border-white/15 text-mint-100/80 transition hover:border-transparent hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-mint-300">
                {group.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-mint-100/70 transition hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-mint-100/50">
            © 2026 Second Serving. A nonprofit food rescue
            network.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Accessibility", href: "#" },
              { label: "Contact", href: "mailto:hello@secondserving.org" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-xs text-mint-100/60 transition hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
