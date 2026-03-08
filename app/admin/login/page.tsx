import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import LoginForm from "@/app/admin/login/LoginForm";
import {
  getAdminCookieName,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-session";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(getAdminCookieName())?.value;

  if (verifyAdminSessionToken(session)) {
    redirect("/admin");
  }

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title="เข้าสู่ระบบผู้ดูแล"
        description="สำหรับครูผู้สอนเท่านั้น เพื่อจัดการอัปโหลดเอกสารและข้อมูลหน้าเว็บไซต์"
      />

      <SectionCard title="กรอกรหัสผ่านเพื่อเข้าสู่ระบบ">
        <LoginForm />
      </SectionCard>
    </article>
  );
}
