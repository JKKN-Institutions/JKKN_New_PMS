"use server";

import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getDb } from "@/db";
import {
  casesheets,
  complaints,
  medicalhistorys,
  provisionaldiagnoss,
  diagnosiss,
  treatmentadvices,
  tooths,
  periodontalexaminations,
} from "@/db/schema";
import { getSession } from "@/lib/auth";

function pick(fd: FormData, key: string): string | null {
  const v = (fd.get(key) as string | null)?.trim();
  return v || null;
}

function pickDate(fd: FormData, key: string): Date | null {
  const v = pick(fd, key);
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

async function genCaseNumber(): Promise<number> {
  const db = getDb();
  const [{ cnt }] = await db
    .select({ cnt: sql<number>`COUNT(*)` })
    .from(casesheets)
    .where(sql`deleted = 0`);
  return Number(cnt) + 1;
}

// ── Casesheet ────────────────────────────────────────────────────────────────

export async function createCasesheetAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const patientId = pick(formData, "patient_id");
  if (!patientId) return "Patient is required.";

  const db = getDb();
  const id = randomUUID();
  const caseNumber = await genCaseNumber();
  const now = new Date();

  await db.insert(casesheets).values({
    id,
    caseNumber,
    patientId,
    departmentId: pick(formData, "department_id"),
    casesheetType: pick(formData, "casesheet_type"),
    treatmentType: pick(formData, "treatment_type"),
    status: "Open",
    isPrivate: formData.get("is_private") === "on" ? 1 : 0,
    casesheetDate: now,
    deleted: 0,
    createdBy: session.id,
    modifiedUserId: session.id,
    assignedUserId: session.id,
    dateEntered: now,
    dateModified: now,
  });

  redirect(`/casesheets/${id}`);
}

export async function closeCasesheetAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  const now = new Date();

  await db
    .update(casesheets)
    .set({
      status: "Closed",
      closedDate: now,
      modifiedUserId: session.id,
      dateModified: now,
    })
    .where(and(eq(casesheets.id, id), eq(casesheets.deleted, 0)));

  revalidatePath(`/casesheets/${id}`);
}

// ── Complaints ───────────────────────────────────────────────────────────────

export async function addComplaintAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parentId = pick(formData, "parent_id");
  if (!parentId) return "Parent is required.";

  const db = getDb();
  const id = randomUUID();
  const now = new Date();

  await db.insert(complaints).values({
    id,
    parentId,
    parentType: pick(formData, "parent_type") ?? "casesheets",
    complaintlistId: pick(formData, "complaintlist_id"),
    toothNo: pick(formData, "tooth_no"),
    description: pick(formData, "description"),
    deleted: 0,
    createdBy: session.id,
    dateEntered: now,
  });

  revalidatePath(`/casesheets/${parentId}`);
  return null;
}

export async function deleteComplaintAction(
  id: string,
  casesheetId: string
): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(complaints)
    .set({ deleted: 1 })
    .where(eq(complaints.id, id));

  revalidatePath(`/casesheets/${casesheetId}`);
}

// ── Medical History ──────────────────────────────────────────────────────────

export async function addMedicalHistoryAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parentId = pick(formData, "parent_id");
  if (!parentId) return "Parent is required.";

  const db = getDb();
  const id = randomUUID();
  const now = new Date();

  await db.insert(medicalhistorys).values({
    id,
    parentId,
    parentType: pick(formData, "parent_type"),
    patientId: pick(formData, "patient_id"),
    departmentId: pick(formData, "department_id"),
    preproblemId: pick(formData, "preproblem_id"),
    description: pick(formData, "description"),
    medicalhistoryDate: pickDate(formData, "medicalhistory_date") ?? now,
    deleted: 0,
    createdBy: session.id,
    dateEntered: now,
    dateModified: now,
  });

  revalidatePath(`/casesheets/${parentId}`);
  return null;
}

export async function updateMedicalHistoryAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parentId = pick(formData, "parent_id");
  const db = getDb();
  const now = new Date();

  await db
    .update(medicalhistorys)
    .set({
      preproblemId: pick(formData, "preproblem_id"),
      description: pick(formData, "description"),
      medicalhistoryDate: pickDate(formData, "medicalhistory_date") ?? now,
      dateModified: now,
    })
    .where(and(eq(medicalhistorys.id, id), eq(medicalhistorys.deleted, 0)));

  if (parentId) revalidatePath(`/casesheets/${parentId}`);
  return null;
}

export async function deleteMedicalHistoryAction(
  id: string,
  casesheetId: string
): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(medicalhistorys)
    .set({ deleted: 1, dateModified: new Date() })
    .where(eq(medicalhistorys.id, id));

  revalidatePath(`/casesheets/${casesheetId}`);
}

// ── Provisional Diagnosis ────────────────────────────────────────────────────

export async function addProvDiagnosisAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parentId = pick(formData, "parent_id");
  if (!parentId) return "Parent is required.";

  const db = getDb();
  const id = randomUUID();
  const now = new Date();

  await db.insert(provisionaldiagnoss).values({
    id,
    parentId,
    parentType: pick(formData, "parent_type") ?? "casesheets",
    diagnosisgroupId: pick(formData, "diagnosisgroup_id"),
    diagnosislistId: pick(formData, "diagnosislist_id"),
    toothNo: pick(formData, "tooth_no"),
    deleted: 0,
    dateEntered: now,
  });

  revalidatePath(`/casesheets/${parentId}`);
  return null;
}

