"use client";

import { useEffect, useState } from "react";
import { BrandMark, Close, Menu } from "./icons";
import { btnPrimary } from "./ui";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "How It Works", href: "#how" },
  { label: "For Donors", href: "#donors" },
  { label: "For NGOs", href: "#ngos" },
  { label: "Our Impact", href: "#impact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-forest-900/8 bg-cream/85 backdrop-blur-md"
          : "border-b border-transparent bg-cream/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8">
        <a
          href="#top"
          className="group flex items-center gap-2.5 rounded-full py-1 pr-2"
          aria-label="Second Serving home"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-forest-700 text-mint-100 shadow-soft transition group-hover:bg-forest-800">
            <BrandMark className="size-5" />
          </span>
          <span className="text-[1.05rem] font-bold tracking-tight text-forest-900">
            Second<span className="text-forest-500">Serving</span>
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-charcoal-600 transition hover:bg-mint-100 hover:text-forest-800"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="#join"
            className="rounded-full px-4 py-2 text-sm font-semibold text-forest-800 transition hover:bg-mint-100"
          >
            Log in
          </a>
          <a href="#join" className={btnPrimary}>
            Get started
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center rounded-xl border border-forest-200 bg-white/70 text-forest-800 transition hover:bg-white lg:hidden"
        >
          {open ? <Close className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-forest-900/8 bg-cream/95 backdrop-blur-md transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? "max-h-[26rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="mx-auto max-w-7xl px-5 py-4 sm:px-8">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-charcoal-600 transition hover:bg-mint-100 hover:text-forest-800"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-forest-900/8 pt-4">
            <a
              href="#join"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-full border border-forest-200 bg-white px-5 py-3 text-sm font-semibold text-forest-900 transition hover:bg-mint-50"
            >
              Log in
            </a>
            <a
              href="#join"
              onClick={() => setOpen(false)}
              className={btnPrimary}
            >
              Get started
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
