"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV_GROUPS = [
  {
    label: "Clinical",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/patients", label: "Patients" },
      { href: "/appointments", label: "Appointments" },
      { href: "/appointments/calendar", label: "Calendar" },
      { href: "/queue", label: "Token Queue" },
    ],
  },
  {
    label: "Case Work",
    items: [
      { href: "/worklist", label: "My Worklist" },
      { href: "/approvals", label: "Approvals" },
    ],
  },
  {
    label: "Ancillary",
    items: [
      { href: "/lab/requests", label: "Lab Requests" },
      { href: "/lab/worklist", label: "Lab Worklist" },
      { href: "/pharmacy/pos", label: "Pharmacy POS" },
      { href: "/pharmacy/stock", label: "Pharmacy Stock" },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/billing", label: "Billing" },
      { href: "/billing/cashier", label: "Cashier" },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/reports", label: "Reports" },
      { href: "/admin", label: "Admin" },
    ],
  },
];

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideNav({ isOpen, onClose }: SideNavProps) {
  const pathname = usePathname();

  const navContent = (
    <div className="py-4 h-full overflow-y-auto">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-4">
          <p className="px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            {group.label}
          </p>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center px-4 py-2.5 text-sm transition-colors",
                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  ? "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop: always-visible fixed sidebar */}
      <nav className="hidden lg:flex flex-col fixed left-0 top-14 bottom-0 w-52 bg-white border-r border-gray-200 z-20">
        {navContent}
      </nav>

      {/* Mobile: slide-in drawer with backdrop */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <nav className="relative w-64 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 shrink-0">
              <span className="font-bold text-blue-700 text-sm">ORION PMS</span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                aria-label="Close navigation"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {navContent}
          </nav>
        </div>
      )}
    </>
  );
}
