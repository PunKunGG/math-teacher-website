export type TeacherProfile = {
  name: string;
  role: string;
  intro: string;
  experienceYears: number;
  email: string;
};

export type TeachingValue = {
  id: number;
  title: string;
  detail: string;
};

export type LessonItem = {
  id: number;
  title: string;
  unit: string;
  grade: string;
  summary: string;
  durationMinutes: number;
  duration: string;
  updatedAt: string;
  difficulty: "พื้นฐาน" | "กลาง" | "เข้มข้น";
  examWeight: "สูง" | "กลาง" | "ต่ำ";
  isExamFocused: boolean;
  objectives: string[];
  commonMistakes: string[];
  practiceSets: Array<{
    id: number;
    title: string;
    level: "ง่าย" | "กลาง" | "ยาก";
    questionCount: number;
  }>;
};

export type DocumentItem = {
  id: number;
  title: string;
  category: string;
  grade: string;
  lessonId?: number;
  updatedAt: string;
  fileType: string;
  fileUrl?: string;
};

export type AnnouncementItem = {
  id: number;
  title: string;
  date: string;
  audience: string;
  detail: string;
  category: "การบ้าน" | "สอบ" | "กิจกรรม" | "ทั่วไป";
  priority: "สูง" | "กลาง" | "ทั่วไป";
  isPinned: boolean;
  publishAt: string;
  expireAt?: string;
};

export type ContactChannel = {
  id: number;
  name: string;
  value: string;
  note: string;
};

export type AdminStat = {
  id: number;
  label: string;
  value: string;
};

export type AdminTask = {
  id: number;
  title: string;
  status: "pending" | "done";
  dueDate: string;
};
