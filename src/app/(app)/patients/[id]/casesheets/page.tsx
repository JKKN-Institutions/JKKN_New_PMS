import { and, eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { casesheets, departments, complaints, complaintlists } from "@/db/schema";
import { fmtDate } from "@/lib/formatters";
import { Pagination } from "@/components/Pagination";

const PER_PAGE = 20;

export default async function PatientCasesheetsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const db = getDb();
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const offset = (page - 1) * PER_PAGE;

  const [rows, [{ total }], complaintRows] = await Promise.all([
    db
      .select({
        id: casesheets.id,
        caseNumber: casesheets.caseNumber,
        casesheetType: casesheets.casesheetType,
        treatmentType: casesheets.treatmentType,
        status: casesheets.status,
        casesheetDate: casesheets.casesheetDate,
        deptName: departments.name,
      })
      .from(casesheets)
      .leftJoin(departments, eq(casesheets.departmentId, departments.id))
      .where(and(eq(casesheets.patientId, params.id), eq(casesheets.deleted, 0)))
      .orderBy(desc(casesheets.dateEntered))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(casesheets)
      .where(and(eq(casesheets.patientId, params.id), eq(casesheets.deleted, 0))),
    db
      .select({
        id: complaints.id,
        parentId: complaints.parentId,
        toothNo: complaints.toothNo,
        description: complaints.description,
        complaintName: complaintlists.name,
      })
      .from(complaints)
      .innerJoin(casesheets, eq(complaints.parentId, casesheets.id))
      .leftJoin(complaintlists, eq(complaints.complaintlistId, complaintlists.id))
      .where(
        and(
          eq(complaints.parentType, "Casesheets"),
          eq(casesheets.patientId, params.id),
          eq(complaints.deleted, 0)
        )
      ),
  ]);

  const totalPages = Math.ceil(Number(total) / PER_PAGE);
  const complaintsByCasesheet = complaintRows.reduce<Record<string, typeof complaintRows>>(
    (acc, c) => {
      const key = c.parentId ?? "";
      if (!acc[key]) acc[key] = [];
      acc[key].push(c);
      return acc;
    },
    {}
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Case Sheets <span className="font-normal text-gray-400">({total})</span>
        </h2>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="No case sheets recorded for this patient." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Case #</Th>
                  <Th>Department</Th>
                  <Th>Type</Th>
                  <Th>Treatment</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((r) => {
                  const cComplaints = complaintsByCasesheet[r.id] ?? [];
                  return (
                    <>
                      <tr key={r.id} className="hover:bg-gray-50">
                        <Td mono>{r.caseNumber?.toString() ?? "—"}</Td>
                        <Td>{r.deptName ?? "—"}</Td>
                        <Td>{r.casesheetType ?? "—"}</Td>
                        <Td>{r.treatmentType ?? "—"}</Td>
                        <Td>{fmtDate(r.casesheetDate)}</Td>
                        <Td><StatusBadge status={r.status} /></Td>
                      </tr>
                      {cComplaints.length > 0 && (
                        <tr key={`${r.id}-c`} className="bg-blue-50">
                          <td colSpan={6} className="px-4 py-2">
                            <p className="text-xs font-semibold text-blue-600 mb-1">
                              Complaints ({cComplaints.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {cComplaints.map((c) => (
                                <span key={c.id} className="inline-flex items-center gap-1 text-xs bg-white border border-blue-200 text-blue-800 rounded-full px-2 py-0.5">
                                  {c.complaintName || c.description || "—"}
                                  {c.toothNo && <span className="text-blue-400">#{c.toothNo}</span>}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} total={Number(total)} basePath={`/patients/${params.id}/casesheets`} />
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
  const color = s === "Open" ? "bg-green-100 text-green-700" : s === "Closed" ? "bg-gray-100 text-gray-600" : s === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{s}</span>;
}
