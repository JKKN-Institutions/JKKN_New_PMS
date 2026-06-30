"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID, createHash } from "crypto";
import { getDb } from "@/db";
import {
  departments,
  users,
  treatmentlists,
  treatmentgroups,
  worksteplists,
  diagnosisgroups,
  diagnosislists,
  complaintlists,
  preproblems,
  patientgroups,
  patientcategorys,
  insproviders,
  taxtypes,
  sequences,
  labsetupgroups,
  labsetups,
  prescriptionlists,
  prescriptionbrands,
  items,
  pharmaracks,
  pharmashelfs,
} from "@/db/schema";
import { getSession } from "@/lib/auth";

function pick(fd: FormData, key: string): string | null {
  const v = (fd.get(key) as string | null)?.trim();
  return v || null;
}


// ── Departments ──────────────────────────────────────────────────────────────

export async function createDepartmentAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(departments).values({
    id: randomUUID(),
    name,
    departmentStatus: pick(formData, "department_status") ?? "Active",
    departmentType: pick(formData, "department_type"),
    deleted: 0,
  });

  revalidatePath("/admin/departments");
  return null;
}

export async function updateDepartmentAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db
    .update(departments)
    .set({
      name,
      departmentStatus: pick(formData, "department_status") ?? "Active",
      departmentType: pick(formData, "department_type"),
    })
    .where(eq(departments.id, id));

  revalidatePath("/admin/departments");
  return null;
}

export async function deleteDepartmentAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db.update(departments).set({ deleted: 1 }).where(eq(departments.id, id));
  revalidatePath("/admin/departments");
}

// ── Users ────────────────────────────────────────────────────────────────────

export async function createUserAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const userName = pick(formData, "user_name");
  if (!userName) return "Username is required.";
  const firstName = pick(formData, "first_name");
  if (!firstName) return "First name is required.";
  const passwordRaw = pick(formData, "password");
  if (!passwordRaw) return "Password is required.";

  const userHash = createHash("md5").update(passwordRaw).digest("hex");

  const db = getDb();
  const now = new Date();
  await db.insert(users).values({
    id: randomUUID(),
    userName,
    userHash,
    salutation: pick(formData, "salutation"),
    firstName,
    lastName: pick(formData, "last_name"),
    isAdmin: formData.get("is_admin") === "on" ? 1 : 0,
    title: pick(formData, "title"),
    departmentId: pick(formData, "department_id"),
    phoneMobile: pick(formData, "phone_mobile"),
    phoneWork: pick(formData, "phone_work"),
    emailAddress: pick(formData, "email_address"),
    status: pick(formData, "status") ?? "Active",
    qualification: pick(formData, "qualification"),
    specialization: pick(formData, "specialization"),
    deleted: 0,
    createdBy: session.id,
    modifiedUserId: session.id,
    dateEntered: now,
    dateModified: now,
  });

  revalidatePath("/admin/users");
  return null;
}

export async function updateUserAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const firstName = pick(formData, "first_name");
  if (!firstName) return "First name is required.";

  const db = getDb();
  const now = new Date();

  const updateData: Record<string, unknown> = {
    salutation: pick(formData, "salutation"),
    firstName,
    lastName: pick(formData, "last_name"),
    isAdmin: formData.get("is_admin") === "on" ? 1 : 0,
    title: pick(formData, "title"),
    departmentId: pick(formData, "department_id"),
    phoneMobile: pick(formData, "phone_mobile"),
    phoneWork: pick(formData, "phone_work"),
    emailAddress: pick(formData, "email_address"),
    status: pick(formData, "status") ?? "Active",
    qualification: pick(formData, "qualification"),
    specialization: pick(formData, "specialization"),
    modifiedUserId: session.id,
    dateModified: now,
  };

  // Only update password if provided
  const passwordRaw = pick(formData, "password");
  if (passwordRaw) {
    updateData.userHash = createHash("md5").update(passwordRaw).digest("hex");
  }

  await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, id));

  revalidatePath("/admin/users");
  return null;
}

