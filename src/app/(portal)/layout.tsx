import type { ReactNode } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { RoleGuard } from "@/components/layout/role-guard";
import { ToastProvider } from "@/components/ui/toast";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <RoleGuard>
        <PortalShell>{children}</PortalShell>
      </RoleGuard>
    </ToastProvider>
  );
}
