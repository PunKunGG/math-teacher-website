import Link from "next/link";
import ContentList from "@/app/components/ContentList";
import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import {
  getAnnouncements,
  getLessons,
  getTeacherProfile,
  getTeachingValues,
} from "@/lib/data-service";

export default async function Home() {
  const [teacher, values, lessons, announcements] = await Promise.all([
    getTeacherProfile(),
    getTeachingValues(),
    getLessons(),
    getAnnouncements(),
  ]);

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title={`ยินดีต้อนรับสู่ห้องเรียนคณิตศาสตร์ของ${teacher.name}`}
        description={`${teacher.role} ประสบการณ์สอน ${teacher.experienceYears} ปี | ${teacher.intro}`}
      />

      <SectionCard
        title="แนวทางการสอน"
        description="เรียนรู้แบบค่อยเป็นค่อยไป เน้นความเข้าใจและการนำไปใช้จริง"
      >
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

      <section className="grid gap-6 md:grid-cols-2">
        <SectionCard title="บทเรียนล่าสุด">
          <ContentList
            items={lessons.slice(0, 3).map((lesson) => ({
              id: lesson.id,
              title: lesson.title,
              detail: lesson.summary,
              meta: `ระดับชั้น: ${lesson.grade}`,
              href: "/lessons",
            }))}
          />
        </SectionCard>

        <SectionCard title="ประกาศล่าสุด">
          <ContentList
            items={announcements.slice(0, 3).map((item) => ({
              id: item.id,
              title: item.title,
              detail: item.detail,
              meta: `${item.date} | ${item.audience}`,
              href: "/news",
            }))}
          />
        </SectionCard>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-slate-900">
          ทางลัดสำหรับนักเรียนและผู้ปกครอง
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/lessons"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            ดูบทเรียน
          </Link>
          <Link
            href="/documents"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            ดาวน์โหลดเอกสาร
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            ติดต่อครูผู้สอน
          </Link>
        </div>
      </section>
    </article>
  );
}