export async function deleteUserAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(users)
    .set({ deleted: 1, dateModified: new Date() })
    .where(eq(users.id, id));
  revalidatePath("/admin/users");
}

// ── Treatment Lists ──────────────────────────────────────────────────────────

export async function createTreatmentListAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  const now = new Date();
  const durationRaw = pick(formData, "duration");
  const unitsRaw = pick(formData, "units");

  await db.insert(treatmentlists).values({
    id: randomUUID(),
    name,
    departmentId: pick(formData, "department_id"),
    units: unitsRaw ? parseInt(unitsRaw, 10) : null,
    status: pick(formData, "status") ?? "Active",
    duration: durationRaw ? parseInt(durationRaw, 10) : null,
    deleted: 0,
    dateEntered: now,
    dateModified: now,
  });

  revalidatePath("/admin/treatment-lists");
  return null;
}

export async function updateTreatmentListAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  const durationRaw = pick(formData, "duration");
  const unitsRaw = pick(formData, "units");

  await db
    .update(treatmentlists)
    .set({
      name,
      departmentId: pick(formData, "department_id"),
      units: unitsRaw ? parseInt(unitsRaw, 10) : null,
      status: pick(formData, "status") ?? "Active",
      duration: durationRaw ? parseInt(durationRaw, 10) : null,
      dateModified: new Date(),
    })
    .where(eq(treatmentlists.id, id));

  revalidatePath("/admin/treatment-lists");
  return null;
}

export async function deleteTreatmentListAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(treatmentlists)
    .set({ deleted: 1, dateModified: new Date() })
    .where(eq(treatmentlists.id, id));
  revalidatePath("/admin/treatment-lists");
}

// ── Treatment Groups ─────────────────────────────────────────────────────────

export async function createTreatmentGroupAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(treatmentgroups).values({
    id: randomUUID(),
    name,
    deleted: 0,
  });

  revalidatePath("/admin/treatment-groups");
  return null;
}

export async function deleteTreatmentGroupAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(treatmentgroups)
    .set({ deleted: 1 })
    .where(eq(treatmentgroups.id, id));
  revalidatePath("/admin/treatment-groups");
}

// ── Workstep Lists ───────────────────────────────────────────────────────────

export async function createWorkstepListAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  const now = new Date();
  const seqNoRaw = pick(formData, "seq_no");
  const noOfDaysRaw = pick(formData, "no_of_days");

  await db.insert(worksteplists).values({
    id: randomUUID(),
    name,
    seqNo: seqNoRaw ? parseInt(seqNoRaw, 10) : null,
    status: pick(formData, "status") ?? "Active",
    approvalRequired: formData.get("approval_required") === "on" ? 1 : 0,
    noOfDays: noOfDaysRaw ? parseInt(noOfDaysRaw, 10) : null,
    deleted: 0,
    dateEntered: now,
    dateModified: now,
  });

  revalidatePath("/admin/workstep-lists");
  return null;
}

export async function updateWorkstepListAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  const seqNoRaw = pick(formData, "seq_no");
  const noOfDaysRaw = pick(formData, "no_of_days");

  await db
    .update(worksteplists)
    .set({
      name,
      seqNo: seqNoRaw ? parseInt(seqNoRaw, 10) : null,
      status: pick(formData, "status") ?? "Active",
      approvalRequired: formData.get("approval_required") === "on" ? 1 : 0,
      noOfDays: noOfDaysRaw ? parseInt(noOfDaysRaw, 10) : null,
      dateModified: new Date(),
    })
    .where(eq(worksteplists.id, id));

  revalidatePath("/admin/workstep-lists");
  return null;
}

export async function deleteWorkstepListAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(worksteplists)
    .set({ deleted: 1, dateModified: new Date() })
    .where(eq(worksteplists.id, id));
  revalidatePath("/admin/workstep-lists");
}

// ── Diagnosis Groups ─────────────────────────────────────────────────────────

