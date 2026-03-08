import { NextResponse } from "next/server";
import { getAdminCookieName } from "@/lib/auth/admin-session";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "ออกจากระบบเรียบร้อยแล้ว",
  });

  response.cookies.set({
    name: getAdminCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
