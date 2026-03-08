import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminSessionMaxAgeSeconds,
  isAdminAuthConfigured,
  validateAdminPassword,
} from "@/lib/auth/admin-session";

type LoginPayload = {
  password?: unknown;
};

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      {
        success: false,
        message: "ระบบล็อกอินแอดมินยังไม่ถูกตั้งค่า",
      },
      { status: 500 },
    );
  }

  const body = (await request.json()) as LoginPayload;
  const password = typeof body.password === "string" ? body.password : "";

  if (!validateAdminPassword(password)) {
    return NextResponse.json(
      {
        success: false,
        message: "รหัสผ่านไม่ถูกต้อง",
      },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "เข้าสู่ระบบสำเร็จ",
  });

  response.cookies.set({
    name: getAdminCookieName(),
    value: createAdminSessionToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getAdminSessionMaxAgeSeconds(),
  });

  return response;
}