export async function deleteProvDiagnosisAction(
  id: string,
  casesheetId: string
): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(provisionaldiagnoss)
    .set({ deleted: 1 })
    .where(eq(provisionaldiagnoss.id, id));

  revalidatePath(`/casesheets/${casesheetId}`);
}

// ── Final Diagnosis ──────────────────────────────────────────────────────────

export async function addDiagnosisAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parentId = pick(formData, "parent_id");
  if (!parentId) return "Parent is required.";

  const db = getDb();
  const id = randomUUID();
  const now = new Date();

  await db.insert(diagnosiss).values({
    id,
    parentId,
    parentType: pick(formData, "parent_type") ?? "casesheets",
    diagnosisgroupId: pick(formData, "diagnosisgroup_id"),
    diagnosislistId: pick(formData, "diagnosislist_id"),
    toothNo: pick(formData, "tooth_no"),
    deleted: 0,
    dateEntered: now,
  });

  revalidatePath(`/casesheets/${parentId}`);
  return null;
}

export async function deleteDiagnosisAction(
  id: string,
  casesheetId: string
): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(diagnosiss)
    .set({ deleted: 1 })
    .where(eq(diagnosiss.id, id));

  revalidatePath(`/casesheets/${casesheetId}`);
}

// ── Treatment Advice ─────────────────────────────────────────────────────────

export async function saveTreatmentAdviceAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parentId = pick(formData, "parent_id");
  if (!parentId) return "Parent is required.";

  const db = getDb();
  const now = new Date();

  // Check for existing record
  const existing = await db
    .select({ id: treatmentadvices.id })
    .from(treatmentadvices)
    .where(
      and(
        eq(treatmentadvices.parentId, parentId),
        eq(treatmentadvices.deleted, 0)
      )
    )
    .limit(1);

  const exAmountRaw = pick(formData, "ex_amount");
  const exAmount = exAmountRaw ? parseFloat(exAmountRaw) : null;

  if (existing.length > 0) {
    await db
      .update(treatmentadvices)
      .set({
        patientId: pick(formData, "patient_id"),
        departmentId: pick(formData, "department_id"),
        description: pick(formData, "description"),
        exAmount: exAmount ?? undefined,
        dateModified: now,
      })
      .where(eq(treatmentadvices.id, existing[0].id));
  } else {
    const id = randomUUID();
    await db.insert(treatmentadvices).values({
      id,
      parentId,
      parentType: pick(formData, "parent_type"),
      patientId: pick(formData, "patient_id"),
      departmentId: pick(formData, "department_id"),
      description: pick(formData, "description"),
      exAmount: exAmount ?? undefined,
      deleted: 0,
      createdBy: session.id,
      dateEntered: now,
      dateModified: now,
    });
  }

  revalidatePath(`/casesheets/${parentId}`);
  return null;
}

// ── Tooth Status ─────────────────────────────────────────────────────────────

export async function saveToothStatusAction(
  patientId: string,
  casesheetId: string,
  toothNum: number,
  toothStatus: string,
  dentition: string
): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  const now = new Date();

  const existing = await db
    .select({ id: tooths.id })
    .from(tooths)
    .where(
      and(
        eq(tooths.patientId, patientId),
        eq(tooths.parentId, casesheetId),
        sql`${tooths.toothNum} = ${toothNum}`,
        eq(tooths.deleted, 0)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(tooths)
      .set({ toothStatus, dentition, dateModified: now })
      .where(eq(tooths.id, existing[0].id));
  } else {
    const id = randomUUID();
    await db.insert(tooths).values({
      id,
      patientId,
      parentId: casesheetId,
      parentType: "casesheets",
      toothNum,
      toothStatus,
      dentition,
      deleted: 0,
      createdBy: session.id,
      dateEntered: now,
      dateModified: now,
    });
  }

  revalidatePath(`/casesheets/${casesheetId}`);
}

// ── Periodontal Examination ───────────────────────────────────────────────────

export async function savePerioExamAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parentId = pick(formData, "parent_id");
  if (!parentId) return "Parent is required.";

  const patientId = pick(formData, "patient_id");
  const db = getDb();
  const now = new Date();

  const existing = await db
    .select({ id: periodontalexaminations.id })
    .from(periodontalexaminations)
    .where(
      and(
        eq(periodontalexaminations.parentId, parentId),
        eq(periodontalexaminations.deleted, 0)
      )
    )
    .limit(1);

  const values = {
    parentType: pick(formData, "parent_type"),
    patientId,
    hygieneStatus: pick(formData, "hygiene_status"),
    bleedingOnProbing: pick(formData, "bleeding_on_probing"),
    toothMobility: pick(formData, "tooth_mobility"),
    furcation: pick(formData, "furcation"),
    recession: pick(formData, "recession"),
    dateModified: now,
  };

  if (existing.length > 0) {
    await db
      .update(periodontalexaminations)
      .set(values)
      .where(eq(periodontalexaminations.id, existing[0].id));
  } else {
    const id = randomUUID();
    await db.insert(periodontalexaminations).values({
      id,
      parentId,
      ...values,
      deleted: 0,
      createdBy: session.id,
      dateEntered: now,
    });
  }

  revalidatePath(`/casesheets/${parentId}`);
  return null;
}
