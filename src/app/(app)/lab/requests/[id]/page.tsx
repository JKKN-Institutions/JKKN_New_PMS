import { StatusMachine } from "@/components/StatusMachine";
import { RecordPage } from "@/components/RecordPage";
import { Button } from "@/components/ui/Button";

export default function LabRequestDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <a href="/lab/requests" className="text-sm text-gray-500 hover:text-gray-700 mb-4 block">← Lab Requests</a>

      <RecordPage
        humanNumber={`LAB-${params.id.slice(0, 8)}`}
        title="Lab Request"
        status="Pending"
        statusColor="yellow"
        actions={
          <StatusMachine
            currentStatus="Pending"
            transitions={[
              { label: "Confirm", toStatus: "Confirm", variant: "primary" },
              { label: "Cancel", toStatus: "Cancel", variant: "danger" },
            ]}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard title="Request Details">
            <Row label="Test" value="—" />
            <Row label="Category" value="—" />
            <Row label="Sample" value="—" />
            <Row label="Units" value="—" />
            <Row label="Diagnosis" value="—" />
            <Row label="Request Date" value="—" />
            <Row label="Expected Done" value="—" />
          </InfoCard>
          <InfoCard title="Assignment">
            <Row label="Lab User" value="—" />
            <Row label="Done By" value="—" />
            <Row label="Reported By" value="—" />
          </InfoCard>
        </div>

        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Report</h3>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Upload File</Button>
              <Button size="sm">Save Report</Button>
            </div>
          </div>
          <textarea
            rows={5}
            placeholder="Enter lab report findings…"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
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
