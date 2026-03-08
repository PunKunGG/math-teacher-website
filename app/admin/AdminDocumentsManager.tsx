"use client";

import { useState } from "react";
import type { DocumentItem } from "@/lib/types";

type AdminDocumentsManagerProps = {
  initialDocuments: DocumentItem[];
};

export default function AdminDocumentsManager({
  initialDocuments,
}: AdminDocumentsManagerProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [targetDocument, setTargetDocument] = useState<DocumentItem | null>(
    null,
  );
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  function openDeleteConfirm(document: DocumentItem) {
    setTargetDocument(document);
  }

  function closeDeleteConfirm() {
    if (deletingId !== null) {
      return;
    }

    setTargetDocument(null);
  }

  async function confirmDelete() {
    if (!targetDocument) {
      return;
    }

    setDeletingId(targetDocument.id);

    try {
      const response = await fetch(
        `/api/admin/documents/${targetDocument.id}`,
        {
          method: "DELETE",
        },
      );

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        setModalMessage(result.message ?? "ลบเอกสารไม่สำเร็จ");
        return;
      }

      setDocuments((prev) =>
        prev.filter((item) => item.id !== targetDocument.id),
      );
      setModalMessage("ลบเอกสารเรียบร้อยแล้ว");
    } catch {
      setModalMessage("ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่");
    } finally {
      setDeletingId(null);
      setTargetDocument(null);
    }
  }

  return (
    <div className="space-y-3">
      {documents.length === 0 ? (
        <p className="text-sm text-slate-600">ยังไม่มีเอกสารในระบบ</p>
      ) : (
        <ul className="space-y-3">
          {documents.map((document) => (
            <li
              key={document.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-medium text-slate-900">{document.title}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {document.category} | {document.grade} | {document.updatedAt}
                </p>
                {document.lessonId ? (
                  <p className="mt-1 text-xs text-indigo-700">
                    ผูกกับบทเรียนรหัส: {document.lessonId}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => openDeleteConfirm(document)}
                disabled={deletingId === document.id}
                className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
              >
                {deletingId === document.id ? "กำลังลบ..." : "ลบเอกสาร"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {targetDocument ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              ยืนยันการลบเอกสาร
            </h3>
            <p className="mt-2 text-sm text-slate-700">
              ต้องการลบเอกสาร &quot;{targetDocument.title}&quot; ใช่หรือไม่?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={deletingId !== null}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
              >
                {deletingId !== null ? "กำลังลบ..." : "ยืนยันการลบ"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {modalMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-slate-900">แจ้งเตือน</h3>
            <p className="mt-2 text-sm text-slate-700">{modalMessage}</p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setModalMessage(null)}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
