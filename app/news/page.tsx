import NewsBoard from "@/app/news/NewsBoard";
import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import { getAnnouncements } from "@/lib/data-service";

export default async function NewsPage() {
  const announcements = await getAnnouncements();

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title="ประกาศและข่าวสาร"
        description="ติดตามกำหนดการเรียน การสอบ และกิจกรรมสำคัญของรายวิชาคณิตศาสตร์ ม.3"
      />

      <SectionCard title="ประกาศล่าสุด">
        <NewsBoard announcements={announcements} />
      </SectionCard>
    </article>
  );
}
