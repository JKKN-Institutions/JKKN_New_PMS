import { and, eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { casesheets, billings, patients } from "@/db/schema";
import { PatientBanner } from "@/components/PatientBanner";
import { RecordPage } from "@/components/RecordPage";
import { fmtDate, fmtCurrency } from "@/lib/formatters";

const TABS = [
  { key: "complaint", label: "Chief Complaint", href: "" },
  { key: "history", label: "History", href: "/history" },
  { key: "examination", label: "Examination", href: "/examination" },
  { key: "chart", label: "Dental Chart", href: "/chart" },
  { key: "diagnosis", label: "Diagnosis", href: "/diagnosis" },
  { key: "plan", label: "Plan", href: "/plan" },
  { key: "treatments", label: "Treatments", href: "/treatments" },
  { key: "prescriptions", label: "Rx", href: "/prescriptions" },
  { key: "lab", label: "Lab", href: "/lab" },
  { key: "billing", label: "Billing", href: "/billing" },
];

const statusBadge: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Partial: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default async function BillingPage({ params }: { params: { id: string } }) {
  const db = getDb();

  const [sheet] = await db
    .select()
    .from(casesheets)
    .where(and(eq(casesheets.id, params.id), eq(casesheets.deleted, 0)))
    .limit(1);

  if (!sheet) notFound();

  const [patient] = await db
    .select({
      id: patients.id,
      patNumber: patients.patNumber,
      firstName: patients.firstName,
      lastName: patients.lastName,
      sex: patients.sex,
      birthdate: patients.birthdate,
      bloodGrp: patients.bloodGrp,
      phoneMobile: patients.phoneMobile,
      outstandingAmt: patients.outstandingAmt,
    })
    .from(patients)
    .where(eq(patients.id, sheet.patientId!))
    .limit(1);

  const rows = await db
    .select()
    .from(billings)
    .where(and(eq(billings.billParentId, params.id), eq(billings.deleted, 0)))
    .orderBy(desc(billings.dateEntered));

  // Summary aggregates
  const totalBills = rows.length;
  const totalBilled = rows.reduce((sum, r) => sum + (r.totalAmount ?? 0), 0);
  const totalDiscount = rows.reduce((sum, r) => sum + (r.discount ?? 0), 0);
  const netAmount = rows.reduce((sum, r) => sum + (r.finalAmount ?? 0), 0);

  const tabs = TABS.map((t) => ({ ...t, href: `/casesheets/${params.id}${t.href}` }));
  const statusColor =
    sheet.status === "Open" ? "green" : sheet.status === "Closed" ? "gray" : "yellow";

  return (
    <div>
      {patient && <PatientBanner patient={patient} className="mb-5" />}
      <RecordPage
        humanNumber={`CS-${sheet.caseNumber ?? params.id.slice(0, 8)}`}
        title="Case Sheet"
        status={sheet.status ?? "Open"}
        statusColor={statusColor as "green" | "gray" | "yellow"}
        tabs={tabs}
        activeTab="billing"
      >
        <div className="space-y-5">
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <SummaryCard label="Total Bills" value={String(totalBills)} />
            <SummaryCard label="Total Billed" value={fmtCurrency(totalBilled)} />
            <SummaryCard label="Total Discount" value={fmtCurrency(totalDiscount)} />
            <SummaryCard label="Net Amount" value={fmtCurrency(netAmount)} highlight />
          </div>

          {/* Bills table */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Bills{" "}
                <span className="font-normal text-gray-400">({rows.length})</span>
              </h3>
            </div>
            {rows.length === 0 ? (
              <EmptyState message="No bills recorded." />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <Th>Bill No.</Th>
                      <Th>Total</Th>
                      <Th>Discount</Th>
                      <Th>Final</Th>
                      <Th>Status</Th>
                      <Th>Date</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {rows.map((r) => {
                      const badgeCls =
                        statusBadge[r.paymentStatus ?? ""] ?? "bg-gray-100 text-gray-600";
                      return (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <Td mono>{r.payNumber ? `BILL-${r.payNumber}` : "—"}</Td>
                          <Td>{fmtCurrency(r.totalAmount)}</Td>
                          <Td>{fmtCurrency(r.discount)}</Td>
                          <Td>
                            <span className="font-medium">{fmtCurrency(r.finalAmount)}</span>
                          </Td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {r.paymentStatus ? (
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeCls}`}
                              >
                                {r.paymentStatus}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <Td>{fmtDate(r.dateEntered)}</Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </RecordPage>
    </div>
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
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-blue-200 bg-blue-50"
          : "border-gray-200 bg-white"
      } shadow-sm`}
    >
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p
        className={`text-base font-semibold ${
          highlight ? "text-blue-700" : "text-gray-800"
        }`}
      >
        {value}
      </p>
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

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td className={`px-4 py-3 whitespace-nowrap text-gray-700 ${mono ? "font-mono" : ""}`}>
      {children}
    </td>
  );
}