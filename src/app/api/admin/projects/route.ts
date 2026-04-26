import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { createProject, listProjects } from "@/shared/server/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 400 });
  }

  if (
    error instanceof Error &&
    "code" in error &&
    error.code === "SQLITE_CONSTRAINT_UNIQUE"
  ) {
    return NextResponse.json({ error: "Project slug already exists" }, { status: 409 });
  }

  return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
}

export async function GET() {
  try {
    return NextResponse.json({ projects: listProjects() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = createProject(body);
    revalidatePath("/admin");
    revalidatePath("/admin/projects");
    revalidatePath("/");
    revalidatePath("/works");
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
