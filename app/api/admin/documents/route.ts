import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { uploadDocumentToSupabase } from "@/lib/supabase/documents";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import {
  getAdminCookieName,
  getCookieValueFromHeader,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-session";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB for Vercel body-size compatibility

function isNonEmpty(value: FormDataEntryValue | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
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

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const category = formData.get("category");
    const grade = formData.get("grade");
    const lessonIdValue = formData.get("lessonId");
    const file = formData.get("file");

    if (!isNonEmpty(title) || !isNonEmpty(category) || !isNonEmpty(grade)) {
      return NextResponse.json(
        {
          success: false,
          message: "กรุณากรอกข้อมูลให้ครบถ้วน",
        },
        { status: 400 },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "กรุณาเลือกไฟล์ที่ต้องการอัปโหลด",
        },
        { status: 400 },
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "ขนาดไฟล์ต้องไม่เกิน 4 MB",
        },
        { status: 400 },
      );
    }

    let lessonId: number | undefined;
    if (isNonEmpty(lessonIdValue)) {
      const parsedLessonId = Number(lessonIdValue);
      if (!Number.isInteger(parsedLessonId) || parsedLessonId <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "รหัสบทเรียนที่แนบมากับเอกสารไม่ถูกต้อง",
          },
          { status: 400 },
        );
      }

      lessonId = parsedLessonId;
    }

    const document = await uploadDocumentToSupabase({
      title,
      category,
      grade,
      lessonId,
      file,
    });

    revalidatePath("/documents");
    if (lessonId) {
      revalidatePath(`/lessons/${lessonId}`);
    }
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      message: "อัปโหลดเอกสารเรียบร้อยแล้ว",
      document,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "อัปโหลดเอกสารไม่สำเร็จ กรุณาลองใหม่",
      },
      { status: 500 },
    );
  }
}
