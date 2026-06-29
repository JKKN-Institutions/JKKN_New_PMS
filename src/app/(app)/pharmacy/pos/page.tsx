import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { items } from "@/db/schema";
import { PharmacyPOSClient } from "./POSClient";

export default async function PharmacyPOSPage() {
  let stockItems: Array<{
    id: string;
    name: string | null;
    itemCode: string | null;
    measuringUnit: string | null;
  }> = [];

  try {
    const db = getDb();

    stockItems = await db
      .select({
        id: items.id,
        name: items.name,
        itemCode: items.itemCode,
        measuringUnit: items.measuringUnit,
      })
      .from(items)
      .where(eq(items.deleted, 0))
      .orderBy(items.name);
  } catch {
    // DB not configured; POS will show empty item list
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
        Pharmacy POS
      </h1>
      <PharmacyPOSClient items={stockItems} />
    </div>
  );
}
