"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, HandHeart, Sprout, Truck } from "./icons";
import { Reveal } from "./reveal";
import { Container, eyebrow } from "./ui";

const ORG_TYPES = [
  "Restaurant or café",
  "Grocery or retailer",
  "Hotel or caterer",
  "NGO or charity",
  "Shelter or community kitchen",
  "Household",
  "Other",
];

const ROLES = [
  { value: "donate", label: "Donate food", icon: Sprout },
  { value: "receive", label: "Receive food", icon: HandHeart },
  { value: "volunteer", label: "Volunteer", icon: Truck },
];

type Errors = { name?: string; email?: string; org?: string };

export function SignupCta() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("donate");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = "Please tell us your name.";
    if (!email.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "That email doesn’t look quite right.";
    if (!org) next.org = "Please choose an organisation type.";
    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  }

  return (
    <section id="join" className="scroll-mt-24 border-y border-forest-900/8 bg-mint-50">
      <Container className="grid gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <Reveal>
          <p className={eyebrow}>
            <span className="size-1.5 rounded-full bg-amber-500" />
            Join the network
          </p>
          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-forest-900 sm:text-4xl lg:text-[2.75rem]">
            A few minutes to join. A lasting difference to make.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-charcoal-600">
            Whether you have food to share, a community to feed, or an hour to
            drive, there&apos;s a place for you here. Sign up once and choose
            how you want to take part.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Free to join — no cost, no lock-in",
              "Choose to donate, receive food, or volunteer",
              "Verified partners and clear, tracked hand-overs",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-charcoal-600">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-forest-700 shadow-soft">
                  <Check className="size-4" />
                </span>
                <span className="text-[0.95rem]">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-3xl border border-forest-900/8 bg-white p-6 shadow-card sm:p-8">
            {submitted ? (
              <div
                role="status"
                className="flex min-h-[26rem] flex-col items-center justify-center gap-4 text-center"
              >
                <span className="grid size-14 place-items-center rounded-full bg-mint-100 text-forest-700">
                  <Check className="size-7" />
                </span>
                <h3 className="text-xl font-bold text-forest-900">
                  You&apos;re on the list, {name.trim().split(" ")[0] || "friend"}!
                </h3>
                <p className="max-w-sm text-[0.95rem] leading-relaxed text-charcoal-600">
                  We&apos;ve sent a confirmation to{" "}
                  <strong className="font-semibold text-forest-800">
                    {email.trim()}
                  </strong>
                  . Next, we&apos;ll help you get set up to{" "}
                  {role === "donate"
                    ? "share surplus food"
                    : role === "receive"
                      ? "receive food for your community"
                      : "volunteer for deliveries"}
                  .
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setOrg("");
                    setRole("donate");
                  }}
                  className="mt-2 text-sm font-semibold text-forest-700 underline underline-offset-4 transition hover:text-forest-900"
                >
                  Sign up someone else
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-semibold text-forest-900"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    placeholder="Jordan Rivera"
                    className={`w-full rounded-xl border bg-cream/40 px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-charcoal-400 focus:border-forest-500 focus:bg-white ${
                      errors.name ? "border-red-400" : "border-forest-900/12"
                    }`}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs font-medium text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-semibold text-forest-900"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    placeholder="you@organisation.org"
                    className={`w-full rounded-xl border bg-cream/40 px-4 py-3 text-sm text-charcoal outline-none transition placeholder:text-charcoal-400 focus:border-forest-500 focus:bg-white ${
                      errors.email ? "border-red-400" : "border-forest-900/12"
                    }`}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs font-medium text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="org"
                    className="mb-1.5 block text-sm font-semibold text-forest-900"
                  >
                    Organisation type
                  </label>
                  <select
                    id="org"
                    name="org"
                    value={org}
                    onChange={(event) => {
                      setOrg(event.target.value);
                      if (errors.org)
                        setErrors((prev) => ({ ...prev, org: undefined }));
                    }}
                    aria-invalid={Boolean(errors.org)}
                    aria-describedby={errors.org ? "org-error" : undefined}
                    className={`w-full appearance-none rounded-xl border bg-cream/40 px-4 py-3 text-sm text-charcoal outline-none transition focus:border-forest-500 focus:bg-white ${
                      errors.org ? "border-red-400" : "border-forest-900/12"
                    } ${org ? "" : "text-charcoal-400"}`}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {ORG_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.org && (
                    <p id="org-error" className="mt-1.5 text-xs font-medium text-red-600">
                      {errors.org}
                    </p>
                  )}
                </div>

                <fieldset>
                  <legend className="mb-2 block text-sm font-semibold text-forest-900">
                    I&apos;d like to
                  </legend>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map((option) => {
                      const Icon = option.icon;
                      const active = role === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center text-xs font-semibold transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-amber-500 ${
                            active
                              ? "border-forest-500 bg-mint-100 text-forest-800"
                              : "border-forest-900/12 bg-cream/40 text-charcoal-600 hover:border-forest-200 hover:bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={option.value}
                            checked={active}
                            onChange={() => setRole(option.value)}
                            className="sr-only"
                          />
                          <Icon className="size-5" />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:bg-forest-800"
                >
                  Join the network
                  <ArrowRight className="size-4" />
                </button>

                <p className="text-center text-xs leading-relaxed text-charcoal-400">
                  You can choose whether you want to donate, receive food, or
                  volunteer — and change it any time.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