export async function createDiagnosisGroupAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(diagnosisgroups).values({
    id: randomUUID(),
    name,
    deleted: 0,
  });

  revalidatePath("/admin/diagnosis-groups");
  return null;
}

export async function deleteDiagnosisGroupAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(diagnosisgroups)
    .set({ deleted: 1 })
    .where(eq(diagnosisgroups.id, id));
  revalidatePath("/admin/diagnosis-groups");
}

// ── Diagnosis Lists ──────────────────────────────────────────────────────────

export async function createDiagnosisListAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(diagnosislists).values({
    id: randomUUID(),
    name,
    diagnosisgroupId: pick(formData, "diagnosisgroup_id"),
    deleted: 0,
  });

  revalidatePath("/admin/diagnosis-lists");
  return null;
}

export async function updateDiagnosisListAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db
    .update(diagnosislists)
    .set({
      name,
      diagnosisgroupId: pick(formData, "diagnosisgroup_id"),
    })
    .where(eq(diagnosislists.id, id));

  revalidatePath("/admin/diagnosis-lists");
  return null;
}

export async function deleteDiagnosisListAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(diagnosislists)
    .set({ deleted: 1 })
    .where(eq(diagnosislists.id, id));
  revalidatePath("/admin/diagnosis-lists");
}

// ── Complaint Lists ──────────────────────────────────────────────────────────

export async function createComplaintListAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(complaintlists).values({
    id: randomUUID(),
    name,
    deleted: 0,
  });

  revalidatePath("/admin/complaint-lists");
  return null;
}

export async function updateComplaintListAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db
    .update(complaintlists)
    .set({ name })
    .where(eq(complaintlists.id, id));

  revalidatePath("/admin/complaint-lists");
  return null;
}

export async function deleteComplaintListAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(complaintlists)
    .set({ deleted: 1 })
    .where(eq(complaintlists.id, id));
  revalidatePath("/admin/complaint-lists");
}

// ── Preproblems ──────────────────────────────────────────────────────────────

export async function createPreproblemAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(preproblems).values({
    id: randomUUID(),
    name,
    status: pick(formData, "status") ?? "Active",
    deleted: 0,
  });

  revalidatePath("/admin/preproblems");
  return null;
}

export async function updatePreproblemAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db
    .update(preproblems)
    .set({ name, status: pick(formData, "status") ?? "Active" })
    .where(eq(preproblems.id, id));

  revalidatePath("/admin/preproblems");
  return null;
}

export async function deletePreproblemAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(preproblems)
    .set({ deleted: 1 })
    .where(eq(preproblems.id, id));
  revalidatePath("/admin/preproblems");
}

// ── Patient Groups ───────────────────────────────────────────────────────────

export async function createPatientGroupAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(patientgroups).values({ id: randomUUID(), name, deleted: 0 });
  revalidatePath("/admin/patient-groups");
  return null;
}

export async function updatePatientGroupAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.update(patientgroups).set({ name }).where(eq(patientgroups.id, id));
  revalidatePath("/admin/patient-groups");
  return null;
}

export async function deletePatientGroupAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(patientgroups)
    .set({ deleted: 1 })
    .where(eq(patientgroups.id, id));
  revalidatePath("/admin/patient-groups");
}

// ── Patient Categories ───────────────────────────────────────────────────────

export async function createPatientCategoryAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(patientcategorys).values({ id: randomUUID(), name, deleted: 0 });
  revalidatePath("/admin/patient-categories");
  return null;
}

export async function updatePatientCategoryAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db
    .update(patientcategorys)
    .set({ name })
    .where(eq(patientcategorys.id, id));
  revalidatePath("/admin/patient-categories");
  return null;
}

export async function deletePatientCategoryAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(patientcategorys)
    .set({ deleted: 1 })
    .where(eq(patientcategorys.id, id));
  revalidatePath("/admin/patient-categories");
}

// ── Insurance Providers ──────────────────────────────────────────────────────

