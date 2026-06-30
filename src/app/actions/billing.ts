"use server";

import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getDb } from "@/db";
import { billings, payments, paysummarys } from "@/db/schema";
import { getSession } from "@/lib/auth";

function pick(fd: FormData, key: string): string | null {
  const v = (fd.get(key) as string | null)?.trim();
  return v || null;
}

async function genPayNumber(): Promise<number> {
  const db = getDb();
  const [{ cnt }] = await db
    .select({ cnt: sql<number>`COUNT(*)` })
    .from(billings)
    .where(sql`deleted = 0`);
  return Number(cnt) + 1;
}

async function genPaysummaryNumber(): Promise<number> {
  const db = getDb();
  const [{ cnt }] = await db
    .select({ cnt: sql<number>`COUNT(*)` })
    .from(paysummarys)
    .where(sql`deleted = 0`);
  return Number(cnt) + 1;
}

// ── Billing ──────────────────────────────────────────────────────────────────

export async function createBillingAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const patientId = pick(formData, "patient_id");
  if (!patientId) return "Patient is required.";

  const db = getDb();
  const billingId = randomUUID();
  const paysummaryId = randomUUID();
  const now = new Date();

  const totalAmountRaw = pick(formData, "total_amount");
  const discountRaw = pick(formData, "discount");
  const finalAmountRaw = pick(formData, "final_amount");

  const totalAmount = totalAmountRaw ? parseFloat(totalAmountRaw) : 0;
  const discount = discountRaw ? parseFloat(discountRaw) : 0;
  const finalAmount = finalAmountRaw ? parseFloat(finalAmountRaw) : totalAmount - discount;

  const billParentId = pick(formData, "bill_parent_id");
  const parentType = pick(formData, "parent_type") ?? "casesheets";

  const [payNumber, paysummaryNumber] = await Promise.all([
    genPayNumber(),
    genPaysummaryNumber(),
  ]);

  // Create paysummary first
  await db.insert(paysummarys).values({
    id: paysummaryId,
    patientId,
    parentId: billParentId,
    parentType,
    paysummaryNumber,
    paysummaryDate: now,
    deleted: 0,
    dateEntered: now,
    dateModified: now,
  });

  // Create billing
  await db.insert(billings).values({
    id: billingId,
    payNumber,
    patientId,
    totalAmount,
    discount,
    finalAmount,
    paymentStatus: "Unpaid",
    billParentId,
    billParentType: pick(formData, "bill_parent_type") ?? parentType,
    paysummaryId,
    departmentId: pick(formData, "department_id"),
    deleted: 0,
    createdBy: session.id,
    dateEntered: now,
    dateModified: now,
  });

  if (billParentId) revalidatePath(`/casesheets/${billParentId}`);
  revalidatePath("/billing");
  return null;
}

// ── Payments ─────────────────────────────────────────────────────────────────

export async function recordPaymentAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const billParentId = pick(formData, "bill_parent_id");
  const paysummaryId = pick(formData, "paysummary_id");
  const amountRaw = pick(formData, "amount");

  if (!amountRaw) return "Amount is required.";

  const db = getDb();
  const id = randomUUID();
  const now = new Date();
  const chequeDateRaw = pick(formData, "cheque_date");
  const chequeDate = chequeDateRaw ? new Date(chequeDateRaw) : null;

  await db.insert(payments).values({
    id,
    billParentId,
    paysummaryId,
    amount: parseFloat(amountRaw),
    paymentMode: pick(formData, "payment_mode"),
    chequeNo: pick(formData, "cheque_no"),
    chequeDate: chequeDate && !isNaN(chequeDate.getTime()) ? chequeDate : null,
    deleted: 0,
    createdBy: session.id,
    dateEntered: now,
  });

  // Check total payments vs final amount and mark as Paid if fully settled
  if (billParentId) {
    const billingRows = await db
      .select({
        id: billings.id,
        finalAmount: billings.finalAmount,
        paysummaryId: billings.paysummaryId,
      })
      .from(billings)
      .where(
        and(eq(billings.billParentId, billParentId), eq(billings.deleted, 0))
      )
      .limit(1);

    if (billingRows.length > 0) {
      const billing = billingRows[0];

      const [{ total }] = await db
        .select({ total: sql<number>`COALESCE(SUM(amount), 0)` })
        .from(payments)
        .where(
          and(
            eq(payments.billParentId, billParentId),
            eq(payments.deleted, 0)
          )
        );

      const finalAmt = billing.finalAmount ?? 0;
      if (Number(total) >= finalAmt) {
        await db
          .update(billings)
          .set({
            paymentStatus: "Paid",
            paymentDate: now,
            dateModified: now,
          })
          .where(eq(billings.id, billing.id));
      }
    }

    revalidatePath(`/casesheets/${billParentId}`);
  }

  revalidatePath("/billing");
  return null;
}
