import type { Metadata } from "next";
import { DonorDashboard } from "@/components/donor/donor-dashboard";

export const metadata: Metadata = {
  title: "Donor overview — Second Serving",
  description:
    "List surplus food, track pickups and see the impact of your donations.",
};

export default function DonorPage() {
  return <DonorDashboard />;
}
