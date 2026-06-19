import { TopBar } from "@/components/layout/TopBar";
import { SideNav } from "@/components/layout/SideNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <SideNav />
      <main className="ml-52 mt-14 min-h-[calc(100vh-3.5rem)] p-6">
        {children}
      </main>
    </>
  );
}
