import Link from "next/link";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { patientgroups, patientcategorys, occupationlists, insproviders, refrals } from "@/db/schema";
import { createPatientAction } from "@/app/actions/patients";
import PatientForm from "../_components/PatientForm";

export default async function NewPatientPage() {
  const db = getDb();

  const [groups, categories, occupations, insProviders, referrals] = await Promise.all([
    db.select({ id: patientgroups.id, name: patientgroups.name })
      .from(patientgroups).where(eq(patientgroups.deleted, 0)),
    db.select({ id: patientcategorys.id, name: patientcategorys.name })
      .from(patientcategorys).where(eq(patientcategorys.deleted, 0)),
    db.select({ id: occupationlists.id, name: occupationlists.name })
      .from(occupationlists).where(eq(occupationlists.deleted, 0)),
    db.select({ id: insproviders.id, name: insproviders.name })
      .from(insproviders).where(eq(insproviders.deleted, 0)),
    db.select({ id: refrals.id, firstName: refrals.firstName, lastName: refrals.lastName })
      .from(refrals).where(eq(refrals.deleted, 0)),
  ]);

  const referralOptions = referrals.map((r) => ({
    id: r.id,
    name: [r.firstName, r.lastName].filter(Boolean).join(" ") || null,
  }));

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/patients" className="text-sm text-gray-500 hover:text-gray-700">
          ← Patients
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">New Patient Registration</h1>
      </div>

      <PatientForm
        action={createPatientAction}
        groups={groups}
        categories={categories}
        occupations={occupations}
        insproviders={insProviders}
        referrals={referralOptions}
      />
    </div>
  );
}
