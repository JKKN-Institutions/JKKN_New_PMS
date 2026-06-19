export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      {/* Role-aware panels – static shell; data comes from server actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Patients", value: "—", sub: "appointments today", color: "blue" },
          { label: "Pending Approvals", value: "—", sub: "workstep approvals", color: "yellow" },
          { label: "Pending Bills", value: "—", sub: "unpaid billings", color: "red" },
          { label: "Lab Pending", value: "—", sub: "lab requests", color: "purple" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's appointments */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Today&apos;s Appointments</h2>
            <a href="/appointments" className="text-xs text-blue-600 hover:underline">View all</a>
          </div>
          <p className="text-sm text-gray-400 py-8 text-center">No appointments loaded — connect DB to populate.</p>
        </div>

        {/* Faculty approval queue */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Pending Approvals</h2>
            <a href="/approvals" className="text-xs text-blue-600 hover:underline">View all</a>
          </div>
          <p className="text-sm text-gray-400 py-8 text-center">No pending approvals — connect DB to populate.</p>
        </div>
      </div>
    </div>
  );
}
