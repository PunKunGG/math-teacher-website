import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  getAdminCookieName,
  getCookieValueFromHeader,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-session";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { createLessonInSupabase } from "@/lib/supabase/lessons";
import type { LessonItem } from "@/lib/types";

type LessonPayload = {
  title?: unknown;
  unit?: unknown;
  grade?: unknown;
  summary?: unknown;
  durationMinutes?: unknown;
  difficulty?: unknown;
  examWeight?: unknown;
  isExamFocused?: unknown;
  objectives?: unknown;
  commonMistakes?: unknown;
  practiceSets?: unknown;
};

const difficulties: LessonItem["difficulty"][] = ["พื้นฐาน", "กลาง", "เข้มข้น"];
const examWeights: LessonItem["examWeight"][] = ["สูง", "กลาง", "ต่ำ"];
const levels: LessonItem["practiceSets"][number]["level"][] = [
  "ง่าย",
  "กลาง",
  "ยาก",
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" && item.trim().length > 0)
  );
}

function isPracticeSets(value: unknown): value is LessonItem["practiceSets"] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as { id?: unknown }).id === "number" &&
        isNonEmptyString((item as { title?: unknown }).title) &&
        levels.includes(
          (item as { level?: LessonItem["practiceSets"][number]["level"] })
            .level as LessonItem["practiceSets"][number]["level"],
        ) &&
        typeof (item as { questionCount?: unknown }).questionCount ===
          "number" &&
        (item as { questionCount: number }).questionCount > 0,
    )
  );
}

function validateLessonPayload(body: LessonPayload) {
  if (
    !isNonEmptyString(body.title) ||
    !isNonEmptyString(body.unit) ||
    !isNonEmptyString(body.grade) ||
    !isNonEmptyString(body.summary)
  ) {
    return "กรุณากรอกข้อมูลบทเรียนให้ครบถ้วน";
  }

  if (
    typeof body.durationMinutes !== "number" ||
    !Number.isFinite(body.durationMinutes) ||
    body.durationMinutes <= 0
  ) {
    return "เวลาเรียนต้องเป็นตัวเลขมากกว่า 0";
  }

  if (!difficulties.includes(body.difficulty as LessonItem["difficulty"])) {
    return "ระดับความยากไม่ถูกต้อง";
  }

  if (!examWeights.includes(body.examWeight as LessonItem["examWeight"])) {
    return "น้ำหนักข้อสอบไม่ถูกต้อง";
  }

  if (typeof body.isExamFocused !== "boolean") {
    return "ข้อมูลบทที่เน้นออกสอบไม่ถูกต้อง";
  }

  if (!isStringArray(body.objectives) || body.objectives.length === 0) {
    return "จุดประสงค์การเรียนรู้ต้องมีอย่างน้อย 1 ข้อ";
  }

  if (!isStringArray(body.commonMistakes) || body.commonMistakes.length === 0) {
    return "ข้อควรระวังต้องมีอย่างน้อย 1 ข้อ";
  }

  if (!isPracticeSets(body.practiceSets) || body.practiceSets.length === 0) {
    return "ชุดแบบฝึกหัดต้องมีอย่างน้อย 1 ชุด";
  }

  return null;
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

  const body = (await request.json()) as LessonPayload;
  const validationError = validateLessonPayload(body);

  if (validationError) {
    return NextResponse.json(
      {
        success: false,
        message: validationError,
      },
      { status: 400 },
    );
  }

  try {
    const title = body.title as string;
    const unit = body.unit as string;
    const grade = body.grade as string;
    const summary = body.summary as string;

    const lesson = await createLessonInSupabase({
      title: title.trim(),
      unit: unit.trim(),
      grade: grade.trim(),
      summary: summary.trim(),
      durationMinutes: body.durationMinutes as number,
      difficulty: body.difficulty as LessonItem["difficulty"],
      examWeight: body.examWeight as LessonItem["examWeight"],
      isExamFocused: body.isExamFocused as boolean,
      objectives: (body.objectives as string[])
        .map((item) => item.trim())
        .filter(Boolean),
      commonMistakes: (body.commonMistakes as string[])
        .map((item) => item.trim())
        .filter(Boolean),
      practiceSets: body.practiceSets as LessonItem["practiceSets"],
    });

    revalidatePath("/");
    revalidatePath("/lessons");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      message: "เพิ่มบทเรียนเรียบร้อยแล้ว",
      lesson,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "เพิ่มบทเรียนไม่สำเร็จ กรุณาลองใหม่",
      },
      { status: 500 },
    );
  }
}
