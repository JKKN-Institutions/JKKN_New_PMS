import { PatientBanner } from "@/components/PatientBanner";
import { RecordPage } from "@/components/RecordPage";

const TABS = [
  { key: "overview", label: "Overview", href: "" },
  { key: "casesheets", label: "Case Sheets", href: "/casesheets" },
  { key: "appointments", label: "Appointments", href: "/appointments" },
  { key: "treatments", label: "Treatments", href: "/treatments" },
  { key: "prescriptions", label: "Prescriptions", href: "/prescriptions" },
  { key: "lab", label: "Lab", href: "/lab" },
  { key: "billing", label: "Billing", href: "/billing" },
  { key: "media", label: "Media", href: "/media" },
  { key: "history", label: "History", href: "/history" },
];

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const mockPatient = {
    id: params.id,
    patNumber: "PAT-00001",
    firstName: "Sample",
    lastName: "Patient",
    sex: "Male",
    birthdate: "1990-01-01",
    bloodGrp: "O+",
    phoneMobile: "9999999999",
    outstandingAmt: 0,
  };

  const tabs = TABS.map((t) => ({
    ...t,
    href: `/patients/${params.id}${t.href}`,
  }));

  return (
    <div>
      <div className="mb-4">
        <a href="/patients" className="text-sm text-gray-500 hover:text-gray-700">← Patients</a>
      </div>

      <PatientBanner patient={mockPatient} className="mb-5" />

      <RecordPage
        humanNumber="PAT-00001"
        title="Patient 360"
        status="Active"
        statusColor="green"
        tabs={tabs}
        activeTab="overview"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard title="Personal Details">
            <Row label="Full Name" value="Sample Patient" />
            <Row label="Sex" value="Male" />
            <Row label="Age" value="35y" />
            <Row label="Blood Group" value="O+" />
          </InfoCard>
          <InfoCard title="Contact">
            <Row label="Mobile" value="9999999999" />
          </InfoCard>
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
