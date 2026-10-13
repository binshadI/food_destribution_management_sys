import type { ReactNode } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { ToastProvider } from "@/components/ui/toast";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <PortalShell>{children}</PortalShell>
    </ToastProvider>
  );
}
