"use server";

import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getDb } from "@/db";
import { labrequests, labreports } from "@/db/schema";
import { getSession } from "@/lib/auth";

function pick(fd: FormData, key: string): string | null {
  const v = (fd.get(key) as string | null)?.trim();
  return v || null;
}

async function genLabNumber(): Promise<number> {
  const db = getDb();
  const [{ cnt }] = await db
    .select({ cnt: sql<number>`COUNT(*)` })
    .from(labrequests)
    .where(sql`deleted = 0`);
  return Number(cnt) + 1;
}

// ── Lab Requests ─────────────────────────────────────────────────────────────

export async function createLabRequestAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const patientId = pick(formData, "patient_id");
  if (!patientId) return "Patient is required.";

  const testId = pick(formData, "test_id");
  if (!testId) return "Test is required.";

  const db = getDb();
  const id = randomUUID();
  const labNumber = await genLabNumber();
  const now = new Date();

  const noOfUnitRaw = pick(formData, "no_of_unit");

  await db.insert(labrequests).values({
    id,
    patientId,
    parentId: pick(formData, "parent_id"),
    parentType: pick(formData, "parent_type"),
    casesheetId: pick(formData, "casesheet_id"),
    testId,
    labsetupgroupId: pick(formData, "labsetupgroup_id"),
    departmentId: pick(formData, "department_id"),
    diagnosis: pick(formData, "diagnosis"),
    noOfUnit: noOfUnitRaw ? parseInt(noOfUnitRaw, 10) : null,
    sampleName: pick(formData, "sample_name"),
    labRequestStatus: "Pending",
    requestDate: now,
    labNumber,
    deleted: 0,
    createdBy: session.id,
    dateEntered: now,
    dateModified: now,
  });

  const casesheetId = pick(formData, "casesheet_id");
  if (casesheetId) revalidatePath(`/casesheets/${casesheetId}`);
  revalidatePath("/lab");
  return null;
}

export async function updateLabStatusAction(
  id: string,
  status: string
): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  const now = new Date();

  const dateFields: Record<string, { sampleDate?: Date; confirmDate?: Date; doneDate?: Date }> = {
    "Sample Collected": { sampleDate: now },
    Confirmed: { confirmDate: now },
    Done: { doneDate: now },
  };

  await db
    .update(labrequests)
    .set({
      labRequestStatus: status,
      ...(dateFields[status] ?? {}),
      dateModified: now,
    })
    .where(and(eq(labrequests.id, id), eq(labrequests.deleted, 0)));

  revalidatePath("/lab");
}

// ── Lab Reports ──────────────────────────────────────────────────────────────

export async function saveLabReportAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const requestId = pick(formData, "request_id");
  if (!requestId) return "Request is required.";

  const db = getDb();
  const now = new Date();

  const existing = await db
    .select({ id: labreports.id })
    .from(labreports)
    .where(
      and(eq(labreports.requestId, requestId), eq(labreports.deleted, 0))
    )
    .limit(1);

  const values = {
    testId: pick(formData, "test_id"),
    patientId: pick(formData, "patient_id"),
    parentId: pick(formData, "parent_id"),
    parentType: pick(formData, "parent_type"),
    departmentId: pick(formData, "department_id"),
    casesheetId: pick(formData, "casesheet_id"),
    reportDate: now,
    reportType: pick(formData, "report_type"),
    reportValue: pick(formData, "report_value"),
    reportCriteria: pick(formData, "report_criteria"),
    dateModified: now,
  };

  if (existing.length > 0) {
    await db
      .update(labreports)
      .set(values)
      .where(eq(labreports.id, existing[0].id));
  } else {
    const id = randomUUID();
    await db.insert(labreports).values({
      id,
      requestId,
      ...values,
      status: "Draft",
      deleted: 0,
      createdBy: session.id,
      dateEntered: now,
    });
  }

  revalidatePath("/lab");
  return null;
}
