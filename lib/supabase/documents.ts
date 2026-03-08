import type { DocumentItem } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DOCUMENTS_TABLE = "documents";
const ASSIGNMENTS_BUCKET = "assignments";

type SupabaseDocumentRow = {
  id: number;
  title: string;
  category: string;
  grade: string | null;
  lesson_id: number | null;
  file_type: string;
  file_url: string;
  updated_at: string;
};

function mapRowToDocument(row: SupabaseDocumentRow): DocumentItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    grade: row.grade ?? "ม.3",
    lessonId: row.lesson_id ?? undefined,
    updatedAt: formatDate(row.updated_at),
    fileType: row.file_type,
    fileUrl: row.file_url,
  };
}

function extractStoragePathFromPublicUrl(fileUrl: string) {
  try {
    const url = new URL(fileUrl);
    const marker = `/${ASSIGNMENTS_BUCKET}/`;
    const index = url.pathname.indexOf(marker);

    if (index < 0) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function fetchDocumentsFromSupabase(): Promise<DocumentItem[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(DOCUMENTS_TABLE)
    .select(
      "id, title, category, grade, lesson_id, file_type, file_url, updated_at",
    )
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as SupabaseDocumentRow[]).map(mapRowToDocument);
}

export async function getDocumentByIdFromSupabase(id: number) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(DOCUMENTS_TABLE)
    .select(
      "id, title, category, grade, lesson_id, file_type, file_url, updated_at",
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return mapRowToDocument(data as SupabaseDocumentRow);
}

export async function uploadDocumentToSupabase(input: {
  title: string;
  category: string;
  grade: string;
  lessonId?: number;
  file: File;
}) {
  const supabase = createSupabaseServerClient();

  const sanitizedName = input.file.name.replace(/\s+/g, "-");
  const filePath = `${Date.now()}-${sanitizedName}`;

  const uploadResult = await supabase.storage
    .from(ASSIGNMENTS_BUCKET)
    .upload(filePath, input.file, {
      cacheControl: "3600",
      upsert: false,
      contentType: input.file.type || undefined,
    });

  if (uploadResult.error) {
    throw uploadResult.error;
  }

  const publicUrlResult = supabase.storage
    .from(ASSIGNMENTS_BUCKET)
    .getPublicUrl(filePath);

  const fileUrl = publicUrlResult.data.publicUrl;

  const insertResult = await supabase
    .from(DOCUMENTS_TABLE)
    .insert({
      title: input.title,
      category: input.category,
      grade: input.grade,
      lesson_id: input.lessonId ?? null,
      file_type: input.file.type || "application/octet-stream",
      file_url: fileUrl,
      updated_at: new Date().toISOString(),
    })
    .select(
      "id, title, category, grade, lesson_id, file_type, file_url, updated_at",
    )
    .single();

  if (insertResult.error) {
    throw insertResult.error;
  }

  const row = insertResult.data as SupabaseDocumentRow;

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    grade: row.grade ?? "ม.3",
    lessonId: row.lesson_id ?? undefined,
    updatedAt: formatDate(row.updated_at),
    fileType: row.file_type,
    fileUrl: row.file_url,
  } satisfies DocumentItem;
}

export async function deleteDocumentFromSupabase(id: number) {
  const supabase = createSupabaseServerClient();
  const document = await getDocumentByIdFromSupabase(id);

  const storagePath = document.fileUrl
    ? extractStoragePathFromPublicUrl(document.fileUrl)
    : null;

  if (storagePath) {
    const removeResult = await supabase.storage
      .from(ASSIGNMENTS_BUCKET)
      .remove([storagePath]);

    if (removeResult.error) {
      throw removeResult.error;
    }
  }

  const deleteResult = await supabase
    .from(DOCUMENTS_TABLE)
    .delete()
    .eq("id", id);

  if (deleteResult.error) {
    throw deleteResult.error;
  }

  return document;
}
