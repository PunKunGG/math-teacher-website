import ContentList from "@/app/components/ContentList";
import PageHeader from "@/app/components/PageHeader";
import SectionCard from "@/app/components/SectionCard";
import ContactForm from "@/app/contact/ContactForm";
import { getContactChannels } from "@/lib/data-service";

export default async function ContactPage() {
  const channels = await getContactChannels();

  return (
    <article className="space-y-8 py-8">
      <PageHeader
        title="ติดต่อครูผู้สอน"
        description="สำหรับนักเรียนและผู้ปกครองที่ต้องการสอบถามบทเรียน งานที่มอบหมาย หรือเอกสารเพิ่มเติม"
      />

      <SectionCard title="ช่องทางการติดต่อ">
        <ContentList
          items={channels.map((channel) => ({
            id: channel.id,
            title: `${channel.name}: ${channel.value}`,
            detail: channel.note,
          }))}
        />
      </SectionCard>

      <SectionCard title="แบบฟอร์มส่งคำถาม">
        <ContactForm />
      </SectionCard>

      <SectionCard title="เวลาติดต่อที่แนะนำ">
        <p className="text-slate-700">
          วันจันทร์-ศุกร์ เวลา 10.00-15.00 น.
          หากเป็นกรณีเร่งด่วนโปรดระบุหัวข้อให้ชัดเจนเพื่อความรวดเร็วในการตอบกลับ
        </p>
      </SectionCard>
    </article>
  );
}
