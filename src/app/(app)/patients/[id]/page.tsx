import { notFound } from "next/navigation";
import { and, eq, desc } from "drizzle-orm";
import { getDb } from "@/db";
import { patients, medicalhistorys, preproblems } from "@/db/schema";
import { calcAge, fmtCurrency, fmtDate } from "@/lib/formatters";

export default async function PatientOverviewPage({
  params,
}: {
  params: { id: string };
}) {
  const db = getDb();

  const [[p], medHistory] = await Promise.all([
    db
      .select()
      .from(patients)
      .where(and(eq(patients.id, params.id), eq(patients.deleted, 0)))
      .limit(1),
    db
      .select({
        id: medicalhistorys.id,
        description: medicalhistorys.description,
        problemName: preproblems.name,
      })
      .from(medicalhistorys)
      .leftJoin(preproblems, eq(medicalhistorys.preproblemId, preproblems.id))
      .where(
        and(
          eq(medicalhistorys.patientId, params.id),
          eq(medicalhistorys.deleted, 0)
        )
      )
      .orderBy(desc(medicalhistorys.dateEntered)),
  ]);

  if (!p) notFound();

  const fullName = [p.salutation, p.firstName, p.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InfoCard title="Personal Details">
        <Row label="Full Name" value={fullName || "—"} />
        <Row label="Sex" value={p.sex ?? "—"} />
        <Row label="Age" value={p.birthdate ? calcAge(p.birthdate) : "—"} />
        <Row label="Date of Birth" value={fmtDate(p.birthdate)} />
        <Row label="Blood Group" value={p.bloodGrp ?? "—"} />
        <Row label="Father's Name" value={p.fatherName ?? "—"} />
      </InfoCard>

      <InfoCard title="Contact">
        <Row label="Mobile" value={p.phoneMobile ?? "—"} />
        <Row label="Home" value={p.phoneHome ?? "—"} />
        <Row label="Work" value={p.phoneWork ?? "—"} />
        <Row label="Email" value={p.emailAddress ?? "—"} />
      </InfoCard>

      <InfoCard title="Address">
        <Row label="Street" value={p.primaryAddressStreet ?? "—"} />
        <Row label="Postal Code" value={p.primaryAddressPostalcode ?? "—"} />
      </InfoCard>

      <InfoCard title="Registration">
        <Row label="Pat Number" value={p.patNumber?.toString() ?? "—"} />
        <Row label="Reg Date" value={fmtDate(p.regDate)} />
        <Row label="No. of Visits" value={p.noOfVisit?.toString() ?? "0"} />
        <Row label="Outstanding" value={fmtCurrency(p.outstandingAmt)} />
        <Row
          label="Language"
          value={
            p.preferredLang === "ta"
              ? "Tamil"
              : p.preferredLang === "en"
              ? "English"
              : (p.preferredLang ?? "—")
          }
        />
      </InfoCard>

      {medHistory.length > 0 && (
        <InfoCard title="Medical History">
          <ul className="space-y-1">
            {medHistory.map((m) => (
              <li key={m.id} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{m.problemName || m.description || "—"}</span>
              </li>
            ))}
          </ul>
        </InfoCard>
      )}

      {(p.membershipType || p.membershipExpiryDate) && (
        <InfoCard title="Membership">
          <Row label="Type" value={p.membershipType ?? "—"} />
          <Row label="Expiry" value={fmtDate(p.membershipExpiryDate)} />
          <Row label="Valid Till" value={fmtDate(p.validTill)} />
        </InfoCard>
      )}
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}
