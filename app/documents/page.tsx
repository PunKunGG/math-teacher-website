import DocumentsSearchFilter from "@/app/documents/DocumentsSearchFilter";
import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import { getDocuments } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title="เอกสารประกอบการเรียน ม.3"
        description="รวมใบงาน แบบฝึกหัด และเอกสารสรุปคณิตศาสตร์ ม.3 สำหรับนักเรียนและผู้ปกครอง"
      />

      <SectionCard title="รายการเอกสาร">
        <DocumentsSearchFilter documents={documents} />
      </SectionCard>

      <SectionCard title="หมายเหตุการใช้งาน">
        <p className="text-slate-700">
          นักเรียนสามารถเปิดดูหรือดาวน์โหลดเอกสารได้ทันทีจากรายการด้านบน
          หากยังไม่พบไฟล์ที่ต้องการ
          ให้ตรวจสอบประกาศล่าสุดหรือสอบถามครูผู้สอนเพิ่มเติม
        </p>
      </SectionCard>
    </article>
  );
}
