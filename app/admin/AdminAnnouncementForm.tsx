"use client";

import { useState } from "react";
import type { AnnouncementItem } from "@/lib/types";

type FormState = {
  title: string;
  audience: string;
  detail: string;
  category: AnnouncementItem["category"];
  priority: AnnouncementItem["priority"];
  isPinned: boolean;
  publishAt: string;
  expireAt: string;
};

const initialFormState: FormState = {
  title: "",
  audience: "นักเรียน ม.3",
  detail: "",
  category: "ทั่วไป",
  priority: "ทั่วไป",
  isPinned: false,
  publishAt: "",
  expireAt: "",
};

export default function AdminAnnouncementForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim() || !form.detail.trim() || !form.publishAt.trim()) {
      setError("กรุณากรอกข้อมูลสำคัญให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          expireAt: form.expireAt || undefined,
        }),
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        setError(result.message ?? "ไม่สามารถเพิ่มประกาศได้");
        return;
      }

      setSuccess("เพิ่มประกาศเรียบร้อยแล้ว");
      setForm(initialFormState);
    } catch {
      setError("เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="announcement-title"
          className="mb-1 block text-sm font-medium text-slate-800"
        >
          หัวข้อประกาศ
        </label>
        <input
          id="announcement-title"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="เช่น แจ้งกำหนดสอบย่อยบทที่ 5"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="announcement-detail"
          className="mb-1 block text-sm font-medium text-slate-800"
        >
          รายละเอียดประกาศ
        </label>
        <textarea
          id="announcement-detail"
          rows={4}
          value={form.detail}
          onChange={(event) => updateField("detail", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="พิมพ์รายละเอียดที่ต้องการแจ้งให้นักเรียนทราบ"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label
          htmlFor="announcement-audience"
          className="mb-1 block text-sm font-medium text-slate-800"
        >
          กลุ่มเป้าหมาย
        </label>
        <input
          id="announcement-audience"
          value={form.audience}
          onChange={(event) => updateField("audience", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="เช่น นักเรียน ม.3 และผู้ปกครอง"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="announcement-category"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            ประเภทประกาศ
          </label>
          <select
            id="announcement-category"
            value={form.category}
            onChange={(event) =>
              updateField(
                "category",
                event.target.value as AnnouncementItem["category"],
              )
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled={isSubmitting}
          >
            <option value="การบ้าน">การบ้าน</option>
            <option value="สอบ">สอบ</option>
            <option value="กิจกรรม">กิจกรรม</option>
            <option value="ทั่วไป">ทั่วไป</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="announcement-priority"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            ระดับความสำคัญ
          </label>
          <select
            id="announcement-priority"
            value={form.priority}
            onChange={(event) =>
              updateField(
                "priority",
                event.target.value as AnnouncementItem["priority"],
              )
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled={isSubmitting}
          >
            <option value="สูง">สูง</option>
            <option value="กลาง">กลาง</option>
            <option value="ทั่วไป">ทั่วไป</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="announcement-publish-at"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            วันเวลาเริ่มแสดง
          </label>
          <input
            id="announcement-publish-at"
            type="datetime-local"
            value={form.publishAt}
            onChange={(event) => updateField("publishAt", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="announcement-expire-at"
            className="mb-1 block text-sm font-medium text-slate-800"
          >
            วันเวลาหมดอายุ (ไม่บังคับ)
          </label>
          <input
            id="announcement-expire-at"
            type="datetime-local"
            value={form.expireAt}
            onChange={(event) => updateField("expireAt", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.isPinned}
          onChange={(event) => updateField("isPinned", event.target.checked)}
          disabled={isSubmitting}
        />
        ปักหมุดประกาศนี้
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md border border-slate-400 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        {isSubmitting ? "กำลังบันทึก..." : "เพิ่มประกาศ"}
      </button>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
    </form>
  );
}
