"use client";

import { useMemo, useState } from "react";
import type { AnnouncementItem } from "@/lib/types";

type NewsBoardProps = {
  announcements: AnnouncementItem[];
};

const categoryOptions: Array<"all" | AnnouncementItem["category"]> = [
  "all",
  "การบ้าน",
  "สอบ",
  "กิจกรรม",
  "ทั่วไป",
];

function getPriorityClass(priority: AnnouncementItem["priority"]) {
  if (priority === "สูง") {
    return "bg-red-100 text-red-700 border-red-200";
  }

  if (priority === "กลาง") {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }

  return "bg-slate-100 text-slate-700 border-slate-200";
}

export default function NewsBoard({ announcements }: NewsBoardProps) {
  const [category, setCategory] =
    useState<(typeof categoryOptions)[number]>("all");

  const filteredAnnouncements = useMemo(() => {
    if (category === "all") {
      return announcements;
    }

    return announcements.filter((item) => item.category === category);
  }, [announcements, category]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categoryOptions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              category === item
                ? "border-slate-700 bg-slate-700 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {item === "all" ? "ทั้งหมด" : item}
          </button>
        ))}
      </div>

      {filteredAnnouncements.length === 0 ? (
        <p className="text-sm text-slate-600">ไม่พบประกาศในหมวดที่เลือก</p>
      ) : (
        <ul className="space-y-3">
          {filteredAnnouncements.map((item) => (
            <li
              key={item.id}
              className="rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {item.isPinned ? (
                  <span className="rounded border border-blue-200 bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    ปักหมุด
                  </span>
                ) : null}
                <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                  {item.category}
                </span>
                <span
                  className={`rounded border px-2 py-0.5 text-xs font-medium ${getPriorityClass(item.priority)}`}
                >
                  ความสำคัญ: {item.priority}
                </span>
              </div>

              <p className="font-medium text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-slate-700">{item.detail}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.date} | กลุ่มเป้าหมาย: {item.audience}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
