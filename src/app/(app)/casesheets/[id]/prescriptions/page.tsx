import { Button } from "@/components/ui/Button";

export default function CaseSheetPrescriptionsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <a href={`/casesheets/${params.id}`} className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">
        ← Case Sheet
      </a>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Prescriptions</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Print Rx</Button>
          <Button size="sm">+ Add Drug</Button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Drug (Brand)", "Generic", "Dosage", "Frequency", "Duration", "Route", "Class", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                No prescriptions. Add a drug to compose the prescription.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
