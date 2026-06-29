"use client";

import Link from "next/link";
import { useState } from "react";
import { logoutAction } from "@/app/actions/auth";

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const [query, setQuery] = useState("");

  return (
    <header className="fixed top-0 inset-x-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center px-3 sm:px-4 gap-2 sm:gap-4">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 shrink-0"
        aria-label="Open navigation"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <Link href="/dashboard" className="font-bold text-blue-700 text-sm whitespace-nowrap shrink-0">
        JKKN PMS
      </Link>

      {/* Global patient search */}
      <div className="flex-1 min-w-0 max-w-sm">
        <input
          type="search"
          placeholder="Search patient…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Token board — hidden on very small screens */}
        <Link href="/queue" className="hidden sm:inline text-xs text-gray-600 hover:text-blue-600 font-medium">
          Token Board
        </Link>

        {/* Notifications */}
        <button className="relative p-1.5 rounded-lg hover:bg-gray-100">
          <span className="text-gray-500 text-sm">🔔</span>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User menu + logout */}
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
            U
          </span>
          <form action={logoutAction}>
            <button type="submit" className="hidden md:inline text-xs text-gray-500 hover:text-red-600 transition-colors">
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
