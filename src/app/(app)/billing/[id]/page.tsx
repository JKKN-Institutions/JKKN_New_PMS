import { RecordPage } from "@/components/RecordPage";
import { Button } from "@/components/ui/Button";

export default function BillingDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <a href="/billing" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">← Billing</a>

      <RecordPage
        humanNumber={`BILL-${params.id.slice(0, 8)}`}
        title="Bill Detail"
        status="Pending"
        statusColor="yellow"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Print Invoice</Button>
            <Button size="sm">Collect Payment</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["#", "Description", "Module", "Units", "Unit Value", "Tax", "Amount"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">No bill lines. Connect DB to load.</td>
                </tr>
              </tbody>
              <tfoot className="border-t border-gray-200 bg-gray-50">
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Total</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">₹0.00</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </RecordPage>
    </div>
  );
}
