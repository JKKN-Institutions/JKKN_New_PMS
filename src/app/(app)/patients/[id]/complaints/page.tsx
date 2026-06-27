import { and, eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { complaints, casesheets, complaintlists } from "@/db/schema";
import { fmtDate } from "@/lib/formatters";
import { Pagination } from "@/components/Pagination";

const PER_PAGE = 20;

export default async function PatientComplaintsPage({
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
        id: complaints.id,
        description: complaints.description,
        toothNo: complaints.toothNo,
        dateEntered: complaints.dateEntered,
        complaintName: complaintlists.name,
        caseNumber: casesheets.caseNumber,
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
      )
      .orderBy(desc(complaints.dateEntered))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(complaints)
      .innerJoin(casesheets, eq(complaints.parentId, casesheets.id))
      .where(
        and(
          eq(complaints.parentType, "Casesheets"),
          eq(casesheets.patientId, params.id),
          eq(complaints.deleted, 0)
        )
      ),
  ]);

  const totalPages = Math.ceil(Number(total) / PER_PAGE);
  const basePath = `/patients/${params.id}/complaints`;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Complaints <span className="font-normal text-gray-400">({total})</span>
        </h2>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="No complaints recorded for this patient." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Complaint</Th>
                  <Th>Description</Th>
                  <Th>Tooth #</Th>
                  <Th>Case Sheet</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td>
                      <span className="font-medium">{r.complaintName ?? "—"}</span>
                    </Td>
                    <Td>{r.description ?? "—"}</Td>
                    <Td>{r.toothNo ?? "—"}</Td>
                    <Td>
                      {r.caseNumber ? (
                        <span className="font-mono text-xs">{r.caseNumber}</span>
                      ) : (
                        "—"
                      )}
                    </Td>
                    <Td>{fmtDate(r.dateEntered)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} total={Number(total)} basePath={basePath} />
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

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-gray-700">{children}</td>;
}
