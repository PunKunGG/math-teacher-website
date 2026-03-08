import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import {
  getDocumentsByLessonId,
  getLessonById,
  getLessonIds,
} from "@/lib/data-service";

type LessonDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const ids = await getLessonIds();
  return ids.map((id) => ({ id: String(id) }));
}

export default async function LessonDetailPage({
  params,
}: LessonDetailPageProps) {
  const { id } = await params;
  const lessonId = Number(id);

  if (Number.isNaN(lessonId)) {
    notFound();
  }

  const lesson = await getLessonById(lessonId);
  if (!lesson) {
    notFound();
  }

  const lessonDocuments = await getDocumentsByLessonId(lessonId);

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title={lesson.title}
        description={`ระดับชั้น ${lesson.grade} | หน่วย ${lesson.unit} | ใช้เวลา ${lesson.duration} | อัปเดตล่าสุด ${lesson.updatedAt}`}
      />

      <SectionCard title="สรุปบทเรียน">
        <div className="space-y-2">
          <p className="text-slate-700">{lesson.summary}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded border border-slate-200 bg-slate-100 px-2 py-1 text-slate-700">
              ระดับความยาก: {lesson.difficulty}
            </span>
            <span className="rounded border border-indigo-200 bg-indigo-50 px-2 py-1 text-indigo-700">
              น้ำหนักข้อสอบ: {lesson.examWeight}
            </span>
            {lesson.isExamFocused ? (
              <span className="rounded border border-blue-200 bg-blue-100 px-2 py-1 font-medium text-blue-700">
                บทนี้ออกสอบบ่อย
              </span>
            ) : null}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="จุดประสงค์การเรียนรู้">
        <ul className="list-disc space-y-2 pl-6 text-slate-700">
          {lesson.objectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="แผนเรียนแนะนำ (ทีละขั้น)">
        <ol className="list-decimal space-y-2 pl-6 text-slate-700">
          <li>อ่านสรุปแนวคิด 10-15 นาที และทำความเข้าใจนิยามสำคัญ</li>
          <li>ดูตัวอย่างโจทย์ที่ครูเฉลย แล้วสรุปขั้นตอนลงสมุด</li>
          <li>ทำแบบฝึกหัดจากง่ายไปยาก และตรวจด้วยเฉลยอธิบายวิธีคิด</li>
        </ol>
      </SectionCard>

      <SectionCard title="ข้อควรระวังที่พลาดบ่อย">
        <ul className="list-disc space-y-2 pl-6 text-slate-700">
          {lesson.commonMistakes.map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="ชุดแบบฝึกหัดแนะนำ">
        <ul className="space-y-3">
          {lesson.practiceSets.map((set) => (
            <li
              key={set.id}
              className="rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <p className="font-medium text-slate-900">{set.title}</p>
              <p className="mt-1 text-sm text-slate-700">
                ระดับ {set.level} | จำนวน {set.questionCount} ข้อ
              </p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="เอกสารประกอบบทเรียนนี้">
        {lessonDocuments.length === 0 ? (
          <p className="text-sm text-slate-600">
            ยังไม่มีเอกสารที่ผูกกับบทเรียนนี้
            สามารถดูเอกสารทั้งหมดได้ที่หน้าคลังเอกสาร
          </p>
        ) : (
          <ul className="space-y-3">
            {lessonDocuments.map((document) => (
              <li
                key={document.id}
                className="rounded-md border border-slate-200 bg-slate-50 p-4"
              >
                <p className="font-medium text-slate-900">{document.title}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {document.category} | {document.fileType} | อัปเดตล่าสุด{" "}
                  {document.updatedAt}
                </p>
                {document.fileUrl ? (
                  <a
                    href={document.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-slate-700 hover:underline"
                  >
                    เปิดเอกสาร
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <section className="flex flex-wrap gap-3">
        <Link
          href="/documents"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
        >
          ดูเอกสารประกอบบทนี้
        </Link>
        <Link
          href="/lessons"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
        >
          กลับไปหน้ารายการบทเรียน
        </Link>
      </section>
    </article>
  );
}
