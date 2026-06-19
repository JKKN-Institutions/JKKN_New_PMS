import { Badge } from "@/components/ui/Badge";

const MOCK_COLUMNS = ["Orthodontics", "Oral Surgery", "Periodontics", "Endodontics"];

export default function QueuePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Token Queue Board</h1>
        <Badge variant="green">Live</Badge>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${MOCK_COLUMNS.length}, minmax(0, 1fr))` }}>
        {MOCK_COLUMNS.map((dept) => (
          <div key={dept} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3">
              <h2 className="text-sm font-semibold">{dept}</h2>
            </div>
            <div className="p-3 space-y-2">
              {/* Waiting */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-yellow-700">Waiting</span>
                </div>
                <p className="text-xs text-gray-400 text-center py-4">No patients waiting</p>
              </div>
              {/* In Progress */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-blue-700">In Progress</span>
                </div>
                <p className="text-xs text-gray-400 text-center py-4">No active patients</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
