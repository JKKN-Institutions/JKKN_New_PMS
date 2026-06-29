import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { items } from "@/db/schema";
import { Button } from "@/components/ui/Button";

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "—";
  const color =
    s === "Active"
      ? "bg-green-100 text-green-700"
      : s === "Inactive"
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

function SaleableBadge({ isSaleable }: { isSaleable: number | null }) {
  if (isSaleable) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        Yes
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
      No
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
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
        mono ? "font-mono text-xs" : ""
      }`}
    >
      {children}
    </td>
  );
}

export default async function PharmacyStockPage() {
  let rows: Array<{
    id: string;
    name: string | null;
    itemCode: string | null;
    measuringUnit: string | null;
    warnQty: string | null;
    isSaleable: number | null;
    status: string | null;
  }> = [];

  try {
    const db = getDb();

    rows = await db
      .select({
        id: items.id,
        name: items.name,
        itemCode: items.itemCode,
        measuringUnit: items.measuringUnit,
        warnQty: items.warnQty,
        isSaleable: items.isSaleable,
        status: items.status,
      })
      .from(items)
      .where(eq(items.deleted, 0))
      .orderBy(items.name);
  } catch {
    // DB not configured
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Pharmacy Stock
        </h1>
        <Button variant="secondary" size="sm">
          Export Ledger
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex gap-3 shadow-sm">
        <input
          type="search"
          placeholder="Search item or code…"
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th>Code</Th>
                <Th>Name</Th>
                <Th>Unit</Th>
                <Th>Min Qty</Th>
                <Th>Saleable</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-400 text-sm"
                  >
                    No stock items found.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <Td mono>{r.itemCode ?? "—"}</Td>
                    <Td>
                      <span className="font-medium text-gray-900">
                        {r.name ?? "—"}
                      </span>
                    </Td>
                    <Td>{r.measuringUnit ?? "—"}</Td>
                    <Td>{r.warnQty ?? "—"}</Td>
                    <Td>
                      <SaleableBadge isSaleable={r.isSaleable} />
                    </Td>
                    <Td>
                      <StatusBadge status={r.status} />
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {rows.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
            {rows.length} items total
          </div>
        )}
      </div>
    </div>
  );
}
