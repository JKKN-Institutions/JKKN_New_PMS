import { notFound } from "next/navigation";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { patients, patientgroups, patientcategorys, occupationlists, insproviders, refrals } from "@/db/schema";
import { updatePatientAction } from "@/app/actions/patients";
import PatientForm from "../../_components/PatientForm";

export default async function EditPatientPage({
  params,
}: {
  params: { id: string };
}) {
  const db = getDb();

  const [[p], groups, categories, occupations, insProviders, referrals] = await Promise.all([
    db.select().from(patients)
      .where(and(eq(patients.id, params.id), eq(patients.deleted, 0))).limit(1),
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

  if (!p) notFound();

  const referralOptions = referrals.map((r) => ({
    id: r.id,
    name: [r.firstName, r.lastName].filter(Boolean).join(" ") || null,
  }));

  const boundAction = updatePatientAction.bind(null, p.id);

  const fullName = [p.salutation, p.firstName, p.lastName].filter(Boolean).join(" ");

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/patients/${p.id}`} className="text-sm text-gray-500 hover:text-gray-700">
          ← {fullName || "Patient"}
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Patient</h1>
      </div>

      <PatientForm
        action={boundAction}
        groups={groups}
        categories={categories}
        occupations={occupations}
        insproviders={insProviders}
        referrals={referralOptions}
        defaults={{
          salutation: p.salutation ?? "",
          first_name: p.firstName ?? "",
          last_name: p.lastName ?? "",
          name_tamil: p.nameTamil ?? "",
          sex: p.sex ?? "",
          birthdate: typeof p.birthdate === "string" ? p.birthdate : p.birthdate?.toISOString().slice(0, 10) ?? "",
          blood_grp: p.bloodGrp ?? "",
          father_name: p.fatherName ?? "",
          phone_mobile: p.phoneMobile ?? "",
          phone_home: p.phoneHome ?? "",
          phone_work: p.phoneWork ?? "",
          email_address: p.emailAddress ?? "",
          street: p.primaryAddressStreet ?? "",
          postalcode: p.primaryAddressPostalcode ?? "",
          patient_group_id: p.patientGroupId ?? "",
          patientcategory_id: p.patientcategoryId ?? "",
          occupationlist_id: p.occupationlistId ?? "",
          vip_patient: p.vipPatient === 1,
          refral_id: p.refralId ?? "",
          insprovider_id: p.insprovIderId ?? "",
          membership_type: p.membershipType ?? "",
          membership_expiry_date:
            typeof p.membershipExpiryDate === "string"
              ? p.membershipExpiryDate
              : p.membershipExpiryDate?.toISOString().slice(0, 10) ?? "",
          valid_till:
            typeof p.validTill === "string"
              ? p.validTill
              : p.validTill?.toISOString().slice(0, 10) ?? "",
        }}
      />
    </div>
  );
}
