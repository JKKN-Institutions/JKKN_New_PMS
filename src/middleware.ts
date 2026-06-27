import { NextRequest, NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "orion-pms-fallback-secret"
);

const PUBLIC_PATHS = ["/login"];

// Minimal HS256 JWT verifier using Web Crypto API (Edge Runtime safe — no jose import).
async function verifyToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      SECRET,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const b64 = (s: string) =>
      Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
        c.charCodeAt(0)
      );

    const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const sig = b64(parts[2]);
    const valid = await crypto.subtle.verify("HMAC", key, sig, data);
    if (!valid) return false;

    const payload = JSON.parse(
      new TextDecoder().decode(b64(parts[1]))
    ) as { exp?: number };
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const token = request.cookies.get("orion_session")?.value;

  if (!token) {
    if (isPublic) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const valid = await verifyToken(token);
  if (valid) {
    if (isPublic) return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("orion_session");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
