"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LessonItem } from "@/lib/types";

type LessonsBoardProps = {
  lessons: LessonItem[];
};

type UnitFilter = "all" | LessonItem["unit"];
type ExamFilter = "all" | LessonItem["examWeight"];

function getDifficultyClass(level: LessonItem["difficulty"]) {
  if (level === "เข้มข้น") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (level === "กลาง") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function getExamWeightClass(weight: LessonItem["examWeight"]) {
  if (weight === "สูง") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (weight === "กลาง") {
    return "border-indigo-200 bg-indigo-50 text-indigo-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

export default function LessonsBoard({ lessons }: LessonsBoardProps) {
  const [unitFilter, setUnitFilter] = useState<UnitFilter>("all");
  const [examFilter, setExamFilter] = useState<ExamFilter>("all");
  const [showExamFocusedOnly, setShowExamFocusedOnly] = useState(false);

  const unitOptions = useMemo(() => {
    const units = new Set<LessonItem["unit"]>();
    lessons.forEach((lesson) => units.add(lesson.unit));
    return ["all", ...Array.from(units)] as UnitFilter[];
  }, [lessons]);

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      if (unitFilter !== "all" && lesson.unit !== unitFilter) {
        return false;
      }

      if (examFilter !== "all" && lesson.examWeight !== examFilter) {
        return false;
      }

      if (showExamFocusedOnly && !lesson.isExamFocused) {
        return false;
      }

      return true;
    });
  }, [lessons, unitFilter, examFilter, showExamFocusedOnly]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-3">
        <label className="space-y-1 text-sm text-slate-700">
          <span className="block font-medium">หน่วยการเรียน</span>
          <select
            value={unitFilter}
            onChange={(event) =>
              setUnitFilter(event.target.value as UnitFilter)
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          >
            {unitOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "ทั้งหมด" : option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm text-slate-700">
          <span className="block font-medium">น้ำหนักข้อสอบ</span>
          <select
            value={examFilter}
            onChange={(event) =>
              setExamFilter(event.target.value as ExamFilter)
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="all">ทั้งหมด</option>
            <option value="สูง">สูง</option>
            <option value="กลาง">กลาง</option>
            <option value="ต่ำ">ต่ำ</option>
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 md:mt-6">
          <input
            type="checkbox"
            checked={showExamFocusedOnly}
            onChange={(event) => setShowExamFocusedOnly(event.target.checked)}
          />
          แสดงเฉพาะบทที่เน้นออกสอบ
        </label>
      </div>

      {filteredLessons.length === 0 ? (
        <p className="text-sm text-slate-600">
          ไม่พบบทเรียนตามเงื่อนไขที่เลือก
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {filteredLessons.map((lesson) => (
            <li
              key={lesson.id}
              className="rounded-lg border border-slate-200 bg-white p-5"
            >
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700">
                  {lesson.unit}
                </span>
                <span
                  className={`rounded border px-2 py-1 text-xs ${getDifficultyClass(lesson.difficulty)}`}
                >
                  ระดับ: {lesson.difficulty}
                </span>
                <span
                  className={`rounded border px-2 py-1 text-xs ${getExamWeightClass(lesson.examWeight)}`}
                >
                  น้ำหนักสอบ: {lesson.examWeight}
                </span>
                {lesson.isExamFocused ? (
                  <span className="rounded border border-blue-200 bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    ออกสอบบ่อย
                  </span>
                ) : null}
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                {lesson.title}
              </h3>
              <p className="mt-2 text-sm text-slate-700">{lesson.summary}</p>

              <p className="mt-3 text-xs text-slate-600">
                เวลาแนะนำ {lesson.duration} | อัปเดต {lesson.updatedAt}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/lessons/${lesson.id}`}
                  className="rounded-md border border-slate-700 bg-slate-700 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                >
                  เริ่มเรียน
                </Link>
                <Link
                  href="/documents"
                  className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  ดูเอกสารประกอบ
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
