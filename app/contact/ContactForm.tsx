"use client";

import { useState } from "react";

type FormState = {
  fullName: string;
  classroom: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  fullName: "",
  classroom: "",
  message: "",
};

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "กรุณากรอกชื่อ-นามสกุล";
  }

  if (!values.classroom.trim()) {
    errors.classroom = "กรุณากรอกห้องเรียน เช่น ม.3/1";
  }

  if (!values.message.trim()) {
    errors.message = "กรุณากรอกข้อความที่ต้องการสอบถาม";
  } else if (values.message.trim().length < 10) {
    errors.message = "ข้อความควรมีอย่างน้อย 10 ตัวอักษร";
  }

  return errors;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setIsSubmitted(false);
    setSubmitError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        setSubmitError(
          result.message ?? "ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
        );
        return;
      }

      setIsSubmitted(true);
      setForm(initialFormState);
    } catch {
      setSubmitError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="fullName"
          className="mb-1 block text-sm font-medium text-slate-800"
        >
          ชื่อ-นามสกุล
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={form.fullName}
          onChange={(event) => handleChange("fullName", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="เช่น ด.ช. สมชาย ใจดี"
          disabled={isSubmitting}
        />
        {errors.fullName ? (
          <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="classroom"
          className="mb-1 block text-sm font-medium text-slate-800"
        >
          ห้องเรียน
        </label>
        <input
          id="classroom"
          name="classroom"
          type="text"
          value={form.classroom}
          onChange={(event) => handleChange("classroom", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="เช่น ม.3/1"
          disabled={isSubmitting}
        />
        {errors.classroom ? (
          <p className="mt-1 text-xs text-red-600">{errors.classroom}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-slate-800"
        >
          ข้อความ
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={(event) => handleChange("message", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="พิมพ์คำถามหรือรายละเอียดที่ต้องการสอบถาม"
          disabled={isSubmitting}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-red-600">{errors.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md border border-slate-400 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        {isSubmitting ? "กำลังส่ง..." : "ส่งข้อความ"}
      </button>

      {submitError ? (
        <p className="text-sm text-red-700">{submitError}</p>
      ) : null}

      {isSubmitted ? (
        <p className="text-sm text-emerald-700">ส่งข้อความเรียบร้อยแล้ว</p>
      ) : null}
    </form>
  );
}
