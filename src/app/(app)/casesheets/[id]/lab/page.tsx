import { and, eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { casesheets, labrequests, labsetups, labsetupgroups, patients } from "@/db/schema";
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

const statusBadge: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  "In Progress": "bg-blue-100 text-blue-700",
};

export default async function LabPage({ params }: { params: { id: string } }) {
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
    .select({
      id: labrequests.id,
      labNumber: labrequests.labNumber,
      diagnosis: labrequests.diagnosis,
      labRequestStatus: labrequests.labRequestStatus,
      requestDate: labrequests.requestDate,
      doneDate: labrequests.doneDate,
      sampleName: labrequests.sampleName,
      testName: labsetups.name,
      groupName: labsetupgroups.name,
    })
    .from(labrequests)
    .leftJoin(labsetups, eq(labrequests.testId, labsetups.id))
    .leftJoin(labsetupgroups, eq(labrequests.labsetupgroupId, labsetupgroups.id))
    .where(and(eq(labrequests.parentId, params.id), eq(labrequests.deleted, 0)))
    .orderBy(desc(labrequests.dateEntered));

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
        activeTab="lab"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">
              Lab Requests{" "}
              <span className="font-normal text-gray-400">({rows.length})</span>
            </h3>
          </div>
          {rows.length === 0 ? (
            <EmptyState message="No lab requests recorded." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>Lab No.</Th>
                    <Th>Test</Th>
                    <Th>Group</Th>
                    <Th>Diagnosis</Th>
                    <Th>Status</Th>
                    <Th>Request Date</Th>
                    <Th>Done Date</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {rows.map((r) => {
                    const badgeCls =
                      statusBadge[r.labRequestStatus ?? ""] ?? "bg-gray-100 text-gray-600";
                    return (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <Td mono>{r.labNumber ? String(r.labNumber) : "—"}</Td>
                        <Td>{r.testName ?? "—"}</Td>
                        <Td>{r.groupName ?? "—"}</Td>
                        <Td>{r.diagnosis ?? "—"}</Td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {r.labRequestStatus ? (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeCls}`}
                            >
                              {r.labRequestStatus}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <Td>{fmtDate(r.requestDate)}</Td>
                        <Td>{fmtDate(r.doneDate)}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td className={`px-4 py-3 whitespace-nowrap text-gray-700 ${mono ? "font-mono" : ""}`}>
      {children}
    </td>
  );
}