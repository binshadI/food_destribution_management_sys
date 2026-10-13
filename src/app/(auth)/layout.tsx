import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign in — Second Serving",
  description:
    "Sign in to the Second Serving portal to donate surplus food, request food for your community, or manage deliveries.",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-cream">{children}</div>;
}
