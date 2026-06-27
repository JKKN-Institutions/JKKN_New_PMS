import { and, eq, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { billings } from "@/db/schema";
import { fmtCurrency, fmtDate } from "@/lib/formatters";
import { Pagination } from "@/components/Pagination";

const PER_PAGE = 20;

export default async function PatientBillingPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const db = getDb();
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const offset = (page - 1) * PER_PAGE;

  const [rows, [{ total }], [totals]] = await Promise.all([
    db
      .select({
        id: billings.id,
        payNumber: billings.payNumber,
        totalAmount: billings.totalAmount,
        discount: billings.discount,
        finalAmount: billings.finalAmount,
        paymentStatus: billings.paymentStatus,
        dateEntered: billings.dateEntered,
      })
      .from(billings)
      .where(and(eq(billings.patientId, params.id), eq(billings.deleted, 0)))
      .orderBy(desc(billings.dateEntered))
      .limit(PER_PAGE)
      .offset(offset),
    db
      .select({ total: sql<number>`COUNT(*)` })
      .from(billings)
      .where(and(eq(billings.patientId, params.id), eq(billings.deleted, 0))),
    db
      .select({
        totalBilled: sql<number>`COALESCE(SUM(final_amount), 0)`,
        totalDiscount: sql<number>`COALESCE(SUM(discount), 0)`,
      })
      .from(billings)
      .where(and(eq(billings.patientId, params.id), eq(billings.deleted, 0))),
  ]);

  const totalPages = Math.ceil(Number(total) / PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Bills" value={String(total)} />
        <SummaryCard label="Total Billed" value={fmtCurrency(totals?.totalBilled)} />
        <SummaryCard label="Total Discount" value={fmtCurrency(totals?.totalDiscount)} />
        <SummaryCard label="Net Amount" value={fmtCurrency(Number(totals?.totalBilled ?? 0) - Number(totals?.totalDiscount ?? 0))} highlight />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Bills <span className="font-normal text-gray-400">({total})</span>
        </h2>
      </div>

      {rows.length === 0 ? (
        <EmptyState message="No billing records found for this patient." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Bill #</Th><Th>Total</Th><Th>Discount</Th><Th>Final</Th><Th>Date</Th><Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td mono>{r.payNumber?.toString() ?? "—"}</Td>
                    <Td>{fmtCurrency(r.totalAmount)}</Td>
                    <Td>{fmtCurrency(r.discount)}</Td>
                    <Td><span className="font-semibold">{fmtCurrency(r.finalAmount)}</span></Td>
                    <Td>{fmtDate(r.dateEntered)}</Td>
                    <Td><StatusBadge status={r.paymentStatus} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} total={Number(total)} basePath={`/patients/${params.id}/billing`} />
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-white"}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${highlight ? "text-blue-700" : "text-gray-900"}`}>{value}</p>
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
  const color = s === "Paid" ? "bg-green-100 text-green-700" : s === "Unpaid" ? "bg-red-100 text-red-700" : s === "Partial" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{s}</span>;
}
