import { and, eq, desc } from "drizzle-orm";
import { getDb } from "@/db";
import {
  medicalhistorys,
  preproblems,
  casesheets,
  periodontalexaminations,
  treatmentadvices,
  provisionaldiagnoss,
  diagnosislists,
  diagnosisgroups,
} from "@/db/schema";
import { fmtDate } from "@/lib/formatters";

export default async function PatientHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  const db = getDb();

  const [medHistory, sheets, periodontal, advices, diagnoses] = await Promise.all([
    db
      .select({
        id: medicalhistorys.id,
        description: medicalhistorys.description,
        medicalhistoryDate: medicalhistorys.medicalhistoryDate,
        dateEntered: medicalhistorys.dateEntered,
        problemName: preproblems.name,
      })
      .from(medicalhistorys)
      .leftJoin(preproblems, eq(medicalhistorys.preproblemId, preproblems.id))
      .where(and(eq(medicalhistorys.patientId, params.id), eq(medicalhistorys.deleted, 0)))
      .orderBy(desc(medicalhistorys.dateEntered)),

    db
      .select({
        id: casesheets.id,
        caseNumber: casesheets.caseNumber,
        status: casesheets.status,
        casesheetDate: casesheets.casesheetDate,
        casesheetType: casesheets.casesheetType,
        treatmentType: casesheets.treatmentType,
      })
      .from(casesheets)
      .where(and(eq(casesheets.patientId, params.id), eq(casesheets.deleted, 0)))
      .orderBy(desc(casesheets.casesheetDate)),

    db
      .select({
        id: periodontalexaminations.id,
        hygieneStatus: periodontalexaminations.hygieneStatus,
        bleedingOnProbing: periodontalexaminations.bleedingOnProbing,
        toothMobility: periodontalexaminations.toothMobility,
        furcation: periodontalexaminations.furcation,
        recession: periodontalexaminations.recession,
        dateEntered: periodontalexaminations.dateEntered,
      })
      .from(periodontalexaminations)
      .where(and(eq(periodontalexaminations.patientId, params.id), eq(periodontalexaminations.deleted, 0)))
      .orderBy(desc(periodontalexaminations.dateEntered)),

    db
      .select({
        id: treatmentadvices.id,
        description: treatmentadvices.description,
        treatmentlists: treatmentadvices.treatmentlists,
        exAmount: treatmentadvices.exAmount,
        dateEntered: treatmentadvices.dateEntered,
      })
      .from(treatmentadvices)
      .where(and(eq(treatmentadvices.patientId, params.id), eq(treatmentadvices.deleted, 0)))
      .orderBy(desc(treatmentadvices.dateEntered)),

    db
      .select({
        id: provisionaldiagnoss.id,
        toothNo: provisionaldiagnoss.toothNo,
        dateEntered: provisionaldiagnoss.dateEntered,
        diagnosisName: diagnosislists.name,
        groupName: diagnosisgroups.name,
      })
      .from(provisionaldiagnoss)
      .innerJoin(casesheets, eq(provisionaldiagnoss.parentId, casesheets.id))
      .leftJoin(diagnosislists, eq(provisionaldiagnoss.diagnosislistId, diagnosislists.id))
      .leftJoin(diagnosisgroups, eq(provisionaldiagnoss.diagnosisgroupId, diagnosisgroups.id))
      .where(
        and(
          eq(casesheets.patientId, params.id),
          eq(provisionaldiagnoss.parentType, "Casesheets"),
          eq(provisionaldiagnoss.deleted, 0)
        )
      )
      .orderBy(desc(provisionaldiagnoss.dateEntered)),
  ]);

  return (
    <div className="space-y-8">
      {/* Medical History */}
      <Section title="Medical History" count={medHistory.length}>
        {medHistory.length === 0 ? (
          <EmptyState message="No medical history recorded." />
        ) : (
          <div className="space-y-2">
            {medHistory.map((m) => (
              <div key={m.id} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{m.problemName || m.description || "—"}</p>
                  {m.problemName && m.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400 shrink-0">{fmtDate(m.medicalhistoryDate || m.dateEntered)}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Periodontal Examinations */}
      <Section title="Periodontal Examinations" count={periodontal.length}>
        {periodontal.length === 0 ? (
          <EmptyState message="No periodontal examinations recorded." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Hygiene Status</Th>
                  <Th>Bleeding on Probing</Th>
                  <Th>Tooth Mobility</Th>
                  <Th>Furcation</Th>
                  <Th>Recession</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {periodontal.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <Td>
                      {p.hygieneStatus ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.hygieneStatus === "Good" ? "bg-green-100 text-green-700" : p.hygieneStatus === "Fair" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                          {p.hygieneStatus}
                        </span>
                      ) : "—"}
                    </Td>
                    <Td>{p.bleedingOnProbing || "—"}</Td>
                    <Td>{p.toothMobility || "—"}</Td>
                    <Td>{p.furcation || "—"}</Td>
                    <Td>{p.recession || "—"}</Td>
                    <Td>{fmtDate(p.dateEntered)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Provisional Diagnosis */}
      <Section title="Provisional Diagnosis" count={diagnoses.length}>
        {diagnoses.length === 0 ? (
          <EmptyState message="No provisional diagnoses recorded." />
        ) : (
          <div className="space-y-2">
            {diagnoses.map((d) => (
              <div key={d.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{d.diagnosisName || "—"}</p>
                  {d.groupName && <p className="text-xs text-gray-500">{d.groupName}</p>}
                </div>
                {d.toothNo && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">#{d.toothNo}</span>
                )}
                <span className="text-xs text-gray-400 shrink-0">{fmtDate(d.dateEntered)}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Treatment Advice */}
      <Section title="Treatment Advice" count={advices.length}>
        {advices.length === 0 ? (
          <EmptyState message="No treatment advice recorded." />
        ) : (
          <div className="space-y-2">
            {advices.map((a) => (
              <div key={a.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-700">{a.description || "—"}</p>
                  <span className="text-xs text-gray-400 shrink-0">{fmtDate(a.dateEntered)}</span>
                </div>
                {a.exAmount != null && (
                  <p className="text-xs text-gray-500 mt-1">Est. Amount: ₹{a.exAmount.toLocaleString()}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Case Sheet Timeline */}
      <Section title="Case Sheet Timeline" count={sheets.length}>
        {sheets.length === 0 ? (
          <EmptyState message="No case sheets found." />
        ) : (
          <div className="relative border-l-2 border-gray-200 ml-3 space-y-4 pl-6">
            {sheets.map((s) => (
              <div key={s.id} className="relative">
                <span className="absolute -left-[1.625rem] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-blue-400" />
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-gray-500">#{s.caseNumber}</span>
                    <span className="text-xs text-gray-400">{fmtDate(s.casesheetDate)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{s.casesheetType ?? "—"}</p>
                  {s.treatmentType && <p className="text-xs text-gray-500 mt-0.5">{s.treatmentType}</p>}
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        {title} <span className="font-normal text-gray-400">({count})</span>
      </h2>
      {children}
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
      {message}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 whitespace-nowrap text-gray-700">{children}</td>;
}

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "—";
  const color = s === "Open" ? "bg-green-100 text-green-700" : s === "Closed" ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700";
  return <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{s}</span>;
}
