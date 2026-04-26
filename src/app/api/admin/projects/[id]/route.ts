import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { deleteProject, getProject, updateProject } from "@/shared/server/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ id: string }>;
};

function errorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", issues: error.issues }, { status: 400 });
  }

  if (
    error instanceof Error &&
    "code" in error &&
    (error.code === "SQLITE_CONSTRAINT_UNIQUE" || error.code === "23505")
  ) {
    return NextResponse.json({ error: "Project slug already exists" }, { status: 409 });
  }

  return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
}

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/works");

  if (slug) {
    revalidatePath(`/works/${slug}`);
  }
}

export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const project = await getProject(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const previous = await getProject(id);
    const project = await updateProject(id, body);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    revalidateProjectPaths(previous?.slug);
    revalidateProjectPaths(project.slug);
    revalidatePath(`/admin/projects/${project.id}/preview`);
    return NextResponse.json({ project });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const previous = await getProject(id);
    const deleted = await deleteProject(id);

    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    revalidateProjectPaths(previous?.slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
