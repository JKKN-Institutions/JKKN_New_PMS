import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getDb } from "@/db";
import { patientimages } from "@/db/schema";
import { getSession } from "@/lib/auth";

const ALLOWED_EXT = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "pdf"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const photographType = (formData.get("photograph_type") as string) || "Other";

  if (!file || file.size === 0)
    return Response.json({ error: "No file provided" }, { status: 400 });

  if (file.size > MAX_SIZE)
    return Response.json({ error: "File exceeds 10 MB limit" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.includes(ext))
    return Response.json({ error: `File type .${ext} not allowed` }, { status: 400 });

  const fileName = `${randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "patientimages");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()));

  const db = getDb();
  await db.insert(patientimages).values({
    id: randomUUID(),
    patientId: params.id,
    name: file.name,
    fileName,
    fileExtension: ext,
    photographType,
    dateUpload: new Date(),
    deleted: 0,
    dateEntered: new Date(),
  });

  return Response.json({ success: true, fileName });
}
