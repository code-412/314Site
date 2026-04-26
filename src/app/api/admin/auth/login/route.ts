import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  configuredAdminEmail,
  configuredAdminPassword,
  createAdminSession,
} from "@/shared/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "");
  const password = String(body.password ?? "");
  const expectedPassword = configuredAdminPassword();

  if (!expectedPassword || email !== configuredAdminEmail() || password !== expectedPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, user: { email } });
  response.cookies.set(ADMIN_COOKIE, createAdminSession(email), adminCookieOptions());
  return response;
}
