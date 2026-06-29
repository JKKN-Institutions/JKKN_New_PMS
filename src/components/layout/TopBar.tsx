"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { logoutAction } from "@/app/actions/auth";

interface TopBarProps {
  onMenuToggle: () => void;
  userName?: string;
  isAdmin?: boolean;
}

export function TopBar({ onMenuToggle, userName = "User", isAdmin = false }: TopBarProps) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
        <Link href="/queue" className="hidden sm:inline text-xs text-gray-600 hover:text-blue-600 font-medium">
          Token Board
        </Link>

        {/* Notifications */}
        <button className="relative p-1.5 rounded-lg hover:bg-gray-100">
          <span className="text-gray-500 text-sm">🔔</span>
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {initials}
            </span>
            <span className="hidden md:inline text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {userName}
            </span>
            <svg className="w-3 h-3 text-gray-400 hidden md:block" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-800 truncate">{userName}</p>
                {isAdmin && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Admin</span>
                )}
              </div>

              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span>👤</span> My Profile
              </Link>

              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span>🔑</span> Change Password
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span>⚙️</span> Admin Panel
                </Link>
              )}

              <div className="border-t border-gray-100 mt-1">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <span>🚪</span> Logout
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
