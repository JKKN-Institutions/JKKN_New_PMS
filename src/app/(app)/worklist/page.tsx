import { Badge } from "@/components/ui/Badge";

export default function WorklistPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Worklist</h1>
        <Badge variant="yellow">Pending</Badge>
      </div>

      <p className="text-sm text-gray-500 mb-6">Pending worksteps assigned to you, grouped by patient and appointment.</p>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Patient", "Case Sheet", "Treatment", "Workstep", "Appointment", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                  No pending worksteps. Connect DB to load.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
