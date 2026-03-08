import {
  adminTasks,
  announcements,
  contactChannels,
  documents,
  lessons,
  teacherProfile,
  teachingValues,
} from "@/lib/mock-data";
import { fetchAnnouncementsFromSupabase } from "@/lib/supabase/announcements";
import { fetchDocumentsFromSupabase } from "@/lib/supabase/documents";
import { hasSupabaseConfig } from "@/lib/supabase/env";
import { fetchLessonsFromSupabase } from "@/lib/supabase/lessons";

function getActiveSortedAnnouncements(items: typeof announcements) {
  const now = new Date();

  return items
    .filter((item) => {
      const publishAt = new Date(item.publishAt);
      const expireAt = item.expireAt ? new Date(item.expireAt) : null;

      if (publishAt > now) {
        return false;
      }

      if (expireAt && expireAt < now) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }

      return new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime();
    });
}

// This service layer keeps page code clean and is ready for future Supabase queries.
export async function getTeacherProfile() {
  return teacherProfile;
}

export async function getTeachingValues() {
  return teachingValues;
}

export async function getLessons() {
  if (hasSupabaseConfig()) {
    try {
      return await fetchLessonsFromSupabase();
    } catch {
      return lessons;
    }
  }

  return lessons;
}

export async function getLessonById(id: number) {
  const items = await getLessons();
  return items.find((lesson) => lesson.id === id) ?? null;
}

export async function getLessonIds() {
  const items = await getLessons();
  return items.map((lesson) => lesson.id);
}

export async function getDocuments() {
  if (hasSupabaseConfig()) {
    try {
      return await fetchDocumentsFromSupabase();
    } catch {
      return documents;
    }
  }

  return documents;
}

export async function getDocumentsByLessonId(lessonId: number) {
  const docs = await getDocuments();
  return docs.filter((document) => document.lessonId === lessonId);
}

export async function getAnnouncements() {
  if (hasSupabaseConfig()) {
    try {
      const supabaseAnnouncements = await fetchAnnouncementsFromSupabase();
      return getActiveSortedAnnouncements(supabaseAnnouncements);
    } catch {
      return getActiveSortedAnnouncements(announcements);
    }
  }

  return getActiveSortedAnnouncements(announcements);
}

export async function getContactChannels() {
  return contactChannels;
}

export async function getAdminStats() {
  const lessonItems = await getLessons();
  const docs = await getDocuments();
  const activeAnnouncements = await getAnnouncements();

  return [
    {
      id: 1,
      label: "บทเรียนคณิตศาสตร์ ม.3",
      value: String(lessonItems.length),
    },
    { id: 2, label: "เอกสารเผยแพร่ ม.3", value: String(docs.length) },
    {
      id: 3,
      label: "ประกาศที่กำลังแสดง",
      value: String(activeAnnouncements.length),
    },
  ];
}

export async function getAdminTasks() {
  return adminTasks;
}
