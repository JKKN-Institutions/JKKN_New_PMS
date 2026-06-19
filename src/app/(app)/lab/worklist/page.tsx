export default function LabWorklistPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Lab Worklist</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {["Pending", "In Progress", "Completed Today"].map((s) => (
          <div key={s} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-bold text-gray-900">—</p>
            <p className="text-xs text-gray-500 mt-1">{s}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Patient", "Test", "Category", "Sample Date", "Assigned To", "Status", "Report", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                No items in lab worklist. Connect DB to load.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
