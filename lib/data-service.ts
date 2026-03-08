import {
  adminStats,
  adminTasks,
  announcements,
  contactChannels,
  documents,
  lessons,
  teacherProfile,
  teachingValues,
} from "@/lib/mock-data";

// This service layer keeps page code clean and is ready for future Supabase queries.
export async function getTeacherProfile() {
  return teacherProfile;
}

export async function getTeachingValues() {
  return teachingValues;
}

export async function getLessons() {
  return lessons;
}

export async function getLessonById(id: number) {
  return lessons.find((lesson) => lesson.id === id) ?? null;
}

export async function getLessonIds() {
  return lessons.map((lesson) => lesson.id);
}

export async function getDocuments() {
  return documents;
}

export async function getAnnouncements() {
  return announcements;
}

export async function getContactChannels() {
  return contactChannels;
}

export async function getAdminStats() {
  return adminStats;
}

export async function getAdminTasks() {
  return adminTasks;
}
