"use server";

import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { md5, createSession, clearSession } from "@/lib/auth";

export async function loginAction(_prev: string | null, formData: FormData) {
  const username = (formData.get("username") as string ?? "").trim();
  const password = (formData.get("password") as string ?? "").trim();

  if (!username || !password) return "Username and password are required.";

  let db;
  try {
    db = getDb();
  } catch {
    return "Database not configured. Contact your administrator.";
  }

  let user;
  try {
    [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.userName, username), eq(users.deleted, 0)))
      .limit(1);
  } catch {
    return "Unable to connect to the database. Please try again later.";
  }

  if (!user) return "Invalid username or password.";
  if (user.status === "Inactive") return "Your account is inactive.";

  const hash = md5(password);
  if (hash !== user.userHash) return "Invalid username or password.";

  await createSession({
    id: user.id,
    userName: user.userName ?? "",
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    isAdmin: user.isAdmin === 1,
    departmentId: user.departmentId ?? null,
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  clearSession();
  redirect("/login");
}
