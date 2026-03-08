import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import { getTeacherProfile, getTeachingValues } from "@/lib/data-service";

export default async function AboutPage() {
  const [teacher, values] = await Promise.all([
    getTeacherProfile(),
    getTeachingValues(),
  ]);

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title="เกี่ยวกับครูผู้สอน"
        description={`${teacher.name} | ${teacher.role} | อีเมล: ${teacher.email}`}
      />

      <SectionCard title="ประสบการณ์และเป้าหมายการสอน">
        <p className="text-slate-700">
          ครูมีประสบการณ์สอน {teacher.experienceYears} ปี
          โดยมุ่งพัฒนาความเข้าใจเชิงตรรกะ และทักษะการแก้ปัญหาสำหรับนักเรียน ม.3
          เพื่อให้นักเรียนมีพื้นฐานที่มั่นคงทั้งในห้องเรียนและการสอบ
        </p>
      </SectionCard>

      <SectionCard title="แนวทางหลักในการดูแลนักเรียน">
        <ul className="space-y-3">
          {values.map((value) => (
            <li
              key={value.id}
              className="rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-medium text-slate-900">{value.title}</p>
              <p className="mt-1 text-sm text-slate-700">{value.detail}</p>
            </li>
          ))}
        </ul>
      </SectionCard>
    </article>
  );
}
