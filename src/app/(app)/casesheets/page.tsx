import { and, eq, desc, sql, like, or } from "drizzle-orm";
import { getDb } from "@/db";
import { casesheets, patients, departments } from "@/db/schema";
import { fmtDate } from "@/lib/formatters";
import { Pagination } from "@/components/Pagination";

const PER_PAGE = 20;

export default async function CaseSheetsPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string; status?: string };
}) {
  const db = getDb();
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const offset = (page - 1) * PER_PAGE;
  const q = searchParams.q?.trim() ?? "";
  const status = searchParams.status ?? "";

  const conditions = [eq(casesheets.deleted, 0)];
  if (status) conditions.push(eq(casesheets.status, status));
  if (q) {
    conditions.push(
      or(
        like(patients.firstName, `%${q}%`),
        like(patients.lastName, `%${q}%`),
        like(sql`CAST(${casesheets.caseNumber} AS CHAR)`, `%${q}%`)
      )!
    );
  }

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: casesheets.id,
        caseNumber: casesheets.caseNumber,
        casesheetType: casesheets.casesheetType,
        treatmentType: casesheets.treatmentType,
        status: casesheets.status,
        casesheetDate: casesheets.casesheetDate,
        dateEntered: casesheets.dateEntered,
        deptName: departments.name,
        patientId: patients.id,
        firstName: patients.firstName,
        lastName: patients.lastName,
        patNumber: patients.patNumber,
      })
      .from(casesheets)
      .leftJoin(patients, eq(casesheets.patientId, patients.id))
      .leftJoin(departments, eq(casesheets.departmentId, departments.id))
      .where(and(...conditions))
      .orderBy(desc(casesheets.dateEntered))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(casesheets)
      .leftJoin(patients, eq(casesheets.patientId, patients.id))
      .where(and(...conditions)),
  ]);

  const totalPages = Math.ceil(Number(total) / PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Case Sheets</h1>
      </div>

      {/* Filters */}
      <form method="GET" className="flex gap-3 mb-5 flex-wrap">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by patient name or case #"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="status"
          defaultValue={status}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
          <option value="Pending">Pending</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
        {(q || status) && (
          <a
            href="/casesheets"
            className="text-sm text-gray-500 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Clear
          </a>
        )}
      </form>

      {rows.length === 0 ? (
        <EmptyState message="No case sheets found." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Case #</Th>
                  <Th>Patient</Th>
                  <Th>Department</Th>
                  <Th>Type</Th>
                  <Th>Treatment</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td mono>{r.caseNumber?.toString() ?? "—"}</Td>
                    <Td>
                      <div>
                        <p className="font-medium text-gray-800">
                          {[r.firstName, r.lastName].filter(Boolean).join(" ") || "—"}
                        </p>
                        {r.patNumber && (
                          <p className="text-xs text-gray-400">#{r.patNumber}</p>
                        )}
                      </div>
                    </Td>
                    <Td>{r.deptName ?? "—"}</Td>
                    <Td>{r.casesheetType ?? "—"}</Td>
                    <Td>{r.treatmentType ?? "—"}</Td>
                    <Td><StatusBadge status={r.status} /></Td>
                    <Td>{fmtDate(r.casesheetDate ?? r.dateEntered)}</Td>
                    <Td>
                      <a
                        href={`/casesheets/${r.id}`}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        Open →
                      </a>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            total={Number(total)}
            basePath="/casesheets"
          />
        </>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
      {message}
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td className={`px-4 py-3 whitespace-nowrap text-gray-700 ${mono ? "font-mono" : ""}`}>
      {children}
    </td>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "—";
  const color =
    s === "Open" ? "bg-green-100 text-green-700" :
    s === "Closed" ? "bg-gray-100 text-gray-600" :
    s === "Pending" ? "bg-yellow-100 text-yellow-700" :
    "bg-blue-100 text-blue-700";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {s}
    </span>
  );
}
