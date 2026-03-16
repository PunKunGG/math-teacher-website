import { NextResponse } from "next/server";
import {
  getAdminCookieName,
  shouldUseSecureAdminCookie,
} from "@/lib/auth/admin-session";

export async function POST(request: Request) {
  const response = NextResponse.json({
    success: true,
    message: "ออกจากระบบเรียบร้อยแล้ว",
  });

  response.cookies.set({
    name: getAdminCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureAdminCookie(request),
    path: "/",
    maxAge: 0,
  });

  return response;
}
