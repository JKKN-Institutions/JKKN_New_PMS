"use server";

import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getDb } from "@/db";
import { appointments } from "@/db/schema";
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

async function genAppNumber(): Promise<number> {
  const db = getDb();
  const [{ cnt }] = await db
    .select({ cnt: sql<number>`COUNT(*)` })
    .from(appointments)
    .where(sql`deleted = 0`);
  return Number(cnt) + 1;
}

export async function createAppointmentAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parentId = pick(formData, "parent_id");
  if (!parentId) return "Patient is required.";

  const dateStart = pickDate(formData, "date_start");
  if (!dateStart) return "Start date is required.";

  const db = getDb();
  const id = randomUUID();
  const appNumber = await genAppNumber();
  const now = new Date();

  await db.insert(appointments).values({
    id,
    appNumber,
    parentId,
    parentType: pick(formData, "parent_type") ?? "patients",
    departmentId: pick(formData, "department_id"),
    dateStart,
    dateEnd: pickDate(formData, "date_end"),
    status: pick(formData, "status") ?? "Scheduled",
    isEmergency: formData.get("is_emergency") === "on" ? 1 : 0,
    isNew: formData.get("is_new") === "on" ? 1 : 0,
    staffId: pick(formData, "staff_id"),
    reasonVisit: pick(formData, "reason_visit"),
    tokenNo: pick(formData, "token_no"),
    deleted: 0,
    createdBy: session.id,
    modifiedUserId: session.id,
    dateEntered: now,
    dateModified: now,
  });

  redirect(`/patients/${parentId}`);
}

export async function updateAppointmentStatusAction(
  id: string,
  status: string,
  patientId: string
): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(appointments)
    .set({
      status,
      modifiedUserId: session.id,
      dateModified: new Date(),
    })
    .where(and(eq(appointments.id, id), eq(appointments.deleted, 0)));

  revalidatePath(`/patients/${patientId}`);
}
