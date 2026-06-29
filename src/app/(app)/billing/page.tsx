import Link from "next/link";
import { and, eq, desc, sql, like, or } from "drizzle-orm";
import { getDb } from "@/db";
import { billings, patients } from "@/db/schema";
import { fmtDate, fmtCurrency } from "@/lib/formatters";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/Button";

const PER_PAGE = 20;

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

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({
  children,
  mono,
}: {
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <td
      className={`px-4 py-3 whitespace-nowrap text-gray-700 ${
        mono ? "font-mono" : ""
      }`}
    >
      {children}
    </td>
  );
}

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string; status?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const offset = (page - 1) * PER_PAGE;
  const q = searchParams.q?.trim() ?? "";
  const statusFilter = searchParams.status ?? "";

  let rows: Array<{
    id: string;
    payNumber: number | null;
    totalAmount: number | null;
    discount: number | null;
    finalAmount: number | null;
    paymentStatus: string | null;
    dateEntered: Date | null;
    patFirst: string | null;
    patLast: string | null;
  }> = [];
  let total = 0;

  try {
    const db = getDb();

    const conditions = [eq(billings.deleted, 0)];
    if (statusFilter) conditions.push(eq(billings.paymentStatus, statusFilter));
    if (q) {
      conditions.push(
        or(
          like(patients.firstName, `%${q}%`),
          like(patients.lastName, `%${q}%`),
          sql`CAST(${billings.payNumber} AS CHAR) LIKE ${`%${q}%`}`
        )!
      );
    }

    const where = and(...conditions);

    const [rowsResult, countResult] = await Promise.all([
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
        .where(where)
        .orderBy(desc(billings.dateEntered))
        .limit(PER_PAGE)
        .offset(offset),
      db
        .select({ total: sql<number>`COUNT(*)` })
        .from(billings)
        .leftJoin(patients, eq(billings.patientId, patients.id))
        .where(where),
    ]);

    rows = rowsResult;
    total = countResult[0]?.total ?? 0;
  } catch {
    // DB not configured
  }

  const totalPages = Math.ceil(total / PER_PAGE);

  const STATUSES = ["Paid", "Unpaid", "Partial", "Pending"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Billing
        </h1>
        <Link href="/billing/cashier">
          <Button variant="secondary" size="sm">
            Cashier
          </Button>
        </Link>
      </div>

      {/* Filter bar */}
      <form method="GET" action="/billing">
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap gap-3 shadow-sm">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Patient name or bill #…"
            className="flex-1 min-w-[160px] border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            defaultValue={statusFilter}
            className="w-full sm:w-40 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
          {(q || statusFilter) && (
            <Link
              href="/billing"
              className="px-4 py-1.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th>Bill #</Th>
                <Th>Patient</Th>
                <Th>Total</Th>
                <Th>Discount</Th>
                <Th>Final</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-gray-400 text-sm"
                  >
                    No billing records found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td mono>
                      <Link
                        href={`/billing/${r.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {r.payNumber ?? "—"}
                      </Link>
                    </Td>
                    <Td>
                      {[r.patFirst, r.patLast].filter(Boolean).join(" ") ||
                        "—"}
                    </Td>
                    <Td>{fmtCurrency(r.totalAmount)}</Td>
                    <Td>{fmtCurrency(r.discount)}</Td>
                    <Td>
                      <span className="font-semibold">
                        {fmtCurrency(r.finalAmount)}
                      </span>
                    </Td>
                    <Td>
                      <StatusBadge status={r.paymentStatus} />
                    </Td>
                    <Td>{fmtDate(r.dateEntered)}</Td>
                    <Td>
                      <Link
                        href={`/billing/${r.id}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              basePath="/billing"
            />
          </div>
        )}
      </div>
    </div>
  );
}
