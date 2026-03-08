import type {
  AdminStat,
  AdminTask,
  AnnouncementItem,
  ContactChannel,
  DocumentItem,
  LessonItem,
  TeacherProfile,
  TeachingValue,
} from "@/lib/types";

export const teacherProfile: TeacherProfile = {
  name: "ครูอรทัย ใจดี",
  role: "ครูคณิตศาสตร์ระดับมัธยมศึกษา",
  intro:
    "มุ่งเน้นให้นักเรียนเข้าใจคณิตศาสตร์อย่างเป็นระบบ พร้อมนำไปใช้แก้ปัญหาในชีวิตจริง",
  experienceYears: 12,
  email: "math.teacher@example.com",
};

export const teachingValues: TeachingValue[] = [
  {
    id: 1,
    title: "เข้าใจพื้นฐานอย่างแท้จริง",
    detail: "ทบทวนแนวคิดสำคัญให้ชัดเจนก่อนเพิ่มระดับความยาก",
  },
  {
    id: 2,
    title: "ฝึกคิดเป็นขั้นตอน",
    detail: "ใช้วิธีอธิบายทีละลำดับ พร้อมตัวอย่างและแบบฝึกหัดสั้น",
  },
  {
    id: 3,
    title: "ประเมินและพัฒนาอย่างต่อเนื่อง",
    detail: "ติดตามความก้าวหน้ารายบุคคลและให้คำแนะนำเฉพาะจุด",
  },
];

export const lessons: LessonItem[] = [
  {
    id: 1,
    title: "สมการเชิงเส้นตัวแปรเดียว",
    grade: "ม.1",
    summary: "เรียนรู้การแก้สมการพื้นฐานและการตรวจคำตอบ",
  },
  {
    id: 2,
    title: "อัตราส่วน ร้อยละ และการประยุกต์",
    grade: "ม.2",
    summary: "เชื่อมโยงโจทย์ชีวิตประจำวันกับการคำนวณอย่างเป็นระบบ",
  },
  {
    id: 3,
    title: "พีชคณิตเบื้องต้นและการแยกตัวประกอบ",
    grade: "ม.3",
    summary: "เตรียมพื้นฐานสำหรับบทเรียนระดับสูงและการสอบ",
  },
  {
    id: 4,
    title: "สถิติและการอ่านข้อมูล",
    grade: "ม.ปลาย",
    summary: "วิเคราะห์ข้อมูลจากตารางและกราฟเพื่อสรุปผลอย่างมีเหตุผล",
  },
];

export const documents: DocumentItem[] = [
  {
    id: 1,
    title: "ใบงานบทที่ 2: สมการ",
    category: "ใบงาน",
    updatedAt: "5 มีนาคม 2026",
    fileType: "PDF",
  },
  {
    id: 2,
    title: "สรุปสูตรสำคัญก่อนสอบกลางภาค",
    category: "เอกสารสรุป",
    updatedAt: "7 มีนาคม 2026",
    fileType: "PDF",
  },
  {
    id: 3,
    title: "แบบฝึกหัดเพิ่มเติมเรื่องร้อยละ",
    category: "แบบฝึกหัด",
    updatedAt: "8 มีนาคม 2026",
    fileType: "DOCX",
  },
];

export const announcements: AnnouncementItem[] = [
  {
    id: 1,
    title: "กำหนดส่งแบบฝึกหัดบทที่ 4",
    date: "10 มีนาคม 2026",
    audience: "นักเรียนทุกระดับชั้น",
    detail: "ส่งภายในเวลา 20:00 น. ผ่านระบบงานออนไลน์ของห้องเรียน",
  },
  {
    id: 2,
    title: "ตารางเรียนเสริมก่อนสอบกลางภาค",
    date: "12 มีนาคม 2026",
    audience: "ม.2 และ ม.3",
    detail: "มีคาบเรียนเสริมวันเสาร์ เวลา 09:00-11:00 น.",
  },
  {
    id: 3,
    title: "ประกาศหัวข้อโครงงานคณิตศาสตร์",
    date: "15 มีนาคม 2026",
    audience: "ม.ปลาย",
    detail: "เลือกหัวข้อโครงงานเป็นกลุ่มและส่งแผนงานภายในสัปดาห์นี้",
  },
];

export const contactChannels: ContactChannel[] = [
  {
    id: 1,
    name: "อีเมล",
    value: "math.teacher@example.com",
    note: "เหมาะสำหรับคำถามด้านบทเรียนและเอกสาร",
  },
  {
    id: 2,
    name: "โทรศัพท์โรงเรียน",
    value: "02-123-4567 ต่อ 204",
    note: "ติดต่อในวันจันทร์-ศุกร์ เวลา 08:30-16:30 น.",
  },
  {
    id: 3,
    name: "Line กลุ่มผู้ปกครอง",
    value: "MathClass-Parent",
    note: "ใช้ประกาศข่าวสารและกำหนดการสำคัญ",
  },
];

export const adminStats: AdminStat[] = [
  { id: 1, label: "บทเรียนทั้งหมด", value: "24" },
  { id: 2, label: "เอกสารเผยแพร่", value: "57" },
  { id: 3, label: "ประกาศที่กำลังแสดง", value: "6" },
];

export const adminTasks: AdminTask[] = [
  {
    id: 1,
    title: "อัปเดตเอกสารสรุปก่อนสอบ",
    status: "pending",
    dueDate: "11 มีนาคม 2026",
  },
  {
    id: 2,
    title: "ตรวจสอบลิงก์ดาวน์โหลดทั้งหมด",
    status: "pending",
    dueDate: "13 มีนาคม 2026",
  },
  {
    id: 3,
    title: "เผยแพร่ตารางสอนเสริม",
    status: "done",
    dueDate: "8 มีนาคม 2026",
  },
];
