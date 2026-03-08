import type { AnnouncementItem } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ANNOUNCEMENTS_TABLE = "announcements";

type SupabaseAnnouncementRow = {
  id: number;
  title: string;
  audience: string;
  detail: string;
  category: AnnouncementItem["category"];
  priority: AnnouncementItem["priority"];
  is_pinned: boolean;
  publish_at: string;
  expire_at: string | null;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function mapRowToAnnouncement(row: SupabaseAnnouncementRow): AnnouncementItem {
  return {
    id: row.id,
    title: row.title,
    date: formatDate(row.publish_at),
    audience: row.audience,
    detail: row.detail,
    category: row.category,
    priority: row.priority,
    isPinned: row.is_pinned,
    publishAt: row.publish_at,
    expireAt: row.expire_at ?? undefined,
  };
}

export async function fetchAnnouncementsFromSupabase() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(ANNOUNCEMENTS_TABLE)
    .select(
      "id, title, audience, detail, category, priority, is_pinned, publish_at, expire_at",
    );

  if (error) {
    throw error;
  }

  return (data as SupabaseAnnouncementRow[]).map(mapRowToAnnouncement);
}

export async function createAnnouncementInSupabase(input: {
  title: string;
  audience: string;
  detail: string;
  category: AnnouncementItem["category"];
  priority: AnnouncementItem["priority"];
  isPinned: boolean;
  publishAt: string;
  expireAt?: string;
}) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(ANNOUNCEMENTS_TABLE)
    .insert({
      title: input.title,
      audience: input.audience,
      detail: input.detail,
      category: input.category,
      priority: input.priority,
      is_pinned: input.isPinned,
      publish_at: input.publishAt,
      expire_at: input.expireAt ?? null,
    })
    .select(
      "id, title, audience, detail, category, priority, is_pinned, publish_at, expire_at",
    )
    .single();

  if (error) {
    throw error;
  }

  return mapRowToAnnouncement(data as SupabaseAnnouncementRow);
}
