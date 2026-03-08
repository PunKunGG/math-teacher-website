import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  getAdminCookieName,
  getCookieValueFromHeader,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-session";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { createAnnouncementInSupabase } from "@/lib/supabase/announcements";
import type { AnnouncementItem } from "@/lib/types";

type AnnouncementPayload = {
  title?: unknown;
  audience?: unknown;
  detail?: unknown;
  category?: unknown;
  priority?: unknown;
  isPinned?: unknown;
  publishAt?: unknown;
  expireAt?: unknown;
};

const categories: AnnouncementItem["category"][] = [
  "การบ้าน",
  "สอบ",
  "กิจกรรม",
  "ทั่วไป",
];
const priorities: AnnouncementItem["priority"][] = ["สูง", "กลาง", "ทั่วไป"];

function isNonEmptyString(value: unknown): value is string {
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

  const body = (await request.json()) as AnnouncementPayload;

  if (
    !isNonEmptyString(body.title) ||
    !isNonEmptyString(body.audience) ||
    !isNonEmptyString(body.detail) ||
    !isNonEmptyString(body.publishAt)
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "กรุณากรอกข้อมูลประกาศให้ครบถ้วน",
      },
      { status: 400 },
    );
  }

  if (!categories.includes(body.category as AnnouncementItem["category"])) {
    return NextResponse.json(
      {
        success: false,
        message: "ประเภทประกาศไม่ถูกต้อง",
      },
      { status: 400 },
    );
  }

  if (!priorities.includes(body.priority as AnnouncementItem["priority"])) {
    return NextResponse.json(
      {
        success: false,
        message: "ระดับความสำคัญไม่ถูกต้อง",
      },
      { status: 400 },
    );
  }

  if (typeof body.isPinned !== "boolean") {
    return NextResponse.json(
      {
        success: false,
        message: "ข้อมูลการปักหมุดไม่ถูกต้อง",
      },
      { status: 400 },
    );
  }

  const publishAtDate = new Date(body.publishAt);
  if (Number.isNaN(publishAtDate.getTime())) {
    return NextResponse.json(
      {
        success: false,
        message: "วันที่เริ่มแสดงประกาศไม่ถูกต้อง",
      },
      { status: 400 },
    );
  }

  let expireAt: string | undefined;
  if (isNonEmptyString(body.expireAt)) {
    const expireAtDate = new Date(body.expireAt);
    if (Number.isNaN(expireAtDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "วันที่หมดอายุประกาศไม่ถูกต้อง",
        },
        { status: 400 },
      );
    }

    if (expireAtDate <= publishAtDate) {
      return NextResponse.json(
        {
          success: false,
          message: "วันที่หมดอายุต้องมากกว่าวันที่เริ่มแสดง",
        },
        { status: 400 },
      );
    }

    expireAt = expireAtDate.toISOString();
  }

  try {
    const announcement = await createAnnouncementInSupabase({
      title: body.title.trim(),
      audience: body.audience.trim(),
      detail: body.detail.trim(),
      category: body.category as AnnouncementItem["category"],
      priority: body.priority as AnnouncementItem["priority"],
      isPinned: body.isPinned,
      publishAt: publishAtDate.toISOString(),
      expireAt,
    });

    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      message: "เพิ่มประกาศเรียบร้อยแล้ว",
      announcement,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "เพิ่มประกาศไม่สำเร็จ กรุณาลองใหม่",
      },
      { status: 500 },
    );
  }
}
