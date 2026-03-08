import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  getAdminCookieName,
  getCookieValueFromHeader,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-session";
import { deleteDocumentFromSupabase } from "@/lib/supabase/documents";
import { hasSupabaseConfig } from "@/lib/supabase/env";

type DeleteParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, { params }: DeleteParams) {
  const cookieHeader = request.headers.get("cookie");
  const session = getCookieValueFromHeader(cookieHeader, getAdminCookieName());

  if (!verifyAdminSessionToken(session)) {
    return NextResponse.json(
      {
        success: false,
        message: "ไม่มีสิทธิ์ใช้งาน",
      },
      { status: 401 },
    );
  }

  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      {
        success: false,
        message: "ยังไม่ได้ตั้งค่า Supabase environment variables",
      },
      { status: 500 },
    );
  }

  const { id } = await params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return NextResponse.json(
      {
        success: false,
        message: "รหัสเอกสารไม่ถูกต้อง",
      },
      { status: 400 },
    );
  }

  try {
    await deleteDocumentFromSupabase(numericId);

    revalidatePath("/documents");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      message: "ลบเอกสารเรียบร้อยแล้ว",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "ไม่สามารถลบเอกสารได้ กรุณาลองใหม่",
      },
      { status: 500 },
    );
  }
}
