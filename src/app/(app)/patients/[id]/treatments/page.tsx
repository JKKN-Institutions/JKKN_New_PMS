import { and, eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { treatments, casesheets, treatmentlists } from "@/db/schema";
import { fmtDate } from "@/lib/formatters";
import { Pagination } from "@/components/Pagination";

const PER_PAGE = 20;

export default async function PatientTreatmentsPage({
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
        id: treatments.id,
        toothNo: treatments.toothNo,
        status: treatments.status,
        units: treatments.units,
        treatmentType: treatments.treatmentType,
        treatmentStartdate: treatments.treatmentStartdate,
        treatmentEnddate: treatments.treatmentEnddate,
        treatmentName: treatmentlists.name,
      })
      .from(treatments)
      .innerJoin(casesheets, eq(treatments.parentId, casesheets.id))
      .leftJoin(treatmentlists, eq(treatments.treatmentlistId, treatmentlists.id))
      .where(and(eq(casesheets.patientId, params.id), eq(treatments.deleted, 0)))
      .orderBy(desc(treatments.dateEntered))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(treatments)
      .innerJoin(casesheets, eq(treatments.parentId, casesheets.id))
      .where(and(eq(casesheets.patientId, params.id), eq(treatments.deleted, 0))),
  ]);

  const totalPages = Math.ceil(Number(total) / PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Treatments <span className="font-normal text-gray-400">({total})</span>
        </h2>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="No treatments found for this patient." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Treatment</Th><Th>Type</Th><Th>Tooth</Th><Th>Units</Th><Th>Start</Th><Th>End</Th><Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td>{r.treatmentName ?? "—"}</Td>
                    <Td>{r.treatmentType ?? "—"}</Td>
                    <Td>{r.toothNo ?? "—"}</Td>
                    <Td>{r.units?.toString() ?? "—"}</Td>
                    <Td>{fmtDate(r.treatmentStartdate)}</Td>
                    <Td>{fmtDate(r.treatmentEnddate)}</Td>
                    <Td><StatusBadge status={r.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} total={Number(total)} basePath={`/patients/${params.id}/treatments`} />
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
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 whitespace-nowrap text-gray-700">{children}</td>;
}
function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "—";
  const color = s === "Completed" ? "bg-green-100 text-green-700" : s === "In Progress" ? "bg-blue-100 text-blue-700" : s === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{s}</span>;
}
