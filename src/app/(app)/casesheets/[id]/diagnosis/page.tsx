import { and, eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import {
  casesheets,
  provisionaldiagnoss,
  diagnosiss,
  diagnosislists,
  diagnosisgroups,
  patients,
} from "@/db/schema";
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

// Alias tables for two separate joins on the same diagnosisgroups/diagnosislists
import { alias } from "drizzle-orm/mysql-core";

const provDiagList = alias(diagnosislists, "prov_dlist");
const provDiagGroup = alias(diagnosisgroups, "prov_dgroup");
const finalDiagList = alias(diagnosislists, "final_dlist");
const finalDiagGroup = alias(diagnosisgroups, "final_dgroup");

export default async function DiagnosisPage({ params }: { params: { id: string } }) {
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

  const [provisionalRows, finalRows] = await Promise.all([
    db
      .select({
        id: provisionaldiagnoss.id,
        toothNo: provisionaldiagnoss.toothNo,
        dateEntered: provisionaldiagnoss.dateEntered,
        diagnosisGroup: provDiagGroup.name,
        diagnosisName: provDiagList.name,
      })
      .from(provisionaldiagnoss)
      .leftJoin(provDiagList, eq(provisionaldiagnoss.diagnosislistId, provDiagList.id))
      .leftJoin(provDiagGroup, eq(provisionaldiagnoss.diagnosisgroupId, provDiagGroup.id))
      .where(and(eq(provisionaldiagnoss.parentId, params.id), eq(provisionaldiagnoss.deleted, 0)))
      .orderBy(desc(provisionaldiagnoss.dateEntered)),

    db
      .select({
        id: diagnosiss.id,
        toothNo: diagnosiss.toothNo,
        dateEntered: diagnosiss.dateEntered,
        diagnosisGroup: finalDiagGroup.name,
        diagnosisName: finalDiagList.name,
      })
      .from(diagnosiss)
      .leftJoin(finalDiagList, eq(diagnosiss.diagnosislistId, finalDiagList.id))
      .leftJoin(finalDiagGroup, eq(diagnosiss.diagnosisgroupId, finalDiagGroup.id))
      .where(and(eq(diagnosiss.parentId, params.id), eq(diagnosiss.deleted, 0)))
      .orderBy(desc(diagnosiss.dateEntered)),
  ]);

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
        activeTab="diagnosis"
      >
        <div className="space-y-6">
          {/* Provisional Diagnosis */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Provisional Diagnosis{" "}
              <span className="font-normal text-gray-400">({provisionalRows.length})</span>
            </h3>
            {provisionalRows.length === 0 ? (
              <EmptyState message="No provisional diagnoses recorded." />
            ) : (
              <DiagnosisTable rows={provisionalRows} />
            )}
          </div>

          {/* Final Diagnosis */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Final Diagnosis{" "}
              <span className="font-normal text-gray-400">({finalRows.length})</span>
            </h3>
            {finalRows.length === 0 ? (
              <EmptyState message="No final diagnoses recorded." />
            ) : (
              <DiagnosisTable rows={finalRows} />
            )}
          </div>
        </div>
      </RecordPage>
    </div>
  );
}

type DiagRow = {
  id: string;
  toothNo: string | null;
  dateEntered: Date | null;
  diagnosisGroup: string | null;
  diagnosisName: string | null;
};

function DiagnosisTable({ rows }: { rows: DiagRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <Th>Group</Th>
            <Th>Diagnosis</Th>
            <Th>Tooth</Th>
            <Th>Date</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <Td>{r.diagnosisGroup ?? "—"}</Td>
              <Td>{r.diagnosisName ?? "—"}</Td>
              <Td>{r.toothNo ?? "—"}</Td>
              <Td>{fmtDate(r.dateEntered)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
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

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 whitespace-nowrap text-gray-700">{children}</td>;
}
