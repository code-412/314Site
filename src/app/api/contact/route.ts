import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { createRequest } from "@/shared/server/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const contactRequest = createRequest(body);
    revalidatePath("/admin");
    revalidatePath("/admin/requests");
    return NextResponse.json({ request: contactRequest }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
