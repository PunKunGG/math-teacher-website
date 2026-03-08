import LessonsBoard from "@/app/lessons/LessonsBoard";
import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import { getLessons } from "@/lib/data-service";

export default async function LessonsPage() {
  const lessons = await getLessons();
  const examFocusedLessons = lessons.filter((lesson) => lesson.isExamFocused);
  const totalDuration = lessons.reduce(
    (sum, lesson) => sum + lesson.durationMinutes,
    0,
  );
  const reviewPlan = [...lessons]
    .sort((a, b) => {
      const weightScore = {
        สูง: 3,
        กลาง: 2,
        ต่ำ: 1,
      };

      const scoreDiff = weightScore[b.examWeight] - weightScore[a.examWeight];
      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      return b.durationMinutes - a.durationMinutes;
    })
    .slice(0, 4);

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title="บทเรียนคณิตศาสตร์ ม.3"
        description="เส้นทางเรียนรายหน่วย พร้อมโหมดทบทวนก่อนสอบและบทเรียนที่จัดลำดับตามความสำคัญ"
      />

      <SectionCard title="ภาพรวมเทอมนี้">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-600">บทเรียนทั้งหมด</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {lessons.length}
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-600">เวลาเรียนรวมโดยประมาณ</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {totalDuration} นาที
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-600">บทที่เน้นออกสอบ</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {examFocusedLessons.length}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="แผนทบทวนก่อนสอบ 7 วัน (แนะนำ)">
        <ul className="space-y-3">
          {reviewPlan.map((lesson, index) => (
            <li
              key={lesson.id}
              className="rounded-md border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm font-medium text-slate-900">
                วันที่ {index + 1}-{index + 2}: {lesson.title}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                เน้นหัวข้อ {lesson.unit} | น้ำหนักสอบ {lesson.examWeight} |
                เวลาแนะนำ {lesson.duration}
              </p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="คลังบทเรียน">
        <LessonsBoard lessons={lessons} />
      </SectionCard>
    </article>
  );
}
