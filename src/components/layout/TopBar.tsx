"use client";

import Link from "next/link";
import { useState } from "react";

export function TopBar() {
  const [query, setQuery] = useState("");

  return (
    <header className="fixed top-0 inset-x-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
      <Link href="/dashboard" className="font-bold text-blue-700 text-sm whitespace-nowrap">
        ORION PMS
      </Link>

      {/* Global patient search */}
      <div className="flex-1 max-w-sm">
        <input
          type="search"
          placeholder="Search patient by number, name, phone…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Token board link */}
        <Link href="/queue" className="text-xs text-gray-600 hover:text-blue-600 font-medium">
          Token Board
        </Link>

        {/* Notifications placeholder */}
        <button className="relative p-1.5 rounded-lg hover:bg-gray-100">
          <span className="text-gray-500 text-sm">🔔</span>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User menu placeholder */}
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
          <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
            U
          </span>
          <span className="hidden md:inline">User</span>
        </button>
      </div>
    </header>
  );
}
