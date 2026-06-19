import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function LabRequestsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Lab Requests</h1>
        <div className="flex gap-2 flex-wrap justify-end">
          <Link href="/lab/worklist">
            <Button variant="secondary" size="sm">Worklist</Button>
          </Link>
          <Button size="sm">+ New</Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", "Pending", "Confirm", "Sample", "Done", "Cancel"].map((s) => (
          <button
            key={s}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Patient", "Test", "Category", "Samples", "Requested", "Exp Done", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                  No lab requests. Connect DB to load.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
