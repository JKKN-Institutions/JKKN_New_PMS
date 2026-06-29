"use client";

import { useState } from "react";
import { TopBar } from "./TopBar";
import { SideNav } from "./SideNav";

interface AppShellProps {
  children: React.ReactNode;
  userName?: string;
  isAdmin?: boolean;
}

export function AppShell({ children, userName = "User", isAdmin = false }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <TopBar
        onMenuToggle={() => setSidebarOpen(true)}
        userName={userName}
        isAdmin={isAdmin}
      />
      <SideNav isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="mt-14 min-h-[calc(100vh-3.5rem)] lg:ml-52 p-4 sm:p-6">
        {children}
      </main>
    </>
  );
}
