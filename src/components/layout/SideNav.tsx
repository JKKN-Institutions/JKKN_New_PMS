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

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-14 bottom-0 w-52 bg-white border-r border-gray-200 overflow-y-auto z-20 py-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="mb-4">
          <p className="px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            {group.label}
          </p>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm rounded-none transition-colors",
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
    </nav>
  );
}
