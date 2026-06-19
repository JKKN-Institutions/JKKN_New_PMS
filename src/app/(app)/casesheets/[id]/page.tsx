import { PatientBanner, type PatientBannerData } from "@/components/PatientBanner";
import { RecordPage } from "@/components/RecordPage";

const TABS = [
  { key: "complaint", label: "Chief Complaint", href: "" },
  { key: "history", label: "History", href: "/history" },
  { key: "examination", label: "Examination", href: "/examination" },
  { key: "chart", label: "Dental Chart", href: "/chart" },
  { key: "diagnosis", label: "Diagnosis", href: "/diagnosis" },
  { key: "plan", label: "Plan", href: "/plan" },
  { key: "treatments", label: "Treatments", href: "/treatments" },
  { key: "prescriptions", label: "Rx", href: "/prescriptions" },
  { key: "lab", label: "Lab", href: "/lab" },
  { key: "billing", label: "Billing", href: "/billing" },
];

const mockPatient: PatientBannerData = {
  id: "mock",
  patNumber: "PAT-00001",
  firstName: "Sample",
  lastName: "Patient",
  sex: "Male",
  birthdate: "1990-01-01",
  bloodGrp: "O+",
  phoneMobile: "9999999999",
  outstandingAmt: 0,
};

export default function CaseSheetPage({ params }: { params: { id: string } }) {
  const tabs = TABS.map((t) => ({
    ...t,
    href: `/casesheets/${params.id}${t.href}`,
  }));

  return (
    <div>
      <PatientBanner patient={mockPatient} className="mb-5" />

      <RecordPage
        humanNumber={`CS-${params.id.slice(0, 8)}`}
        title="Case Sheet"
        status="Open"
        statusColor="green"
        tabs={tabs}
        activeTab="complaint"
        actions={
          <button className="text-xs border border-gray-300 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
            Close Case Sheet
          </button>
        }
      >
        {/* Chief Complaint tab content */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Chief Complaints</h3>
            <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg">+ Add Complaint</button>
          </div>
          <p className="text-sm text-gray-400 text-center py-8">No complaints recorded. Connect DB to load.</p>
        </div>
      </RecordPage>
    </div>
  );
}
