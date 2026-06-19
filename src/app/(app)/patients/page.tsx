import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PatientsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Patients</h1>
        <Link href="/patients/new">
          <Button size="sm">+ New Patient</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-end shadow-sm">
        <div className="w-full sm:w-auto">
          <label className="block text-xs text-gray-500 mb-1">Search</label>
          <input
            type="search"
            placeholder="Name / number / phone"
            className="w-full sm:w-56 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-xs text-gray-500 mb-1">Registration date</label>
          <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="w-full sm:w-auto">
          <label className="block text-xs text-gray-500 mb-1">Department</label>
          <select className="w-full sm:w-40 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All departments</option>
          </select>
        </div>
        <Button variant="secondary" size="sm">Filter</Button>
      </div>

      {/* Table — horizontally scrollable on small screens */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Pat #", "Name", "Sex/Age", "Mobile", "Category", "Reg Date", "Outstanding", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                  Connect the database to load patient records.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
