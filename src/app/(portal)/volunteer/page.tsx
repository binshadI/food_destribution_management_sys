import type { Metadata } from "next";
import { VolunteerDashboard } from "@/components/volunteer/volunteer-dashboard";

export const metadata: Metadata = {
  title: "Volunteer overview — Second Serving",
  description: "Pick up and deliver matched food donations near you.",
};

export default function VolunteerPage() {
  return <VolunteerDashboard />;
}
