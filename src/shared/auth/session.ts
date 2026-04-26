import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "code412_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  email: string;
  exp: number;
};

function base64url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET;
  if (value) return value;

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be configured in production.");
  }

  return "dev-only-change-me";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createAdminSession(email: string) {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifyAdminSession(token: string | undefined) {
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || !safeEqual(sign(encoded), signature)) return null;

  try {
    const payload = JSON.parse(fromBase64url(encoded)) as SessionPayload;
    if (!payload.email || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function configuredAdminEmail() {
  return process.env.ADMIN_EMAIL || "admin@code412.local";
}

export function configuredAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? "" : "admin";
}
