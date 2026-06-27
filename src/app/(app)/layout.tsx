import { AppShell } from "@/components/layout/AppShell";

// Force all authenticated app pages to render dynamically at request time.
// Prevents Next.js from prerendering DB-dependent pages at build time.
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
