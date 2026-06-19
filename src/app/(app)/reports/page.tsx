const REPORTS = [
  { title: "Daily Collection", desc: "Payments and billings for today", href: "/reports/daily-collection" },
  { title: "Department Productivity", desc: "Worksteps and treatments by department", href: "/reports/dept-productivity" },
  { title: "Pending Approvals", desc: "Pending approveworksteps by faculty", href: "/reports/pending-approvals" },
  { title: "Lab TAT", desc: "Lab request turnaround time", href: "/reports/lab-tat" },
  { title: "Outstanding Patients", desc: "Patients with outstanding amounts", href: "/reports/outstanding" },
  { title: "Pharmacy Sales", desc: "Pharmacy sale summary", href: "/reports/pharmacy-sales" },
];

export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reports & Dashboards</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORTS.map((r) => (
          <a
            key={r.href}
            href={r.href}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{r.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{r.desc}</p>
            <p className="text-xs text-blue-600 mt-3 group-hover:underline">View Report →</p>
          </a>
        ))}
      </div>
    </div>
  );
}
