import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { casesheets, tooths, patients } from "@/db/schema";
import { PatientBanner } from "@/components/PatientBanner";
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

// FDI adult permanent teeth per quadrant
const QUADRANTS = [
  { label: "Upper Right (Q1)", teeth: [18, 17, 16, 15, 14, 13, 12, 11] },
  { label: "Upper Left (Q2)", teeth: [21, 22, 23, 24, 25, 26, 27, 28] },
  { label: "Lower Left (Q3)", teeth: [31, 32, 33, 34, 35, 36, 37, 38] },
  { label: "Lower Right (Q4)", teeth: [41, 42, 43, 44, 45, 46, 47, 48] },
];

const statusColors: Record<string, string> = {
  Healthy: "bg-gray-100 text-gray-600 border-gray-200",
  Caries: "bg-red-100 text-red-700 border-red-200",
  Missing: "bg-gray-50 text-gray-300 border-gray-200 line-through",
  "Root Canal": "bg-purple-100 text-purple-700 border-purple-200",
  Crown: "bg-blue-100 text-blue-700 border-blue-200",
  Extraction: "bg-red-200 text-red-900 border-red-300",
  Filled: "bg-green-100 text-green-700 border-green-200",
};

export default async function ChartPage({ params }: { params: { id: string } }) {
  const db = getDb();

  const [sheet] = await db
    .select()
    .from(casesheets)
    .where(and(eq(casesheets.id, params.id), eq(casesheets.deleted, 0)))
    .limit(1);

  if (!sheet) notFound();

  const [patient] = await db
    .select({
      id: patients.id,
      patNumber: patients.patNumber,
      firstName: patients.firstName,
      lastName: patients.lastName,
      sex: patients.sex,
      birthdate: patients.birthdate,
      bloodGrp: patients.bloodGrp,
      phoneMobile: patients.phoneMobile,
      outstandingAmt: patients.outstandingAmt,
    })
    .from(patients)
    .where(eq(patients.id, sheet.patientId!))
    .limit(1);

  const toothRows = await db
    .select({
      toothNum: tooths.toothNum,
      toothStatus: tooths.toothStatus,
    })
    .from(tooths)
    .where(and(eq(tooths.parentId, params.id), eq(tooths.deleted, 0)));

  // Build a map of toothNum -> status
  const toothMap = new Map<number, string>();
  for (const t of toothRows) {
    if (t.toothNum !== null) toothMap.set(t.toothNum, t.toothStatus ?? "");
  }

  const tabs = TABS.map((t) => ({ ...t, href: `/casesheets/${params.id}${t.href}` }));
  const statusColor =
    sheet.status === "Open" ? "green" : sheet.status === "Closed" ? "gray" : "yellow";

  return (
    <div>
      {patient && <PatientBanner patient={patient} className="mb-5" />}
      <RecordPage
        humanNumber={`CS-${sheet.caseNumber ?? params.id.slice(0, 8)}`}
        title="Case Sheet"
        status={sheet.status ?? "Open"}
        statusColor={statusColor as "green" | "gray" | "yellow"}
        tabs={tabs}
        activeTab="chart"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-6">Dental Chart (FDI)</h3>

          {/* Upper arch */}
          <div className="mb-1">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 text-center">
              Upper Arch
            </p>
            <div className="flex justify-center gap-6 flex-wrap">
              {QUADRANTS.slice(0, 2).map((q) => (
                <div key={q.label}>
                  <p className="text-xs text-gray-400 text-center mb-2">{q.label}</p>
                  <div className="flex gap-1">
                    {q.teeth.map((num) => {
                      const status = toothMap.get(num);
                      const cls =
                        statusColors[status ?? ""] ??
                        "bg-white text-gray-400 border-gray-200";
                      return (
                        <div
                          key={num}
                          title={status ?? "Not recorded"}
                          className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg border text-xs font-medium select-none ${cls}`}
                        >
                          <span className="text-[10px] leading-none">{num}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 my-4" />

          {/* Lower arch */}
          <div>
            <div className="flex justify-center gap-6 flex-wrap">
              {QUADRANTS.slice(2).map((q) => (
                <div key={q.label}>
                  <div className="flex gap-1">
                    {q.teeth.map((num) => {
                      const status = toothMap.get(num);
                      const cls =
                        statusColors[status ?? ""] ??
                        "bg-white text-gray-400 border-gray-200";
                      return (
                        <div
                          key={num}
                          title={status ?? "Not recorded"}
                          className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg border text-xs font-medium select-none ${cls}`}
                        >
                          <span className="text-[10px] leading-none">{num}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">{q.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mt-2 text-center">
              Lower Arch
            </p>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2 font-medium">Legend</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusColors).map(([label, cls]) => (
                <span
                  key={label}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${cls}`}
                >
                  {label}
                </span>
              ))}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-gray-200 bg-white text-gray-400 text-xs font-medium">
                Not recorded
              </span>
            </div>
          </div>
        </div>
      </RecordPage>
    </div>
  );
}
