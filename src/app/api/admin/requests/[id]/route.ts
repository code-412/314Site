import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { deleteRequest, updateRequestStatus } from "@/shared/server/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

function errorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 400 });
  }

  return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
}

export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const contactRequest = updateRequestStatus(id, body);

    if (!contactRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/requests");
    return NextResponse.json({ request: contactRequest });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const deleted = deleteRequest(id);

    if (!deleted) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/requests");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
