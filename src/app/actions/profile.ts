"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { getSession, md5 } from "@/lib/auth";

export async function changePasswordAction(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const session = await getSession();
  if (!session) redirect("/login");

  const current = (formData.get("current_password") as string ?? "").trim();
  const next = (formData.get("new_password") as string ?? "").trim();
  const confirm = (formData.get("confirm_password") as string ?? "").trim();

  if (!current || !next || !confirm) return "All fields are required.";
  if (next.length < 6) return "New password must be at least 6 characters.";
  if (next !== confirm) return "New passwords do not match.";

  const db = getDb();
  const [user] = await db
    .select({ id: users.id, userHash: users.userHash })
    .from(users)
    .where(and(eq(users.id, session.id), eq(users.deleted, 0)))
    .limit(1);

  if (!user) return "User not found.";
  if (md5(current) !== user.userHash) return "Current password is incorrect.";

  await db
    .update(users)
    .set({ userHash: md5(next), dateModified: new Date() })
    .where(eq(users.id, session.id));

  revalidatePath("/profile");
  return "success";
}
