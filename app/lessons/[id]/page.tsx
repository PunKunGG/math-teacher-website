import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import { getLessonById, getLessonIds } from "@/lib/data-service";

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

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title={lesson.title}
        description={`ระดับชั้น ${lesson.grade} | ใช้เวลา ${lesson.duration} | อัปเดตล่าสุด ${lesson.updatedAt}`}
      />

      <SectionCard title="สรุปบทเรียน">
        <p className="text-slate-700">{lesson.summary}</p>
      </SectionCard>

      <SectionCard title="จุดประสงค์การเรียนรู้">
        <ul className="list-disc space-y-2 pl-6 text-slate-700">
          {lesson.objectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </SectionCard>

      <section>
        <Link
          href="/lessons"
          className="text-sm font-medium text-slate-700 hover:underline"
        >
          กลับไปหน้ารายการบทเรียน
        </Link>
      </section>
    </article>
  );
}
