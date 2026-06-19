import { StatusMachine } from "@/components/StatusMachine";
import { RecordPage } from "@/components/RecordPage";

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <a href="/appointments" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">← Appointments</a>

      <RecordPage
        humanNumber={`APT-${params.id.slice(0, 8)}`}
        title="Appointment Detail"
        status="Scheduled"
        statusColor="blue"
        actions={
          <StatusMachine
            currentStatus="Scheduled"
            transitions={[
              { label: "Mark Waiting", toStatus: "Waiting", variant: "primary" },
              { label: "Reschedule", toStatus: "Rescheduled", variant: "ghost" },
              { label: "Cancel", toStatus: "Cancelled", variant: "danger" },
            ]}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard title="Appointment Info">
            <Row label="Patient" value="—" />
            <Row label="Department" value="—" />
            <Row label="Date & Time" value="—" />
            <Row label="Doctor" value="—" />
            <Row label="Token #" value="—" />
            <Row label="Visit Type" value="—" />
          </InfoCard>
          <InfoCard title="Operating Team">
            <Row label="UG Student" value="—" />
            <Row label="PG Student" value="—" />
            <Row label="Operated By" value="—" />
            <Row label="Assisted By" value="—" />
            <Row label="OPD Manager" value="—" />
          </InfoCard>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Linked Case Sheet</h3>
          <p className="text-sm text-gray-400">No case sheet linked. Connect DB to resolve.</p>
        </div>
      </RecordPage>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <dl className="space-y-2">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}
