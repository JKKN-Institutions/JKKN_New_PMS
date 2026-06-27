"use server";

import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getDb } from "@/db";
import { patients } from "@/db/schema";
import { getSession } from "@/lib/auth";

async function genPatNumber(): Promise<number> {
  const db = getDb();
  const today = new Date();
  const prefix = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
  const [{ cnt }] = await db
    .select({ cnt: sql<number>`COUNT(*)` })
    .from(patients)
    .where(sql`DATE(date_entered) = CURDATE() AND deleted = 0`);
  return Number(`${prefix}${String(Number(cnt) + 1).padStart(3, "0")}`);
}

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

export async function createPatientAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const firstName = pick(formData, "first_name");
  if (!firstName) return "First name is required.";
  const phoneMobile = pick(formData, "phone_mobile");
  if (!phoneMobile) return "Mobile number is required.";

  const db = getDb();
  const id = randomUUID();
  const patNumber = await genPatNumber();
  const now = new Date();

  await db.insert(patients).values({
    id,
    patNumber,
    salutation: pick(formData, "salutation"),
    firstName,
    lastName: pick(formData, "last_name"),
    nameTamil: pick(formData, "name_tamil"),
    sex: pick(formData, "sex"),
    birthdate: pickDate(formData, "birthdate"),
    bloodGrp: pick(formData, "blood_grp"),
    fatherName: pick(formData, "father_name"),
    phoneMobile,
    phoneHome: pick(formData, "phone_home"),
    phoneWork: pick(formData, "phone_work"),
    emailAddress: pick(formData, "email_address"),
    primaryAddressStreet: pick(formData, "street"),
    primaryAddressPostalcode: pick(formData, "postalcode"),
    patientGroupId: pick(formData, "patient_group_id"),
    patientcategoryId: pick(formData, "patientcategory_id"),
    occupationlistId: pick(formData, "occupationlist_id"),
    vipPatient: formData.get("vip_patient") === "on" ? 1 : 0,
    refralId: pick(formData, "refral_id"),
    insprovIderId: pick(formData, "insprovider_id"),
    membershipType: pick(formData, "membership_type"),
    membershipExpiryDate: pickDate(formData, "membership_expiry_date"),
    validTill: pickDate(formData, "valid_till"),
    status: "Active",
    deleted: 0,
    regDate: now,
    createdBy: session.id,
    assignedUserId: session.id,
    modifiedUserId: session.id,
    dateEntered: now,
    dateModified: now,
  });

  redirect(`/patients/${id}`);
}

export async function updatePatientAction(
  id: string,
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const firstName = pick(formData, "first_name");
  if (!firstName) return "First name is required.";

  const db = getDb();

  await db
    .update(patients)
    .set({
      salutation: pick(formData, "salutation"),
      firstName,
      lastName: pick(formData, "last_name"),
      nameTamil: pick(formData, "name_tamil"),
      sex: pick(formData, "sex"),
      birthdate: pickDate(formData, "birthdate"),
      bloodGrp: pick(formData, "blood_grp"),
      fatherName: pick(formData, "father_name"),
      phoneMobile: pick(formData, "phone_mobile"),
      phoneHome: pick(formData, "phone_home"),
      phoneWork: pick(formData, "phone_work"),
      emailAddress: pick(formData, "email_address"),
      primaryAddressStreet: pick(formData, "street"),
      primaryAddressPostalcode: pick(formData, "postalcode"),
      patientGroupId: pick(formData, "patient_group_id"),
      patientcategoryId: pick(formData, "patientcategory_id"),
      occupationlistId: pick(formData, "occupationlist_id"),
      vipPatient: formData.get("vip_patient") === "on" ? 1 : 0,
      refralId: pick(formData, "refral_id"),
      insprovIderId: pick(formData, "insprovider_id"),
      membershipType: pick(formData, "membership_type"),
      membershipExpiryDate: pickDate(formData, "membership_expiry_date"),
      validTill: pickDate(formData, "valid_till"),
      modifiedUserId: session.id,
      dateModified: new Date(),
    })
    .where(and(eq(patients.id, id), eq(patients.deleted, 0)));

  redirect(`/patients/${id}`);
}

export async function togglePatientStatusAction(
  id: string,
  currentStatus: string
): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

  await db
    .update(patients)
    .set({ status: newStatus, modifiedUserId: session.id, dateModified: new Date() })
    .where(and(eq(patients.id, id), eq(patients.deleted, 0)));

  revalidatePath(`/patients/${id}`);
}

export async function deletePatientAction(id: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  const db = getDb();
  await db
    .update(patients)
    .set({ deleted: 1, modifiedUserId: session.id, dateModified: new Date() })
    .where(eq(patients.id, id));

  redirect("/patients");
}
