import ContentList from "@/app/components/ContentList";
import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import { getLessons } from "@/lib/data-service";

export default async function LessonsPage() {
  const lessons = await getLessons();

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title="บทเรียนคณิตศาสตร์"
        description="รวมบทเรียนรายหน่วย พร้อมคำอธิบายสั้นเพื่อช่วยนักเรียนเตรียมตัวล่วงหน้า"
      />

      <SectionCard title="รายการบทเรียนล่าสุด">
        <ContentList
          items={lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            detail: lesson.summary,
            meta: `ระดับชั้น: ${lesson.grade}`,
          }))}
        />
      </SectionCard>

      <SectionCard title="คำแนะนำการเรียน">
        <ul className="list-disc space-y-2 pl-6 text-slate-700">
          <li>ทบทวนเนื้อหาหลังเรียนภายใน 24 ชั่วโมง</li>
          <li>ทำแบบฝึกหัดจากง่ายไปยากอย่างสม่ำเสมอ</li>
          <li>จดข้อสงสัยและสอบถามในคาบถัดไป</li>
        </ul>
      </SectionCard>
    </article>
  );
}
