"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password.trim()) {
      setError("กรุณากรอกรหัสผ่าน");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        setError(result.message ?? "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-slate-800"
        >
          รหัสผ่านผู้ดูแลระบบ
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="กรอกรหัสผ่าน"
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md border border-slate-400 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
