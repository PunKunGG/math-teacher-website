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
  grade: string;
  summary: string;
  duration: string;
  updatedAt: string;
  objectives: string[];
};

export type DocumentItem = {
  id: number;
  title: string;
  category: string;
  updatedAt: string;
  fileType: string;
};

export type AnnouncementItem = {
  id: number;
  title: string;
  date: string;
  audience: string;
  detail: string;
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
