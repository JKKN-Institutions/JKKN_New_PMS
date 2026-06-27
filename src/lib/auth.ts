import { createHash } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "orion-pms-fallback-secret"
);
const COOKIE = "orion_session";

export type SessionUser = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  departmentId: string | null;
};

export function md5(value: string) {
  return createHash("md5").update(value).digest("hex");
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(SECRET);

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookie = cookies().get(COOKIE);
  if (!cookie) return null;
  try {
    const { payload } = await jwtVerify(cookie.value, SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  cookies().delete(COOKIE);
}
