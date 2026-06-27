import { and, eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { labrequests, labsetups, labsetupgroups } from "@/db/schema";
import { fmtDate } from "@/lib/formatters";
import { Pagination } from "@/components/Pagination";

const PER_PAGE = 20;

export default async function PatientLabPage({
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
        id: labrequests.id,
        labNumber: labrequests.labNumber,
        labRequestStatus: labrequests.labRequestStatus,
        requestDate: labrequests.requestDate,
        sampleDate: labrequests.sampleDate,
        doneDate: labrequests.doneDate,
        testName: labsetups.name,
        groupName: labsetupgroups.name,
      })
      .from(labrequests)
      .leftJoin(labsetups, eq(labrequests.testId, labsetups.id))
      .leftJoin(labsetupgroups, eq(labrequests.labsetupgroupId, labsetupgroups.id))
      .where(and(eq(labrequests.patientId, params.id), eq(labrequests.deleted, 0)))
      .orderBy(desc(labrequests.requestDate))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(labrequests)
      .where(and(eq(labrequests.patientId, params.id), eq(labrequests.deleted, 0))),
  ]);

  const totalPages = Math.ceil(Number(total) / PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Lab Requests <span className="font-normal text-gray-400">({total})</span>
        </h2>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="No lab requests found for this patient." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Lab #</Th><Th>Test</Th><Th>Group</Th><Th>Requested</Th><Th>Sample Date</Th><Th>Done Date</Th><Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td mono>{r.labNumber?.toString() ?? "—"}</Td>
                    <Td>{r.testName ?? "—"}</Td>
                    <Td>{r.groupName ?? "—"}</Td>
                    <Td>{fmtDate(r.requestDate)}</Td>
                    <Td>{fmtDate(r.sampleDate)}</Td>
                    <Td>{fmtDate(r.doneDate)}</Td>
                    <Td><StatusBadge status={r.labRequestStatus} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} total={Number(total)} basePath={`/patients/${params.id}/lab`} />
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
  const color = s === "Done" ? "bg-green-100 text-green-700" : s === "Pending" ? "bg-yellow-100 text-yellow-700" : s === "Collected" ? "bg-blue-100 text-blue-700" : s === "Cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{s}</span>;
}
