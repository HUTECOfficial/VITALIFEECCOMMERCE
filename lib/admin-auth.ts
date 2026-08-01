import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "vital_life_admin";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function sessionSecret() {
  return process.env.CMS_SESSION_SECRET || process.env.CMS_ADMIN_PASSWORD || "";
}

function signature(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function isCmsConfigured() {
  return Boolean(process.env.CMS_ADMIN_PASSWORD && sessionSecret());
}

export function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${signature(payload)}`;
}

export function isValidAdminSession(value?: string) {
  if (!value || !sessionSecret()) return false;
  const [role, expiresAt, providedSignature] = value.split(".");
  if (role !== "admin" || !expiresAt || !providedSignature || Number(expiresAt) < Date.now() / 1000) return false;

  const expected = signature(`${role}.${expiresAt}`);
  const provided = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expected);
  return provided.length === expectedBuffer.length && timingSafeEqual(provided, expectedBuffer);
}

export function passwordMatches(password: string) {
  const configuredPassword = process.env.CMS_ADMIN_PASSWORD;
  if (!configuredPassword) return false;
  const incoming = Buffer.from(password);
  const expected = Buffer.from(configuredPassword);
  return incoming.length === expected.length && timingSafeEqual(incoming, expected);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return isValidAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export function isAdminRequest(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};
