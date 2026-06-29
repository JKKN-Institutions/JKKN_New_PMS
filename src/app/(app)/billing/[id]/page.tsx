import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { billings, billdetails, payments, patients } from "@/db/schema";
import { fmtDate, fmtCurrency } from "@/lib/formatters";

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "—";
  const color =
    s === "Paid" || s === "Received"
      ? "bg-green-100 text-green-700"
      : s === "Partial"
      ? "bg-yellow-100 text-yellow-700"
      : s === "Unpaid" || s === "Pending"
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

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p
        className={`text-xl font-bold ${
          highlight ? "text-blue-600" : "text-gray-900"
        }`}
      >
        {value}
      </p>
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
  return (
    <td className="px-4 py-3 whitespace-nowrap text-gray-700">{children}</td>
  );
}

export default async function BillingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let bill: {
    id: string;
    payNumber: number | null;
    totalAmount: number | null;
    discount: number | null;
    finalAmount: number | null;
    paymentStatus: string | null;
    dateEntered: Date | null;
    patFirst: string | null;
    patLast: string | null;
  } | null = null;

  let details: Array<{
    id: string;
    relatedModule: string | null;
    units: string | null;
    unitValue: string | null;
    amount: string | null;
    tax: string | null;
    taxAmount: string | null;
  }> = [];

  let paymentRows: Array<{
    id: string;
    paymentMode: string | null;
    amount: string | null;
    dateEntered: Date | null;
  }> = [];

  let totalReceived = 0;

  try {
    const db = getDb();

    const [billResult, detailsResult, paymentsResult] = await Promise.all([
      db
        .select({
          id: billings.id,
          payNumber: billings.payNumber,
          totalAmount: billings.totalAmount,
          discount: billings.discount,
          finalAmount: billings.finalAmount,
          paymentStatus: billings.paymentStatus,
          dateEntered: billings.dateEntered,
          patFirst: patients.firstName,
          patLast: patients.lastName,
        })
        .from(billings)
        .leftJoin(patients, eq(billings.patientId, patients.id))
        .where(and(eq(billings.id, params.id), eq(billings.deleted, 0)))
        .limit(1),
      db
        .select({
          id: billdetails.id,
          relatedModule: billdetails.relatedModule,
          units: billdetails.units,
          unitValue: billdetails.unitValue,
          amount: billdetails.amount,
          tax: billdetails.tax,
          taxAmount: billdetails.taxAmount,
        })
        .from(billdetails)
        .where(
          and(eq(billdetails.billingId, params.id), eq(billdetails.deleted, 0))
        ),
      db
        .select({
          id: payments.id,
          paymentMode: payments.paymentMode,
          amount: payments.amount,
          dateEntered: payments.dateEntered,
        })
        .from(payments)
        .where(
          and(
            eq(payments.billParentId, params.id),
            eq(payments.deleted, 0)
          )
        ),
    ]);

    bill = billResult[0] ?? null;
    details = detailsResult;
    paymentRows = paymentsResult;
    totalReceived = paymentRows.reduce(
      (sum, p) => sum + Number(p.amount ?? 0),
      0
    );
  } catch {
    // DB not configured
  }

  if (!bill) {
    // Show a graceful not-found rather than crashing
    return (
      <div>
        <Link
          href="/billing"
          className="text-sm text-gray-500 hover:text-gray-700 mb-4 block"
        >
          &larr; Billing
        </Link>
        <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
          Bill not found or database not connected.
        </div>
      </div>
    );
  }

  const patientName =
    [bill.patFirst, bill.patLast].filter(Boolean).join(" ") || "Unknown Patient";

  return (
    <div>
      <Link
        href="/billing"
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 block"
      >
        &larr; Billing
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Bill #{bill.payNumber ?? bill.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{patientName}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={bill.paymentStatus} />
          <span className="text-xs text-gray-400">{fmtDate(bill.dateEntered)}</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <SummaryCard label="Total Amount" value={fmtCurrency(bill.totalAmount)} />
        <SummaryCard label="Discount" value={fmtCurrency(bill.discount)} />
        <SummaryCard
          label="Final Amount"
          value={fmtCurrency(bill.finalAmount)}
          highlight
        />
        <SummaryCard label="Received" value={fmtCurrency(totalReceived)} />
      </div>

      {/* Bill Details */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Bill Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th>Module</Th>
                <Th>Units</Th>
                <Th>Unit Value</Th>
                <Th>Amount</Th>
                <Th>Tax %</Th>
                <Th>Tax Amount</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {details.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-gray-400 text-sm"
                  >
                    No bill line items found.
                  </td>
                </tr>
              ) : (
                details.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <Td>{d.relatedModule ?? "—"}</Td>
                    <Td>{d.units ?? "—"}</Td>
                    <Td>{fmtCurrency(d.unitValue)}</Td>
                    <Td>
                      <span className="font-medium">{fmtCurrency(d.amount)}</span>
                    </Td>
                    <Td>{d.tax ? `${d.tax}%` : "—"}</Td>
                    <Td>{fmtCurrency(d.taxAmount)}</Td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="border-t border-gray-200 bg-gray-50">
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-3 text-right text-sm font-semibold text-gray-700"
                >
                  Final Total
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  {fmtCurrency(bill.finalAmount)}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Payments */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th>Mode</Th>
                <Th>Amount</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paymentRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-10 text-center text-gray-400 text-sm"
                  >
                    No payments recorded.
                  </td>
                </tr>
              ) : (
                paymentRows.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <Td>{p.paymentMode ?? "—"}</Td>
                    <Td>
                      <span className="font-medium text-green-700">
                        {fmtCurrency(p.amount)}
                      </span>
                    </Td>
                    <Td>{fmtDate(p.dateEntered)}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
