import Link from "next/link";
import { and, eq, desc, sql, or, like } from "drizzle-orm";
import { getDb } from "@/db";
import { appointments, patients, departments } from "@/db/schema";
import { fmtDate } from "@/lib/formatters";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/Button";

const PER_PAGE = 20;

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "—";
  const color =
    s === "Confirmed" || s === "Completed"
      ? "bg-green-100 text-green-700"
      : s === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : s === "Cancelled"
      ? "bg-red-100 text-red-700"
      : s === "Scheduled"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {s}
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({
  children,
  mono,
}: {
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <td
      className={`px-4 py-3 whitespace-nowrap text-gray-700 ${
        mono ? "font-mono" : ""
      }`}
    >
      {children}
    </td>
  );
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string; status?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const offset = (page - 1) * PER_PAGE;
  const q = searchParams.q?.trim() ?? "";
  const statusFilter = searchParams.status ?? "";

  let rows: Array<{
    id: string;
    appNumber: number | null;
    dateStart: Date | null;
    status: string | null;
    isEmergency: number | null;
    tokenNo: string | null;
    deptName: string | null;
    patFirst: string | null;
    patLast: string | null;
    patPhone: string | null;
  }> = [];
  let total = 0;

  try {
    const db = getDb();

    const conditions = [eq(appointments.deleted, 0)];
    if (statusFilter) conditions.push(eq(appointments.status, statusFilter));
    if (q) {
      conditions.push(
        or(
          like(patients.firstName, `%${q}%`),
          like(patients.lastName, `%${q}%`),
          sql`CAST(${appointments.appNumber} AS CHAR) LIKE ${`%${q}%`}`
        )!
      );
    }

    const where = and(...conditions);

    const [rowsResult, countResult] = await Promise.all([
      db
        .select({
          id: appointments.id,
          appNumber: appointments.appNumber,
          dateStart: appointments.dateStart,
          status: appointments.status,
          isEmergency: appointments.isEmergency,
          tokenNo: appointments.tokenNo,
          deptName: departments.name,
          patFirst: patients.firstName,
          patLast: patients.lastName,
          patPhone: patients.phoneMobile,
        })
        .from(appointments)
        .leftJoin(departments, eq(appointments.departmentId, departments.id))
        .leftJoin(patients, eq(appointments.parentId, patients.id))
        .where(where)
        .orderBy(desc(appointments.dateStart))
        .limit(PER_PAGE)
        .offset(offset),
      db
        .select({ total: sql<number>`COUNT(*)` })
        .from(appointments)
        .leftJoin(patients, eq(appointments.parentId, patients.id))
        .where(where),
    ]);

    rows = rowsResult;
    total = countResult[0]?.total ?? 0;
  } catch {
    // DB not configured
  }

  const totalPages = Math.ceil(total / PER_PAGE);

  const buildUrl = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (statusFilter) params.set("status", statusFilter);
    params.set("page", "1");
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    return `/appointments?${params.toString()}`;
  };

  const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled", "Scheduled"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Appointments
        </h1>
        <div className="flex gap-2 flex-wrap justify-end">
          <Link href="/appointments/calendar">
            <Button variant="secondary" size="sm">
              Calendar
            </Button>
          </Link>
          <Button size="sm">+ New</Button>
        </div>
      </div>

      {/* Filter bar */}
      <form method="GET" action="/appointments">
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap gap-3 shadow-sm">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search patient name or app #…"
            className="flex-1 min-w-[160px] border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            defaultValue={statusFilter}
            className="w-full sm:w-44 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
          {(q || statusFilter) && (
            <Link
              href="/appointments"
              className="px-4 py-1.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th>App #</Th>
                <Th>Date / Time</Th>
                <Th>Patient</Th>
                <Th>Department</Th>
                <Th>Token</Th>
                <Th>Status</Th>
                <Th>Emg</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-400 text-sm"
                  >
                    No appointments found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td mono>
                      <Link
                        href={`/appointments/${r.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {r.appNumber ?? "—"}
                      </Link>
                    </Td>
                    <Td>{r.dateStart ? fmtDate(r.dateStart, "dd MMM yyyy HH:mm") : "—"}</Td>
                    <Td>
                      {[r.patFirst, r.patLast].filter(Boolean).join(" ") || "—"}
                      {r.patPhone && (
                        <span className="block text-xs text-gray-400">
                          {r.patPhone}
                        </span>
                      )}
                    </Td>
                    <Td>{r.deptName ?? "—"}</Td>
                    <Td mono>{r.tokenNo ?? "—"}</Td>
                    <Td>
                      <StatusBadge status={r.status} />
                    </Td>
                    <Td>
                      {r.isEmergency ? (
                        <span className="text-red-600 font-bold text-xs">
                          YES
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              basePath={buildUrl({})}
            />
          </div>
        )}
      </div>
    </div>
  );
}
