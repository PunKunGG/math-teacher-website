import ContentList from "@/app/components/ContentList";
import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import { getDocuments } from "@/lib/data-service";

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title="เอกสารประกอบการเรียน"
        description="รวมใบงาน แบบฝึกหัด และเอกสารสรุปสำหรับนักเรียนและผู้ปกครอง"
      />

      <SectionCard title="รายการเอกสาร">
        <ContentList
          items={documents.map((document) => ({
            id: document.id,
            title: document.title,
            detail: `หมวดหมู่: ${document.category}`,
            meta: `อัปเดตล่าสุด: ${document.updatedAt} | รูปแบบไฟล์: ${document.fileType}`,
          }))}
        />
      </SectionCard>

      <SectionCard title="หมายเหตุการใช้งาน">
        <p className="text-slate-700">
          ขณะนี้รายการเอกสารเป็นข้อมูลตัวอย่าง
          เพื่อเตรียมโครงสร้างสำหรับการเชื่อมต่อระบบฐานข้อมูลในขั้นถัดไป
        </p>
      </SectionCard>
    </article>
  );
}
