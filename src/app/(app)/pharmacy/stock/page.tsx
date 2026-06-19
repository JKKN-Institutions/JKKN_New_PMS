import { Button } from "@/components/ui/Button";

export default function PharmacyStockPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Pharmacy Stock</h1>
        <Button variant="secondary" size="sm">Export Ledger</Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex gap-3 shadow-sm">
        <input type="search" placeholder="Search item / shelf…" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1" />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Item", "Shelf / Rack", "Batch", "Balance Qty", "Reorder Level", "Last Updated"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                No stock data. Connect DB to load bin-card ledger.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
