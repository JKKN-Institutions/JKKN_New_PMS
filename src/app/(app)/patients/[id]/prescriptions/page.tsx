import { and, eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { prescriptions, casesheets, prescriptionbrands, prescriptionlists } from "@/db/schema";
import { fmtDate } from "@/lib/formatters";
import { Pagination } from "@/components/Pagination";

const PER_PAGE = 20;

export default async function PatientPrescriptionsPage({
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
        id: prescriptions.id,
        dosage: prescriptions.dosage,
        frequency: prescriptions.frequency,
        duration: prescriptions.duration,
        status: prescriptions.status,
        dateEntered: prescriptions.dateEntered,
        brandName: prescriptionbrands.name,
        genericName: prescriptionlists.name,
      })
      .from(prescriptions)
      .innerJoin(casesheets, eq(prescriptions.parentId, casesheets.id))
      .leftJoin(prescriptionbrands, eq(prescriptions.brandId, prescriptionbrands.id))
      .leftJoin(prescriptionlists, eq(prescriptionbrands.prescriptionlistId, prescriptionlists.id))
      .where(
        and(
          eq(casesheets.patientId, params.id),
          eq(prescriptions.parentType, "Casesheets"),
          eq(prescriptions.deleted, 0)
        )
      )
      .orderBy(desc(prescriptions.dateEntered))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(prescriptions)
      .innerJoin(casesheets, eq(prescriptions.parentId, casesheets.id))
      .where(
        and(
          eq(casesheets.patientId, params.id),
          eq(prescriptions.parentType, "Casesheets"),
          eq(prescriptions.deleted, 0)
        )
      ),
  ]);

  const totalPages = Math.ceil(Number(total) / PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">
          Prescriptions <span className="font-normal text-gray-400">({total})</span>
        </h2>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="No prescriptions found for this patient." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Drug (Brand)</Th><Th>Generic</Th><Th>Dosage</Th><Th>Frequency</Th><Th>Duration</Th><Th>Date</Th><Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td>{r.brandName ?? "—"}</Td>
                    <Td>{r.genericName ?? "—"}</Td>
                    <Td>{r.dosage ?? "—"}</Td>
                    <Td>{r.frequency ?? "—"}</Td>
                    <Td>{r.duration ?? "—"}</Td>
                    <Td>{fmtDate(r.dateEntered)}</Td>
                    <Td><StatusBadge status={r.status} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} total={Number(total)} basePath={`/patients/${params.id}/prescriptions`} />
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
  const color = s === "Active" ? "bg-green-100 text-green-700" : s === "Completed" ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{s}</span>;
}
