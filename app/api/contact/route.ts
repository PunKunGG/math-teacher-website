import { NextResponse } from "next/server";

type ContactPayload = {
  fullName?: unknown;
  classroom?: unknown;
  message?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function validatePayload(payload: ContactPayload) {
  const errors: string[] = [];
  const message = payload.message;

  if (!isNonEmptyString(payload.fullName)) {
    errors.push("fullName is required");
  }

  if (!isNonEmptyString(payload.classroom)) {
    errors.push("classroom is required");
  }

  if (!isNonEmptyString(message)) {
    errors.push("message is required");
  } else if (message.trim().length < 10) {
    errors.push("message must be at least 10 characters");
  }

  return errors;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;
    const errors = validatePayload(body);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "ข้อมูลไม่ถูกต้อง",
          errors,
        },
        { status: 400 },
      );
    }

    // Mock persistence only. Replace this section with Supabase insert in the future.
    return NextResponse.json({
      success: true,
      message: "บันทึกข้อความเรียบร้อยแล้ว",
      data: {
        fullName: body.fullName,
        classroom: body.classroom,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "ไม่สามารถประมวลผลคำขอได้",
      },
      { status: 500 },
    );
  }
}
