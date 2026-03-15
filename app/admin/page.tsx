import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/admin/LogoutButton";
import AdminAnnouncementForm from "@/app/admin/AdminAnnouncementForm";
import AdminLessonsManager from "@/app/admin/AdminLessonsManager";
import AdminDocumentsManager from "@/app/admin/AdminDocumentsManager";
import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import AdminUploadForm from "@/app/admin/AdminUploadForm";
import {
  getAdminStats,
  getAdminTasks,
  getDocuments,
  getLessons,
} from "@/lib/data-service";
import {
  getAdminCookieName,
  verifyAdminSessionToken,
} from "@/lib/auth/admin-session";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(getAdminCookieName())?.value;

  if (!verifyAdminSessionToken(session)) {
    redirect("/admin/login");
  }

  const [stats, tasks, documents, lessons] = await Promise.all([
    getAdminStats(),
    getAdminTasks(),
    getDocuments(),
    getLessons(),
  ]);

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title="หน้าผู้ดูแลระบบ"
        description="พื้นที่จัดการข้อมูลรายวิชาคณิตศาสตร์ ม.3 สำหรับครูผู้สอน"
      />

      <div className="flex justify-end">
        <LogoutButton />
      </div>

      <SectionCard title="ภาพรวมข้อมูล">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm text-slate-600">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="งานที่ต้องดำเนินการ">
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="rounded-md border border-slate-200 bg-white p-4"
            >
              <p className="font-medium text-slate-900">{task.title}</p>
              <p className="mt-1 text-sm text-slate-600">
                กำหนดส่ง: {task.dueDate}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                สถานะ: {task.status === "done" ? "เสร็จแล้ว" : "รอดำเนินการ"}
              </p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="แนวทางดูแลเนื้อหารายวิชา">
        <p className="text-slate-700">
          ควรอัปเดตบทเรียนและเอกสารให้สอดคล้องกับแผนการสอนรายสัปดาห์
          เพื่อให้นักเรียนและผู้ปกครองติดตามข้อมูลได้อย่างต่อเนื่อง
        </p>
      </SectionCard>

      <SectionCard title="อัปโหลดเอกสารสำหรับนักเรียน">
        <p className="mb-4 text-slate-700">
          ครูสามารถอัปโหลดไฟล์จากเครื่อง
          และไฟล์จะไปแสดงที่หน้าเอกสารโดยอัตโนมัติ
        </p>
        <AdminUploadForm />
      </SectionCard>

      <SectionCard title="เพิ่มประกาศสำหรับนักเรียน">
        <p className="mb-4 text-slate-700">
          ใช้ฟอร์มนี้เพื่อประกาศการบ้าน ตารางสอบ หรือกิจกรรม
          โดยสามารถกำหนดการปักหมุดและช่วงเวลาแสดงผลได้
        </p>
        <AdminAnnouncementForm />
      </SectionCard>

      <SectionCard title="จัดการบทเรียนคณิตศาสตร์">
        <p className="mb-4 text-slate-700">
          เพิ่ม แก้ไข และลบบทเรียนได้จากส่วนนี้
          ข้อมูลจะถูกอัปเดตที่หน้าบทเรียนและหน้ารายละเอียดโดยอัตโนมัติ
        </p>
        <AdminLessonsManager
          initialLessons={lessons}
          initialDocuments={documents}
        />
      </SectionCard>

      <SectionCard title="จัดการเอกสารที่อัปโหลดแล้ว">
        <AdminDocumentsManager initialDocuments={documents} />
      </SectionCard>
    </article>
  );
}
