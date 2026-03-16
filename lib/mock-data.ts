import type {
  AdminTask,
  AnnouncementItem,
  ContactChannel,
  DocumentItem,
  LessonItem,
  TeacherProfile,
  TeachingValue,
} from "@/lib/types";

export const teacherProfile: TeacherProfile = {
  name: "ครูสุมาลี ภูศรีอ่อน",
  role: "ครูผู้สอนคณิตศาสตร์ระดับชั้น ม.3",
  intro:
    "มุ่งเน้นให้นักเรียนเข้าใจคณิตศาสตร์อย่างเป็นระบบ พร้อมนำไปใช้แก้ปัญหาในชีวิตจริง",
  experienceYears: 12,
  email: "phusrion@gmail.com",
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
    title: "สมการกำลังสองตัวแปรเดียว",
    unit: "พีชคณิต",
    grade: "ม.3",
    summary: "ฝึกแก้สมการกำลังสองด้วยการแยกตัวประกอบและตรวจสอบคำตอบ",
    durationMinutes: 50,
    duration: "50 นาที",
    updatedAt: "6 มีนาคม 2026",
    difficulty: "กลาง",
    examWeight: "สูง",
    isExamFocused: true,
    objectives: [
      "อธิบายรูปแบบทั่วไปของสมการกำลังสองได้",
      "แก้สมการกำลังสองด้วยการแยกตัวประกอบได้อย่างถูกต้อง",
      "ตรวจสอบคำตอบและเลือกคำตอบที่สอดคล้องกับโจทย์ได้",
    ],
    commonMistakes: [
      "ย้ายข้างผิดเครื่องหมายระหว่างจัดรูปสมการ",
      "แยกตัวประกอบไม่ครบทุกกรณี",
      "ลืมตรวจคำตอบกลับในสมการเดิม",
    ],
    practiceSets: [
      { id: 101, title: "ฝึกแยกตัวประกอบ", level: "ง่าย", questionCount: 10 },
      {
        id: 102,
        title: "โจทย์แก้สมการกำลังสอง",
        level: "กลาง",
        questionCount: 12,
      },
      { id: 103, title: "โจทย์ประยุกต์", level: "ยาก", questionCount: 8 },
    ],
  },
  {
    id: 2,
    title: "ระบบสมการเชิงเส้นสองตัวแปร",
    unit: "พีชคณิต",
    grade: "ม.3",
    summary: "เรียนรู้การแก้ระบบสมการด้วยวิธีแทนค่าและวิธีกำจัด",
    durationMinutes: 60,
    duration: "60 นาที",
    updatedAt: "7 มีนาคม 2026",
    difficulty: "กลาง",
    examWeight: "สูง",
    isExamFocused: true,
    objectives: [
      "อธิบายความหมายของคำตอบของระบบสมการได้",
      "แก้ระบบสมการเชิงเส้นสองตัวแปรได้อย่างน้อย 2 วิธี",
      "ประยุกต์ระบบสมการกับโจทย์ปัญหาสถานการณ์จริงได้",
    ],
    commonMistakes: [
      "แทนค่าผิดตัวแปรระหว่างคำนวณ",
      "กำจัดตัวแปรโดยไม่ทำทั้งสองสมการพร้อมกัน",
      "สรุปคำตอบโดยไม่ตรวจในสมการทั้งสอง",
    ],
    practiceSets: [
      { id: 201, title: "ฝึกแทนค่า", level: "ง่าย", questionCount: 8 },
      {
        id: 202,
        title: "ฝึกวิธีกำจัด",
        level: "กลาง",
        questionCount: 10,
      },
      {
        id: 203,
        title: "โจทย์สถานการณ์จริง",
        level: "ยาก",
        questionCount: 6,
      },
    ],
  },
  {
    id: 3,
    title: "พีทาโกรัสและการประยุกต์",
    unit: "เรขาคณิต",
    grade: "ม.3",
    summary: "ใช้ทฤษฎีบทพีทาโกรัสแก้โจทย์เรขาคณิตและปัญหาเชิงประยุกต์",
    durationMinutes: 60,
    duration: "60 นาที",
    updatedAt: "8 มีนาคม 2026",
    difficulty: "พื้นฐาน",
    examWeight: "กลาง",
    isExamFocused: false,
    objectives: [
      "อธิบายความสัมพันธ์ของด้านในสามเหลี่ยมมุมฉากได้",
      "คำนวณความยาวด้านที่หายไปโดยใช้ทฤษฎีบทพีทาโกรัสได้",
      "ประยุกต์ใช้กับโจทย์ระยะทางและรูปเรขาคณิตในชีวิตจริงได้",
    ],
    commonMistakes: [
      "สลับด้านตรงข้ามมุมฉากกับด้านประกอบมุมฉาก",
      "ถอดรากผิดเมื่อได้ผลรวมกำลังสอง",
      "ไม่ระบุหน่วยคำตอบในโจทย์ประยุกต์",
    ],
    practiceSets: [
      {
        id: 301,
        title: "พื้นฐานพีทาโกรัส",
        level: "ง่าย",
        questionCount: 10,
      },
      {
        id: 302,
        title: "โจทย์หาด้านที่หายไป",
        level: "กลาง",
        questionCount: 8,
      },
      {
        id: 303,
        title: "โจทย์ประยุกต์หลายขั้น",
        level: "ยาก",
        questionCount: 6,
      },
    ],
  },
  {
    id: 4,
    title: "ความน่าจะเป็นเบื้องต้น",
    unit: "สถิติและความน่าจะเป็น",
    grade: "ม.3",
    summary: "คำนวณความน่าจะเป็นจากการทดลองสุ่มอย่างเป็นขั้นตอน",
    durationMinutes: 55,
    duration: "55 นาที",
    updatedAt: "8 มีนาคม 2026",
    difficulty: "เข้มข้น",
    examWeight: "สูง",
    isExamFocused: true,
    objectives: [
      "ระบุผลลัพธ์ทั้งหมดและผลลัพธ์ที่สนใจของการทดลองสุ่มได้",
      "คำนวณความน่าจะเป็นของเหตุการณ์อย่างง่ายได้",
      "อธิบายความหมายของค่าความน่าจะเป็นในสถานการณ์จริงได้",
    ],
    commonMistakes: [
      "นับ sample space ไม่ครบ",
      "ใช้สูตรไม่ตรงกับเงื่อนไขเหตุการณ์",
      "ตีความผลลัพธ์ความน่าจะเป็นผิดจากโจทย์",
    ],
    practiceSets: [
      {
        id: 401,
        title: "นับผลลัพธ์การทดลองสุ่ม",
        level: "ง่าย",
        questionCount: 8,
      },
      {
        id: 402,
        title: "คำนวณความน่าจะเป็น",
        level: "กลาง",
        questionCount: 12,
      },
      {
        id: 403,
        title: "โจทย์ความน่าจะเป็นออกสอบ",
        level: "ยาก",
        questionCount: 10,
      },
    ],
  },
];

