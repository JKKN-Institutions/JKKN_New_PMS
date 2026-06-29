import { notFound } from "next/navigation";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { patients } from "@/db/schema";
import { PatientBanner } from "@/components/PatientBanner";
import PatientRecordShell from "../_components/PatientRecordShell";
import { PatientActions } from "../_components/PatientActions";

export default async function PatientIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const db = getDb();
  const [p] = await db
    .select({
      id: patients.id,
      patNumber: patients.patNumber,
      salutation: patients.salutation,
      firstName: patients.firstName,
      lastName: patients.lastName,
      sex: patients.sex,
      birthdate: patients.birthdate,
      bloodGrp: patients.bloodGrp,
      phoneMobile: patients.phoneMobile,
      status: patients.status,
    })
    .from(patients)
    .where(and(eq(patients.id, params.id), eq(patients.deleted, 0)))
    .limit(1);

  if (!p) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link href="/patients" className="text-sm text-gray-500 hover:text-gray-700 shrink-0">
          ← Patients
        </Link>
        <div className="flex items-center gap-2">
          <PatientActions patientId={p.id} status={p.status ?? "Active"} />
          <Link
            href={`/patients/${p.id}/edit`}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Edit
          </Link>
        </div>
      </div>

      <PatientBanner
        patient={{
          id: p.id,
          patNumber: p.patNumber?.toString() ?? null,
          salutation: p.salutation,
          firstName: p.firstName,
          lastName: p.lastName,
          sex: p.sex,
          birthdate: p.birthdate,
          bloodGrp: p.bloodGrp,
          phoneMobile: p.phoneMobile,
        }}
        className="mb-5"
      />

      <PatientRecordShell
        patientId={p.id}
        patNumber={p.patNumber?.toString() ?? ""}
        status={p.status ?? "Active"}
      >
        {children}
      </PatientRecordShell>
    </div>
  );
}
