import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionFor(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "bin";
}

function uploadDir() {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files").filter((item): item is File => item instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  await mkdir(uploadDir(), { recursive: true });

  const uploaded = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File is too large: ${file.name}` }, { status: 400 });
    }

    const filename = `${randomUUID()}.${extensionFor(file.type)}`;
    const filepath = path.join(uploadDir(), filename);
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, bytes);

    uploaded.push({
      name: file.name,
      size: file.size,
      type: file.type,
      url: `/uploads/${filename}`,
    });
  }

  return NextResponse.json({ files: uploaded }, { status: 201 });
}
