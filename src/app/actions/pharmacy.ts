"use server";

import { sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { getDb } from "@/db";
import { pharmasales, pharmasaleitems } from "@/db/schema";
import { getSession } from "@/lib/auth";

function pick(fd: FormData, key: string): string | null {
  const v = (fd.get(key) as string | null)?.trim();
  return v || null;
}

async function genPharmasaleNumber(): Promise<number> {
  const db = getDb();
  const [{ cnt }] = await db
    .select({ cnt: sql<number>`COUNT(*)` })
    .from(pharmasales)
    .where(sql`deleted = 0`);
  return Number(cnt) + 1;
}

interface SaleItem {
  itemId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  expiryDate?: string;
}

export async function createPharmaSaleAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const patientId = pick(formData, "patient_id");
  if (!patientId) return "Patient is required.";

  const itemsRaw = pick(formData, "items");
  if (!itemsRaw) return "Items are required.";

  let saleItems: SaleItem[];
  try {
    saleItems = JSON.parse(itemsRaw) as SaleItem[];
  } catch {
    return "Invalid items format.";
  }

  if (!saleItems || saleItems.length === 0) return "At least one item is required.";

  const db = getDb();
  const pharmasaleId = randomUUID();
  const pharmasaleNumber = await genPharmasaleNumber();
  const now = new Date();

  // Calculate totals
  let pharmasaleAmount = 0;
  for (const item of saleItems) {
    pharmasaleAmount += (item.quantity ?? 0) * (item.unitPrice ?? 0);
  }

  const discountRaw = pick(formData, "discount");
  const discount = discountRaw ? parseFloat(discountRaw) : 0;
  const finalAmount = pharmasaleAmount - discount;

  await db.insert(pharmasales).values({
    id: pharmasaleId,
    patientId,
    departmentId: pick(formData, "department_id"),
    pharmasaleNumber,
    pharmasaleDate: now,
    pharmasaleStatus: "Completed",
    pharmasaleAmount,
    discount,
    finalAmount,
    deleted: 0,
    createdBy: session.id,
    dateEntered: now,
    dateModified: now,
  });

  // Insert pharmasaleitems
  for (const item of saleItems) {
    const itemId = randomUUID();
    const lineTotal = (item.quantity ?? 0) * (item.unitPrice ?? 0) - (item.discount ?? 0);
    const expiryDate = item.expiryDate ? new Date(item.expiryDate) : null;

    await db.insert(pharmasaleitems).values({
      id: itemId,
      pharmasaleId,
      itemId: item.itemId,
      quantity: item.quantity ?? 0,
      pharmasaleValue: item.unitPrice ?? 0,
      pharmasaleMrp: item.unitPrice ?? 0,
      lineTotal,
      discount: item.discount ?? 0,
      tax: item.tax ?? 0,
      expiryDate: expiryDate && !isNaN(expiryDate.getTime()) ? expiryDate : null,
      deleted: 0,
      dateEntered: now,
    });
  }

  revalidatePath("/pharmacy/pos");
  return null;
}
