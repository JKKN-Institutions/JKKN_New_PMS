"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getDb } from "@/db";
import { treatments, worksteps, approveworksteps } from "@/db/schema";
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

// ── Treatments ───────────────────────────────────────────────────────────────

export async function createTreatmentAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parentId = pick(formData, "parent_id");
  if (!parentId) return "Parent is required.";

  const treatmentlistId = pick(formData, "treatmentlist_id");
  if (!treatmentlistId) return "Treatment is required.";

  const db = getDb();
  const id = randomUUID();
  const now = new Date();

  const unitsRaw = pick(formData, "units");

  await db.insert(treatments).values({
    id,
    parentId,
    parentType: pick(formData, "parent_type"),
    treatmentlistId,
    toothNo: pick(formData, "tooth_no"),
    treatingDoctor: pick(formData, "treating_doctor"),
    isBillable: formData.get("is_billable") === "off" ? 0 : 1,
    units: unitsRaw ?? undefined,
    treatmentType: pick(formData, "treatment_type"),
    treatmentStartdate: pickDate(formData, "treatment_startdate") ?? undefined,
    treatmentEnddate: pickDate(formData, "treatment_enddate") ?? undefined,
    status: "Planned",
    deleted: 0,
    createdBy: session.id,
    dateEntered: now,
    dateModified: now,
  });

  revalidatePath(`/casesheets/${parentId}`);
  return null;
}

export async function updateTreatmentStatusAction(
  id: string,
  status: string
): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();

  // Fetch parentId for revalidation
  const rows = await db
    .select({ parentId: treatments.parentId })
    .from(treatments)
    .where(eq(treatments.id, id))
    .limit(1);

  await db
    .update(treatments)
    .set({ status, dateModified: new Date() })
    .where(and(eq(treatments.id, id), eq(treatments.deleted, 0)));

  if (rows.length > 0 && rows[0].parentId) {
    revalidatePath(`/casesheets/${rows[0].parentId}`);
  }
}

export async function deleteTreatmentAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();

  const rows = await db
    .select({ parentId: treatments.parentId })
    .from(treatments)
    .where(eq(treatments.id, id))
    .limit(1);

  await db
    .update(treatments)
    .set({ deleted: 1, dateModified: new Date() })
    .where(eq(treatments.id, id));

  if (rows.length > 0 && rows[0].parentId) {
    revalidatePath(`/casesheets/${rows[0].parentId}`);
  }
}

// ── Worksteps ────────────────────────────────────────────────────────────────

export async function createWorkstepAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const treatmentId = pick(formData, "treatment_id");
  if (!treatmentId) return "Treatment is required.";

  const worksteplistId = pick(formData, "worksteplist_id");
  if (!worksteplistId) return "Workstep is required.";

  const db = getDb();
  const id = randomUUID();
  const now = new Date();

  await db.insert(worksteps).values({
    id,
    treatmentId,
    appointmentId: pick(formData, "appointment_id"),
    worksteplistId,
    status: "Pending",
    deleted: 0,
    createdBy: session.id,
    dateEntered: now,
  });

  // Fetch treatment's parentId for revalidation
  const rows = await db
    .select({ parentId: treatments.parentId })
    .from(treatments)
    .where(eq(treatments.id, treatmentId))
    .limit(1);

  if (rows.length > 0 && rows[0].parentId) {
    revalidatePath(`/casesheets/${rows[0].parentId}`);
  }

  return null;
}

export async function approveWorkstepAction(
  workstepId: string,
  approvedById: string
): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  const now = new Date();

  await db
    .update(approveworksteps)
    .set({
      status: "Approved",
      approvedById,
      approvedDate: now,
      dateModified: now,
    })
    .where(
      and(
        eq(approveworksteps.workstepId, workstepId),
        eq(approveworksteps.deleted, 0)
      )
    );

  revalidatePath("/approvals");
}

export async function rejectWorkstepAction(workstepId: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  const now = new Date();

  await db
    .update(approveworksteps)
    .set({
      status: "Rejected",
      dateModified: now,
    })
    .where(
      and(
        eq(approveworksteps.workstepId, workstepId),
        eq(approveworksteps.deleted, 0)
      )
    );

  revalidatePath("/approvals");
}
