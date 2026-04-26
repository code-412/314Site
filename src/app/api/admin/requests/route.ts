import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createRequest, listRequests } from "@/shared/server/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 400 });
  }

  return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
}

export async function GET() {
  try {
    return NextResponse.json({ requests: listRequests() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const contactRequest = createRequest(body);
    return NextResponse.json({ request: contactRequest }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
