"use client";

import { useState } from "react";

type UploadFormState = {
  title: string;
  category: string;
  grade: string;
};

const initialForm: UploadFormState = {
  title: "",
  category: "ใบงาน",
  grade: "ม.3",
};

export default function AdminUploadForm() {
  const [form, setForm] = useState<UploadFormState>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(field: keyof UploadFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim() || !form.category.trim() || !form.grade.trim()) {
      setError("กรุณากรอกข้อมูลเอกสารให้ครบ");
      return;
    }

    if (!file) {
      setError("กรุณาเลือกไฟล์ที่ต้องการอัปโหลด");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("category", form.category.trim());
      payload.append("grade", form.grade.trim());
      payload.append("file", file);

      const response = await fetch("/api/admin/documents", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        setError(result.message ?? "อัปโหลดไม่สำเร็จ");
        return;
      }

      setSuccess(
        "อัปโหลดไฟล์เรียบร้อยแล้ว นักเรียนสามารถเห็นเอกสารได้จากหน้าเอกสาร",
      );
      setForm(initialForm);
      setFile(null);
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบอัปโหลดได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-sm font-medium text-slate-800"
        >
          ชื่อเอกสาร
        </label>
        <input
          id="title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="เช่น ใบงาน ม.3 บทที่ 5"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            หมวดหมู่
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled={isSubmitting}
          >
            <option value="ใบงาน">ใบงาน</option>
            <option value="แบบฝึกหัด">แบบฝึกหัด</option>
            <option value="เอกสารสรุป">เอกสารสรุป</option>
            <option value="ข้อสอบเก่า">ข้อสอบเก่า</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="grade"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            ระดับชั้น
          </label>
          <input
            id="grade"
            value={form.grade}
            onChange={(event) => updateField("grade", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="file"
          className="mb-1 block text-sm font-medium text-slate-800"
        >
          เลือกไฟล์ (ไม่เกิน 10 MB)
        </label>
        <input
          id="file"
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          disabled={isSubmitting}
          accept=".pdf,.doc,.docx,.xlsx,.ppt,.pptx"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md border border-slate-400 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        {isSubmitting ? "กำลังอัปโหลด..." : "อัปโหลดเอกสาร"}
      </button>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
    </form>
  );
}
