import { Button } from "@/components/ui/Button";

export default function CashierPage() {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Cashier — Collect Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending bills queue */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-gray-700">Pending Bills</h2>
            <input
              type="search"
              placeholder="Search patient…"
              className="w-full sm:w-48 border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[380px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Patient", "Bill #", "Amount", "Age", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">No pending bills</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment form */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-fit">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Collect Payment</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Bill Amount</label>
              <input readOnly className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm" value="₹0.00" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Payment Mode</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Cash</option>
                <option>Card</option>
                <option>UPI / Wallet</option>
                <option>Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Amount Received</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Discount (if any)</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Discount Remark</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <Button className="w-full">Collect & Print Receipt</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