export async function createInsProviderAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(insproviders).values({ id: randomUUID(), name, deleted: 0 });
  revalidatePath("/admin/ins-providers");
  return null;
}

export async function updateInsProviderAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db
    .update(insproviders)
    .set({ name })
    .where(eq(insproviders.id, id));
  revalidatePath("/admin/ins-providers");
  return null;
}

export async function deleteInsProviderAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(insproviders)
    .set({ deleted: 1 })
    .where(eq(insproviders.id, id));
  revalidatePath("/admin/ins-providers");
}

// ── Tax Types ────────────────────────────────────────────────────────────────

export async function createTaxTypeAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  const taxRaw = pick(formData, "tax");

  await db.insert(taxtypes).values({
    id: randomUUID(),
    name,
    tax: taxRaw ? parseFloat(taxRaw) : null,
    status: pick(formData, "status") ?? "Active",
    deleted: 0,
  });

  revalidatePath("/admin/tax-types");
  return null;
}

export async function updateTaxTypeAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  const taxRaw = pick(formData, "tax");

  await db
    .update(taxtypes)
    .set({
      name,
      tax: taxRaw ? parseFloat(taxRaw) : null,
      status: pick(formData, "status") ?? "Active",
    })
    .where(eq(taxtypes.id, id));

  revalidatePath("/admin/tax-types");
  return null;
}

export async function deleteTaxTypeAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db.update(taxtypes).set({ deleted: 1 }).where(eq(taxtypes.id, id));
  revalidatePath("/admin/tax-types");
}

// ── Sequences ────────────────────────────────────────────────────────────────

export async function createSequenceAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  const periodRaw = pick(formData, "period");
  const seqNoRaw = pick(formData, "seq_no");

  await db.insert(sequences).values({
    id: randomUUID(),
    name,
    sequenceType: pick(formData, "sequence_type"),
    period: periodRaw ? parseInt(periodRaw, 10) : null,
    seqNo: seqNoRaw ? parseInt(seqNoRaw, 10) : null,
    deleted: 0,
  });

  revalidatePath("/admin/sequences");
  return null;
}

export async function updateSequenceAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  const periodRaw = pick(formData, "period");
  const seqNoRaw = pick(formData, "seq_no");

  await db
    .update(sequences)
    .set({
      name,
      sequenceType: pick(formData, "sequence_type"),
      period: periodRaw ? parseInt(periodRaw, 10) : null,
      seqNo: seqNoRaw ? parseInt(seqNoRaw, 10) : null,
    })
    .where(eq(sequences.id, id));

  revalidatePath("/admin/sequences");
  return null;
}

export async function deleteSequenceAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db.update(sequences).set({ deleted: 1 }).where(eq(sequences.id, id));
  revalidatePath("/admin/sequences");
}

// ── Lab Setup Groups ─────────────────────────────────────────────────────────

export async function createLabSetupGroupAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(labsetupgroups).values({ id: randomUUID(), name, deleted: 0 });
  revalidatePath("/admin/lab-setup-groups");
  return null;
}

export async function deleteLabSetupGroupAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(labsetupgroups)
    .set({ deleted: 1 })
    .where(eq(labsetupgroups.id, id));
  revalidatePath("/admin/lab-setup-groups");
}

// ── Lab Setups ───────────────────────────────────────────────────────────────

export async function createLabSetupAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(labsetups).values({
    id: randomUUID(),
    name,
    labsetupgroupId: pick(formData, "labsetupgroup_id"),
    deleted: 0,
  });

  revalidatePath("/admin/lab-setups");
  return null;
}

export async function updateLabSetupAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db
    .update(labsetups)
    .set({
      name,
      labsetupgroupId: pick(formData, "labsetupgroup_id"),
    })
    .where(eq(labsetups.id, id));

  revalidatePath("/admin/lab-setups");
  return null;
}

export async function deleteLabSetupAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db.update(labsetups).set({ deleted: 1 }).where(eq(labsetups.id, id));
  revalidatePath("/admin/lab-setups");
}

