import { and, eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { appointments, departments } from "@/db/schema";
import { fmtDate } from "@/lib/formatters";
import { Pagination } from "@/components/Pagination";

const PER_PAGE = 20;

export default async function PatientAppointmentsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const db = getDb();
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const offset = (page - 1) * PER_PAGE;

  const [rows, [{ total }]] = await Promise.all([
    db
      .select({
        id: appointments.id,
        appNumber: appointments.appNumber,
        dateStart: appointments.dateStart,
        status: appointments.status,
        isEmergency: appointments.isEmergency,
        isNew: appointments.isNew,
        tokenNo: appointments.tokenNo,
        deptName: departments.name,
      })
      .from(appointments)
      .leftJoin(departments, eq(appointments.departmentId, departments.id))
      .where(and(eq(appointments.parentId, params.id), eq(appointments.deleted, 0)))
      .orderBy(desc(appointments.dateStart))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(appointments)
      .where(and(eq(appointments.parentId, params.id), eq(appointments.deleted, 0))),
  ]);

  const totalPages = Math.ceil(Number(total) / PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Appointments <span className="font-normal text-gray-400">({total})</span>
        </h2>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="No appointments found for this patient." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>App #</Th>
                  <Th>Date / Time</Th>
                  <Th>Department</Th>
                  <Th>Token</Th>
                  <Th>Status</Th>
                  <Th>Flags</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td mono>{r.appNumber?.toString() ?? "—"}</Td>
                    <Td>{fmtDate(r.dateStart)}</Td>
                    <Td>{r.deptName ?? "—"}</Td>
                    <Td>{r.tokenNo ?? "—"}</Td>
                    <Td><StatusBadge status={r.status} /></Td>
                    <Td>
                      <div className="flex gap-1 flex-wrap">
                        {r.isEmergency === 1 && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">Emergency</span>}
                        {r.isNew === 1 && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">New</span>}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} total={Number(total)} basePath={`/patients/${params.id}/appointments`} />
        </>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">{message}</div>;
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{children}</th>;
}
function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return <td className={`px-4 py-3 whitespace-nowrap text-gray-700 ${mono ? "font-mono" : ""}`}>{children}</td>;
}
function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "—";
  const color = s === "Confirmed" ? "bg-green-100 text-green-700" : s === "Cancelled" ? "bg-red-100 text-red-700" : s === "Pending" ? "bg-yellow-100 text-yellow-700" : s === "Completed" ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{s}</span>;
}
