import { and, eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { casesheets, periodontalexaminations, patients } from "@/db/schema";
import { PatientBanner } from "@/components/PatientBanner";
import { RecordPage } from "@/components/RecordPage";
import { fmtDate } from "@/lib/formatters";

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

const hygieneColors: Record<string, string> = {
  Good: "bg-green-100 text-green-700",
  Fair: "bg-yellow-100 text-yellow-700",
  Poor: "bg-red-100 text-red-700",
};

export default async function ExaminationPage({ params }: { params: { id: string } }) {
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

  const rows = await db
    .select()
    .from(periodontalexaminations)
    .where(and(eq(periodontalexaminations.parentId, params.id), eq(periodontalexaminations.deleted, 0)))
    .orderBy(desc(periodontalexaminations.dateEntered));

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
        activeTab="examination"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Periodontal Examinations{" "}
              <span className="font-normal text-gray-400">({rows.length})</span>
            </h3>
          </div>
          {rows.length === 0 ? (
            <EmptyState message="No periodontal examinations recorded." />
          ) : (
            <div className="grid gap-4">
              {rows.map((r) => {
                const hygieneClass =
                  hygieneColors[r.hygieneStatus ?? ""] ?? "bg-gray-100 text-gray-700";
                return (
                  <div
                    key={r.id}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Periodontal Exam
                        </span>
                        {r.hygieneStatus && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${hygieneClass}`}
                          >
                            {r.hygieneStatus}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{fmtDate(r.dateEntered)}</span>
                    </div>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                      <DetailRow label="Hygiene Status" value={r.hygieneStatus} />
                      <DetailRow label="Bleeding on Probing" value={r.bleedingOnProbing} />
                      <DetailRow label="Tooth Mobility" value={r.toothMobility} />
                      <DetailRow label="Furcation" value={r.furcation} />
                      <DetailRow label="Recession" value={r.recession} />
                    </dl>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </RecordPage>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</dt>
      <dd className="text-gray-700">{value ?? "—"}</dd>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
      {message}
    </div>
  );
}
