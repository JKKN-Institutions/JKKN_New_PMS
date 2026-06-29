import { and, eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  patients,
  appointments,
  billings,
  labrequests,
  departments,
} from "@/db/schema";
import { fmtDate, fmtCurrency } from "@/lib/formatters";
import Link from "next/link";

function KpiCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border p-5 bg-white shadow-sm border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "—";
  const color =
    s === "Active" || s === "Confirmed" || s === "Completed"
      ? "bg-green-100 text-green-700"
      : s === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : s === "Cancelled" || s === "Inactive"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {s}
    </span>
  );
}

export default async function DashboardPage() {
  let totalPatients = 0;
  let todayAppointmentsCount = 0;
  let monthlyRevenue = 0;
  let pendingLab = 0;
  let recentPatients: Array<{
    id: string;
    patNumber: number | null;
    firstName: string | null;
    lastName: string | null;
    phoneMobile: string | null;
    status: string | null;
    dateEntered: Date | null;
  }> = [];
  let todayAppointments: Array<{
    id: string;
    appNumber: number | null;
    dateStart: Date | null;
    status: string | null;
    tokenNo: string | null;
    deptName: string | null;
  }> = [];

  try {
    const db = getDb();

    const results = await Promise.all([
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(patients)
        .where(eq(patients.deleted, 0)),
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(appointments)
        .where(
          and(
            eq(appointments.deleted, 0),
            sql`DATE(date_start) = CURDATE()`
          )
        ),
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
      db
        .select({ count: sql<number>`COUNT(*)` })
        .from(labrequests)
        .where(
          and(
            eq(labrequests.deleted, 0),
            eq(labrequests.labRequestStatus, "Pending")
          )
        ),
      db
        .select({
          id: patients.id,
          patNumber: patients.patNumber,
          firstName: patients.firstName,
          lastName: patients.lastName,
          phoneMobile: patients.phoneMobile,
          status: patients.status,
          dateEntered: patients.dateEntered,
        })
        .from(patients)
        .where(eq(patients.deleted, 0))
        .orderBy(desc(patients.dateEntered))
        .limit(5),
      db
        .select({
          id: appointments.id,
          appNumber: appointments.appNumber,
          dateStart: appointments.dateStart,
          status: appointments.status,
          tokenNo: appointments.tokenNo,
          deptName: departments.name,
        })
        .from(appointments)
        .leftJoin(departments, eq(appointments.departmentId, departments.id))
        .where(
          and(
            eq(appointments.deleted, 0),
            sql`DATE(date_start) = CURDATE()`
          )
        )
        .orderBy(appointments.dateStart)
        .limit(10),
    ]);

    totalPatients = results[0][0]?.count ?? 0;
    todayAppointmentsCount = results[1][0]?.count ?? 0;
    monthlyRevenue = results[2][0]?.revenue ?? 0;
    pendingLab = results[3][0]?.count ?? 0;
    recentPatients = results[4];
    todayAppointments = results[5];
  } catch {
    // DB not available; leave defaults
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome to ORION PMS</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Total Patients"
          value={totalPatients.toLocaleString()}
          icon="👤"
          color="text-blue-600"
        />
        <KpiCard
          label="Today's Appointments"
          value={todayAppointmentsCount.toLocaleString()}
          icon="📅"
          color="text-green-600"
        />
        <KpiCard
          label="Monthly Revenue"
          value={fmtCurrency(monthlyRevenue)}
          icon="💰"
          color="text-purple-600"
        />
        <KpiCard
          label="Pending Lab Requests"
          value={pendingLab.toLocaleString()}
          icon="🔬"
          color="text-yellow-600"
        />
      </div>

      {/* Two-column tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              Recent Patients
            </h2>
            <Link
              href="/patients"
              className="text-xs text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {recentPatients.length === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center">
              No patients found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                      Pat #
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                      Registered
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-600 font-mono text-xs">
                        {p.patNumber ?? "—"}
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          href={`/patients/${p.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {[p.firstName, p.lastName].filter(Boolean).join(" ") ||
                            "—"}
                        </Link>
                      </td>
                      <td className="px-4 py-2">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">
                        {fmtDate(p.dateEntered)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              Today&apos;s Appointments
            </h2>
            <Link
              href="/appointments"
              className="text-xs text-blue-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {todayAppointments.length === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center">
              No appointments today.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                      Token
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                      Department
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {todayAppointments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono text-xs text-gray-600">
                        {a.tokenNo ?? a.appNumber ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-gray-700 text-xs">
                        {a.deptName ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-gray-500 text-xs">
                        {a.dateStart
                          ? fmtDate(a.dateStart, "hh:mm a")
                          : "—"}
                      </td>
                      <td className="px-4 py-2">
                        <StatusBadge status={a.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
