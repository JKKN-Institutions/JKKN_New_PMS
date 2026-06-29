import { AppShell } from "@/components/layout/AppShell";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <AppShell
      userName={[session?.firstName, session?.lastName].filter(Boolean).join(" ") || session?.userName || "User"}
      isAdmin={session?.isAdmin ?? false}
    >
      {children}
    </AppShell>
  );
}
