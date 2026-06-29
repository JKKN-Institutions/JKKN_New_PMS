import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { patients, appointments, billings, labrequests } from "@/db/schema";
import { fmtCurrency } from "@/lib/formatters";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold text-gray-700 mb-3">{children}</h2>
  );
}

const REPORT_LINKS = [
  {
    title: "Daily Collection",
    desc: "Payments and billings for today",
    href: "/reports/daily-collection",
  },
  {
    title: "Department Productivity",
    desc: "Worksteps and treatments by department",
    href: "/reports/dept-productivity",
  },
  {
    title: "Pending Approvals",
    desc: "Pending approveworksteps by faculty",
    href: "/reports/pending-approvals",
  },
  {
    title: "Lab TAT",
    desc: "Lab request turnaround time",
    href: "/reports/lab-tat",
  },
  {
    title: "Outstanding Patients",
    desc: "Patients with outstanding amounts",
    href: "/reports/outstanding",
  },
  {
    title: "Pharmacy Sales",
    desc: "Pharmacy sale summary",
    href: "/reports/pharmacy-sales",
  },
];

export default async function ReportsPage() {
  // Monthly stats
  let patientsThisMonth = 0;
  let revenueThisMonth = 0;
  let labThisMonth = 0;
  let apptByStatus: Array<{ status: string | null; count: number }> = [];

  try {
    const db = getDb();

    const results = await Promise.all([
      // Patients registered this month
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(patients)
        .where(
          and(
            eq(patients.deleted, 0),
            sql`MONTH(date_entered) = MONTH(CURDATE())`,
            sql`YEAR(date_entered) = YEAR(CURDATE())`
          )
        ),
      // Appointments this month by status
      db
        .select({
          status: appointments.status,
          count: sql<number>`COUNT(*)`,
        })
        .from(appointments)
        .where(
          and(
            eq(appointments.deleted, 0),
            sql`MONTH(date_entered) = MONTH(CURDATE())`,
            sql`YEAR(date_entered) = YEAR(CURDATE())`
          )
        )
        .groupBy(appointments.status),
      // Revenue this month
      db
        .select({
          revenue: sql<number>`COALESCE(SUM(final_amount), 0)`,
        })
        .from(billings)
        .where(
          and(
            eq(billings.deleted, 0),
            sql`MONTH(date_entered) = MONTH(CURDATE())`,
            sql`YEAR(date_entered) = YEAR(CURDATE())`
          )
        ),
      // Lab requests this month
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(labrequests)
        .where(
          and(
            eq(labrequests.deleted, 0),
            sql`MONTH(date_entered) = MONTH(CURDATE())`,
            sql`YEAR(date_entered) = YEAR(CURDATE())`
          )
        ),
    ]);

    patientsThisMonth = results[0][0]?.count ?? 0;
    apptByStatus = results[1] as Array<{ status: string | null; count: number }>;
    revenueThisMonth = results[2][0]?.revenue ?? 0;
    labThisMonth = results[3][0]?.count ?? 0;
  } catch {
    // DB not configured
  }

  const totalAppts = apptByStatus.reduce((s, r) => s + Number(r.count), 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Reports &amp; Dashboards
      </h1>

      {/* Monthly Summary */}
      <div className="mb-8">
        <SectionTitle>This Month&apos;s Summary</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="New Patients"
            value={patientsThisMonth}
            sub="registered this month"
          />
          <StatCard
            label="Total Appointments"
            value={totalAppts}
            sub="this month"
          />
          <StatCard
            label="Revenue"
            value={fmtCurrency(revenueThisMonth)}
            sub="billed this month"
          />
          <StatCard
            label="Lab Requests"
            value={labThisMonth}
            sub="this month"
          />
        </div>

        {/* Appointments by Status */}
        {apptByStatus.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">
                Appointments by Status (This Month)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                      Count
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {apptByStatus.map((r) => (
                    <tr key={r.status ?? "null"} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-700">
                        {r.status ?? "—"}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-900">
                        {r.count}
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {totalAppts > 0
                          ? `${((Number(r.count) / totalAppts) * 100).toFixed(1)}%`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Report links */}
      <SectionTitle>Available Reports</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORT_LINKS.map((r) => (
          <a
            key={r.href}
            href={r.href}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
              {r.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{r.desc}</p>
            <p className="text-xs text-blue-600 mt-3 group-hover:underline">
              View Report &rarr;
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
