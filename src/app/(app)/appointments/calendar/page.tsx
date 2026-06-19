import { Button } from "@/components/ui/Button";

export default function AppointmentCalendarPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Appointment Calendar</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">Day</Button>
          <Button variant="secondary" size="sm">Week</Button>
          <Button size="sm">+ New Appointment</Button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4 flex gap-4 items-center">
        <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
          <option>All Departments</option>
        </select>
        <input type="date" className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm" />
      </div>

      {/* Calendar placeholder — replace with a full calendar library (e.g. FullCalendar) */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex items-center justify-center min-h-96">
        <div className="text-center text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-medium text-gray-600">Calendar Component</p>
          <p className="text-sm mt-1">Integrate FullCalendar or similar to render day/week views with drag-and-drop.</p>
        </div>
      </div>
    </div>
  );
}