// ── Prescription Lists ───────────────────────────────────────────────────────

export async function createPrescriptionListAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(prescriptionlists).values({ id: randomUUID(), name, deleted: 0 });
  revalidatePath("/admin/prescription-lists");
  return null;
}

export async function deletePrescriptionListAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(prescriptionlists)
    .set({ deleted: 1 })
    .where(eq(prescriptionlists.id, id));
  revalidatePath("/admin/prescription-lists");
}

// ── Prescription Brands ──────────────────────────────────────────────────────

export async function createPrescriptionBrandAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(prescriptionbrands).values({
    id: randomUUID(),
    name,
    prescriptionlistId: pick(formData, "prescriptionlist_id"),
    deleted: 0,
  });

  revalidatePath("/admin/prescription-brands");
  return null;
}

export async function updatePrescriptionBrandAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db
    .update(prescriptionbrands)
    .set({
      name,
      prescriptionlistId: pick(formData, "prescriptionlist_id"),
    })
    .where(eq(prescriptionbrands.id, id));

  revalidatePath("/admin/prescription-brands");
  return null;
}

export async function deletePrescriptionBrandAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(prescriptionbrands)
    .set({ deleted: 1 })
    .where(eq(prescriptionbrands.id, id));
  revalidatePath("/admin/prescription-brands");
}

// ── Items ────────────────────────────────────────────────────────────────────

export async function createItemAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  const now = new Date();

  await db.insert(items).values({
    id: randomUUID(),
    name,
    itemCode: pick(formData, "item_code"),
    measuringUnit: pick(formData, "measuring_unit"),
    warnQty: pick(formData, "warn_qty"),
    itemBill: formData.get("item_bill") === "on" ? 1 : 0,
    isSaleable: formData.get("is_saleable") === "on" ? 1 : 0,
    status: pick(formData, "status") ?? "Active",
    deleted: 0,
    dateEntered: now,
  });

  revalidatePath("/admin/items");
  return null;
}

export async function updateItemAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();

  await db
    .update(items)
    .set({
      name,
      itemCode: pick(formData, "item_code"),
      measuringUnit: pick(formData, "measuring_unit"),
      warnQty: pick(formData, "warn_qty"),
      itemBill: formData.get("item_bill") === "on" ? 1 : 0,
      isSaleable: formData.get("is_saleable") === "on" ? 1 : 0,
      status: pick(formData, "status") ?? "Active",
    })
    .where(eq(items.id, id));

  revalidatePath("/admin/items");
  return null;
}

export async function deleteItemAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db.update(items).set({ deleted: 1 }).where(eq(items.id, id));
  revalidatePath("/admin/items");
}

// ── Pharma Racks ─────────────────────────────────────────────────────────────

export async function createPharmaRackAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(pharmaracks).values({ id: randomUUID(), name, deleted: 0 });
  revalidatePath("/admin/pharma-racks");
  return null;
}

export async function deletePharmaRackAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db.update(pharmaracks).set({ deleted: 1 }).where(eq(pharmaracks.id, id));
  revalidatePath("/admin/pharma-racks");
}

// ── Pharma Shelves ───────────────────────────────────────────────────────────

export async function createPharmaShelfAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db.insert(pharmashelfs).values({
    id: randomUUID(),
    name,
    rackId: pick(formData, "rack_id"),
    deleted: 0,
  });

  revalidatePath("/admin/pharma-shelves");
  return null;
}

export async function updatePharmaShelfAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const name = pick(formData, "name");
  if (!name) return "Name is required.";

  const db = getDb();
  await db
    .update(pharmashelfs)
    .set({
      name,
      rackId: pick(formData, "rack_id"),
    })
    .where(eq(pharmashelfs.id, id));

  revalidatePath("/admin/pharma-shelves");
  return null;
}

export async function deletePharmaShelfAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(pharmashelfs)
    .set({ deleted: 1 })
    .where(eq(pharmashelfs.id, id));
  revalidatePath("/admin/pharma-shelves");
}
