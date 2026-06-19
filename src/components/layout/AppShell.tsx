"use client";

import { useState } from "react";
import { TopBar } from "./TopBar";
import { SideNav } from "./SideNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <TopBar onMenuToggle={() => setSidebarOpen(true)} />
      <SideNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="mt-14 min-h-[calc(100vh-3.5rem)] lg:ml-52 p-4 sm:p-6">
        {children}
      </main>
    </>
  );
}
