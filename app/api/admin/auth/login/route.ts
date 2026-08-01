import { NextRequest, NextResponse } from "next/server";
import { adminCookieOptions, ADMIN_COOKIE_NAME, createAdminSession, isCmsConfigured, passwordMatches } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!isCmsConfigured()) {
    return NextResponse.json({ error: "Falta configurar CMS_ADMIN_PASSWORD y CMS_SESSION_SECRET." }, { status: 503 });
  }
  if (!passwordMatches(password)) return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, createAdminSession(), adminCookieOptions);
  return response;
}
