import { and, eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { casesheets, treatmentadvices, patients } from "@/db/schema";
import { PatientBanner } from "@/components/PatientBanner";
import { RecordPage } from "@/components/RecordPage";
import { fmtDate, fmtCurrency } from "@/lib/formatters";

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

export default async function PlanPage({ params }: { params: { id: string } }) {
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
    .from(treatmentadvices)
    .where(and(eq(treatmentadvices.parentId, params.id), eq(treatmentadvices.deleted, 0)))
    .orderBy(desc(treatmentadvices.dateEntered));

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
        activeTab="plan"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Treatment Advice / Plan{" "}
              <span className="font-normal text-gray-400">({rows.length})</span>
            </h3>
          </div>

          {rows.length === 0 ? (
            <EmptyState message="No treatment advice recorded." />
          ) : (
            <div className="grid gap-4">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      {r.description && (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{r.description}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-gray-400 mb-0.5">Estimated Amount</p>
                      <p className="text-base font-semibold text-gray-800">
                        {fmtCurrency(r.exAmount)}
                      </p>
                    </div>
                  </div>

                  {(r.treatmentlists || r.labsetups) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      {r.treatmentlists && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                            Treatment Lists
                          </p>
                          <p className="text-sm text-gray-700 break-words">{r.treatmentlists}</p>
                        </div>
                      )}
                      {r.labsetups && (
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                            Lab Setups
                          </p>
                          <p className="text-sm text-gray-700 break-words">{r.labsetups}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-4">{fmtDate(r.dateEntered)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </RecordPage>
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
