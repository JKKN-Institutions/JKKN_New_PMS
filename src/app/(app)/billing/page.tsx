import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function BillingPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
        <div className="flex gap-2">
          <Link href="/billing/cashier">
            <Button variant="secondary" size="sm">Cashier</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap gap-3 shadow-sm">
        <input type="search" placeholder="Patient / bill number…" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40">
          <option>All statuses</option>
          <option>Pending</option>
          <option>Received</option>
          <option>Cancelled</option>
        </select>
        <input type="date" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Bill #", "Patient", "Date", "Total", "Paid", "Balance", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                No billing records. Connect DB to load.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
