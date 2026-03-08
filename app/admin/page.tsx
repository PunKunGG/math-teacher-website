import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import { getAdminStats, getAdminTasks } from "@/lib/data-service";

export default async function AdminPage() {
  const [stats, tasks] = await Promise.all([getAdminStats(), getAdminTasks()]);

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title="หน้าผู้ดูแลระบบ"
        description="โครงหน้าจัดการข้อมูลเว็บไซต์สำหรับครูผู้สอน (ใช้ข้อมูลจำลองในระยะพัฒนา)"
      />

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

      <SectionCard title="พร้อมเชื่อมต่อ Supabase">
        <p className="text-slate-700">
          หน้านี้แยกชั้นข้อมูลไว้ที่ไฟล์ service แล้ว
          จึงสามารถเปลี่ยนจากข้อมูลจำลองไปเป็น Supabase
          ได้โดยแก้เฉพาะส่วนดึงข้อมูล
        </p>
      </SectionCard>
    </article>
  );
}
