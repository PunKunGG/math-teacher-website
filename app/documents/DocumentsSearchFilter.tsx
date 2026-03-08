"use client";

import { useMemo, useState } from "react";
import ContentList from "@/app/components/ContentList";
import type { DocumentItem } from "@/lib/types";

type DocumentsSearchFilterProps = {
  documents: DocumentItem[];
};

export default function DocumentsSearchFilter({
  documents,
}: DocumentsSearchFilterProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const unique = new Set(documents.map((document) => document.category));
    return ["all", ...Array.from(unique)];
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesCategory =
        category === "all" || document.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        document.title.toLowerCase().includes(normalizedQuery) ||
        document.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [documents, query, category]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="document-search"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            ค้นหาเอกสาร
          </label>
          <input
            id="document-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาจากชื่อเอกสารหรือหมวดหมู่"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="document-category"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            กรองตามหมวดหมู่
          </label>
          <select
            id="document-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "ทั้งหมด" : item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        พบเอกสาร {filteredDocuments.length} รายการ
      </p>

      <ContentList
        items={filteredDocuments.map((document) => ({
          id: document.id,
          title: document.title,
          detail: `หมวดหมู่: ${document.category}${
            document.lessonId ? ` | บทเรียนรหัส ${document.lessonId}` : ""
          }`,
          meta: `ระดับชั้น: ${document.grade} | อัปเดตล่าสุด: ${document.updatedAt} | รูปแบบไฟล์: ${document.fileType}`,
          href: document.fileUrl,
        }))}
        emptyText="ไม่พบเอกสารที่ตรงกับคำค้นหา"
      />
    </div>
  );
}
