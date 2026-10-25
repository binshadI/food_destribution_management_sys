"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BrandMark,
  HandHeart,
  Sprout,
  Truck,
} from "@/components/landing/icons";
import { Eye, EyeOff, Info, Mail } from "@/components/ui/icons";
import {
  btnPrimary,
  errorText,
  inputBase,
  inputError,
  labelBase,
} from "@/components/ui/styles";
import { roleHomePath, setSession, type SessionUser } from "@/lib/session";

type Role = "donor" | "receiver" | "volunteer";

const ROLE_TABS: {
  value: Role;
  label: string;
  blurb: string;
  icon: typeof Sprout;
}[] = [
  { value: "donor", label: "Donor", blurb: "Share surplus food", icon: Sprout },
  {
    value: "receiver",
    label: "Receiver",
    blurb: "Request food for your community",
    icon: HandHeart,
  },
  {
    value: "volunteer",
    label: "Volunteer",
    blurb: "Help deliver food",
    icon: Truck,
  },
];

const DEMO_ACCOUNTS: { role: Role; email: string }[] = [
  { role: "donor", email: "green@fw.org" },
  { role: "receiver", email: "hope@fw.org" },
  { role: "volunteer", email: "arun@fw.org" },
];

type LoginResponse = { user?: SessionUser; error?: string; role?: string };

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("donor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Enter your email address and password to continue.");
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, role }),
      });
      const data = (await response.json()) as LoginResponse;

      if (!response.ok || !data.user) {
        const message =
          data.error ?? "Unable to sign you in. Please try again.";
        if (data.role && data.role !== role && data.role !== "admin") {
          setRole(data.role as Role);
          setError(
            `${message} The ${data.role} tab is now selected — press Sign in again.`,
          );
        } else {
          setError(message);
        }
        setPending(false);
        return;
      }

      setSession(data.user);
      router.replace(roleHomePath(data.user.role));
    } catch {
      setError("We couldn't reach the server. Check your connection and retry.");
      setPending(false);
    }
  }

  function fillDemo(account: { role: Role; email: string }) {
    setRole(account.role);
    setEmail(account.email);
    setPassword("password123");
    setError(null);
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-forest-900 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(134,239,172,0.25),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(251,191,36,0.22),transparent_40%)]"
        />
        <div className="relative p-10 xl:p-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-mint-100"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-forest-700">
              <BrandMark className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              Second<span className="text-mint-300">Serving</span>
            </span>
          </Link>

          <h1 className="mt-16 max-w-md text-4xl font-bold leading-tight tracking-tight text-white xl:text-[2.75rem]">
            Good food should feed people, not landfill.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mint-100/80">
            Sign in to share surplus, request food for your community, or keep
            deliveries moving. Your role opens the right portal.
          </p>

          <ul className="mt-10 space-y-4">
            {ROLE_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <li key={tab.value} className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-mint-200">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {tab.label}
                    </p>
                    <p className="text-xs text-mint-100/70">{tab.blurb}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="relative p-10 text-xs text-mint-100/60 xl:p-14">
          Every listing keeps good food out of landfill and puts a warm meal on
          someone&apos;s table.
        </p>
      </aside>

      <main className="flex items-center justify-center px-5 py-10 sm:px-8 sm:py-14">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 lg:hidden"
            aria-label="Second Serving home"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-forest-700 text-mint-100">
              <BrandMark className="size-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-forest-900">
              Second<span className="text-forest-500">Serving</span>
            </span>
          </Link>

          <div className="mt-8 lg:mt-0">
            <h2 className="text-2xl font-bold tracking-tight text-forest-900 sm:text-3xl">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-charcoal-600">
              Sign in to your Second Serving portal.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Choose your role"
            className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-sage-200 bg-white p-1.5"
          >
            {ROLE_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = role === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setRole(tab.value);
                    setError(null);
                  }}
                  className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs font-semibold transition ${
                    active
                      ? "bg-mint-100 text-forest-800 shadow-soft"
                      : "text-charcoal-500 hover:bg-sage-100 hover:text-forest-800"
                  }`}
                >
                  <Icon className="size-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className={labelBase}>
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-charcoal-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@organisation.org"
                  className={`${inputBase} pl-11`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className={labelBase}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  aria-invalid={Boolean(error)}
                  className={`${inputBase} pr-11 ${error ? inputError : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-charcoal-400 transition hover:bg-sage-100 hover:text-forest-800"
                >
                  {showPassword ? (
                    <EyeOff className="size-[18px]" />
                  ) : (
                    <Eye className="size-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <p
                role="alert"
                className={`${errorText} flex items-start gap-1.5`}
              >
                <Info className="mt-0.5 size-3.5 shrink-0" />
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className={`${btnPrimary} w-full py-3`}
            >
              {pending ? "Signing in…" : "Sign in"}
              {pending ? null : <ArrowRight className="size-4" />}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-sage-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal-400">
              Demo accounts
            </p>
            <p className="mt-1.5 text-xs text-charcoal-500">
              Password{" "}
              <code className="rounded bg-sage-100 px-1.5 py-0.5 font-mono text-[0.7rem] text-forest-800">
                password123
              </code>{" "}
              · tap to fill
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemo(account)}
                  className="rounded-full border border-sage-300 bg-sage-50 px-3 py-1.5 text-xs font-medium text-forest-800 transition hover:border-forest-300 hover:bg-mint-100"
                >
                  {account.role} · {account.email}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-charcoal-600">
            New to Second Serving?{" "}
            <Link
              href="/#join"
              className="font-semibold text-forest-700 underline underline-offset-4 transition hover:text-forest-900"
            >
              Join the network
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