export const documents: DocumentItem[] = [
  {
    id: 1,
    title: "ใบงาน ม.3 บทที่ 2: สมการกำลังสอง",
    category: "ใบงาน",
    grade: "ม.3",
    lessonId: 1,
    updatedAt: "5 มีนาคม 2026",
    fileType: "PDF",
  },
  {
    id: 2,
    title: "สรุปสูตรสำคัญคณิตศาสตร์ ม.3 ก่อนสอบกลางภาค",
    category: "เอกสารสรุป",
    grade: "ม.3",
    updatedAt: "7 มีนาคม 2026",
    fileType: "PDF",
  },
  {
    id: 3,
    title: "แบบฝึกหัดเพิ่มเติม: ระบบสมการเชิงเส้นสองตัวแปร",
    category: "แบบฝึกหัด",
    grade: "ม.3",
    lessonId: 2,
    updatedAt: "8 มีนาคม 2026",
    fileType: "DOCX",
  },
];

export const announcements: AnnouncementItem[] = [
  {
    id: 1,
    title: "กำหนดส่งใบงานคณิตศาสตร์ ม.3 บทที่ 4",
    date: "10 มีนาคม 2026",
    audience: "นักเรียน ม.3",
    detail: "ส่งภายในเวลา 20:00 น. ผ่านระบบงานออนไลน์ของห้องเรียน",
    category: "การบ้าน",
    priority: "สูง",
    isPinned: true,
    publishAt: "2026-03-08T08:00:00+07:00",
    expireAt: "2026-03-11T00:00:00+07:00",
  },
  {
    id: 2,
    title: "ตารางเรียนเสริมคณิตศาสตร์ ม.3 ก่อนสอบกลางภาค",
    date: "12 มีนาคม 2026",
    audience: "นักเรียน ม.3 และผู้ปกครอง",
    detail: "มีคาบเรียนเสริมวันเสาร์ เวลา 09:00-11:00 น.",
    category: "สอบ",
    priority: "กลาง",
    isPinned: true,
    publishAt: "2026-03-09T08:00:00+07:00",
    expireAt: "2026-03-15T23:59:59+07:00",
  },
  {
    id: 3,
    title: "ประกาศหัวข้อโครงงานคณิตศาสตร์ ม.3",
    date: "15 มีนาคม 2026",
    audience: "นักเรียน ม.3",
    detail: "เลือกหัวข้อโครงงานเป็นกลุ่มและส่งแผนงานภายในสัปดาห์นี้",
    category: "กิจกรรม",
    priority: "ทั่วไป",
    isPinned: false,
    publishAt: "2026-03-10T08:00:00+07:00",
    expireAt: "2026-03-20T23:59:59+07:00",
  },
  {
    id: 4,
    title: "แจ้งรูปแบบข้อสอบปลายหน่วยเรื่องความน่าจะเป็น",
    date: "18 มีนาคม 2026",
    audience: "นักเรียน ม.3",
    detail:
      "ข้อสอบประกอบด้วยปรนัย 20 ข้อ และอัตนัย 2 ข้อ โปรดทบทวนแบบฝึกหัดที่ 5-7",
    category: "สอบ",
    priority: "กลาง",
    isPinned: false,
    publishAt: "2026-03-12T08:00:00+07:00",
    expireAt: "2026-03-25T23:59:59+07:00",
  },
];

export const contactChannels: ContactChannel[] = [
  {
    id: 1,
    name: "อีเมล",
    value: "phusrion@gmail.com",
    note: "เหมาะสำหรับคำถามด้านบทเรียนและเอกสาร",
  },
  {
    id: 2,
    name: "โทรศัพท์",
    value: "085-255-2966",
    note: "ติดต่อในวันจันทร์-ศุกร์ เวลา 10.00-15.00 น.",
  },
  {
    id: 3,
    name: "Line กลุ่มผู้ปกครอง",
    value: "-",
    note: "ใช้ประกาศข่าวสารและกำหนดการสำคัญ",
  },
];

export const adminTasks: AdminTask[] = [
  {
    id: 1,
    title: "ตรวจงานและสรุปผลแบบฝึกหัดล่าสุด",
    status: "pending",
    dueDate: "11 มีนาคม 2026",
  },
  {
    id: 2,
    title: "เผยแพร่ใบงานบทถัดไปสำหรับสัปดาห์หน้า",
    status: "pending",
    dueDate: "13 มีนาคม 2026",
  },
  {
    id: 3,
    title: "แจ้งกำหนดการติวเสริมก่อนสอบ",
    status: "done",
    dueDate: "8 มีนาคม 2026",
  },
];
