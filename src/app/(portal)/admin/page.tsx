import type { Metadata } from "next";
import { RoleOverview } from "@/components/layout/role-overview";

export const metadata: Metadata = {
  title: "Admin overview — Second Serving",
  description: "Approve partners and oversee the food redistribution network.",
};

export default function AdminPage() {
  return (
    <RoleOverview
      eyebrowText="Admin portal overview"
      title="Oversee the network"
      description="Approve partners, review activity and keep donations flowing safely across the platform."
    />
  );
}
