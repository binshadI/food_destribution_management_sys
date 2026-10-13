import type { Metadata } from "next";
import { ReceiverDashboard } from "@/components/receiver/receiver-dashboard";

export const metadata: Metadata = {
  title: "Receiver overview — Second Serving",
  description:
    "Request food for your community and track matched donations.",
};

export default function ReceiverPage() {
  return <ReceiverDashboard />;
}
