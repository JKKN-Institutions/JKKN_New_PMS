const ADMIN_SECTIONS = [
  { title: "Treatment Catalog", desc: "Treatment lists, groups, billable treatments & charges", href: "/admin/treatments" },
  { title: "Diagnosis & Complaint Catalogs", desc: "Cascading diagnosis taxonomy and complaint lists", href: "/admin/diagnosis" },
  { title: "Drug Formulary", desc: "Prescription brands and templates", href: "/admin/drugs" },
  { title: "Departments & Chairs", desc: "Department setup and scheduler configuration", href: "/admin/departments" },
  { title: "Users & Roles", desc: "Login users, user types, and ACL matrix editor", href: "/admin/users" },
  { title: "Patient Groups & Categories", desc: "Patient groups, categories, and insurance providers", href: "/admin/patient-config" },
  { title: "Number Sequences", desc: "Patient / case / bill number format configuration", href: "/admin/sequences" },
];

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Administration</h1>
      <p className="text-sm text-gray-500 mb-6">Master data and system configuration. Access gated by Admin role.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {ADMIN_SECTIONS.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">{s.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
            <p className="text-xs text-blue-600 mt-3 group-hover:underline">Configure →</p>
          </a>
        ))}
      </div>
    </div>
  );
}
