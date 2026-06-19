import { Button } from "@/components/ui/Button";

export default function PharmacyPOSPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Pharmacy POS</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="flex gap-3 mb-4">
              <input
                type="search"
                placeholder="Search patient (optional)…"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="search"
                placeholder="Search drug / shelf…"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button size="sm">Add</Button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Drug", "Batch/Shelf", "Qty", "Unit Price", "Amount", ""].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-gray-400 text-sm">Cart is empty</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-fit">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Summary</h3>
          <div className="space-y-2 text-sm">
            {[
              ["Subtotal", "₹0.00"],
              ["Discount", "₹0.00"],
              ["Net", "₹0.00"],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium">{val}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>₹0.00</span>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs text-gray-500 mb-1">Received Amount</label>
            <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <Button className="w-full mt-4">Receive & Pay</Button>
        </div>
      </div>
    </div>
  );
}
