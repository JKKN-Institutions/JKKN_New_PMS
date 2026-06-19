import Link from "next/link";
import { Button } from "@/components/ui/Button";

const STATUS_COLORS: Record<string, "blue" | "yellow" | "green" | "gray" | "red"> = {
  Scheduled: "blue",
  Waiting: "yellow",
  "In Progress": "purple" as "blue",
  Done: "green",
  Rescheduled: "gray",
  "Not Reported": "red",
  Cancelled: "red",
};

export default function AppointmentsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
        <div className="flex gap-2">
          <Link href="/appointments/calendar">
            <Button variant="secondary" size="sm">Calendar View</Button>
          </Link>
          <Button size="sm">+ New Appointment</Button>
        </div>
      </div>

      {/* Quick filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap gap-3 shadow-sm">
        <input type="date" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40">
          <option>All departments</option>
        </select>
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40">
          <option>All statuses</option>
          {Object.keys(STATUS_COLORS).map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Token", "Patient", "Department", "Date & Time", "Doctor", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                Connect the database to load appointments.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
