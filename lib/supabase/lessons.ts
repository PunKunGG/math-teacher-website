import type { LessonItem } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const LESSONS_TABLE = "lessons";

type SupabasePracticeSetRow = {
  id: number;
  title: string;
  level: LessonItem["practiceSets"][number]["level"];
  questionCount: number;
};

type SupabaseLessonRow = {
  id: number;
  title: string;
  unit: string;
  grade: string;
  summary: string;
  duration_minutes: number;
  updated_at: string;
  difficulty: LessonItem["difficulty"];
  exam_weight: LessonItem["examWeight"];
  is_exam_focused: boolean;
  objectives: string[];
  common_mistakes: string[];
  practice_sets: SupabasePracticeSetRow[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function mapRowToLesson(row: SupabaseLessonRow): LessonItem {
  return {
    id: row.id,
    title: row.title,
    unit: row.unit,
    grade: row.grade,
    summary: row.summary,
    durationMinutes: row.duration_minutes,
    duration: `${row.duration_minutes} นาที`,
    updatedAt: formatDate(row.updated_at),
    difficulty: row.difficulty,
    examWeight: row.exam_weight,
    isExamFocused: row.is_exam_focused,
    objectives: row.objectives,
    commonMistakes: row.common_mistakes,
    practiceSets: row.practice_sets,
  };
}

function getLessonsSelectQuery() {
  return [
    "id",
    "title",
    "unit",
    "grade",
    "summary",
    "duration_minutes",
    "updated_at",
    "difficulty",
    "exam_weight",
    "is_exam_focused",
    "objectives",
    "common_mistakes",
    "practice_sets",
  ].join(", ");
}

export async function fetchLessonsFromSupabase() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(LESSONS_TABLE)
    .select(getLessonsSelectQuery())
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data as unknown as SupabaseLessonRow[]).map(mapRowToLesson);
}

export async function createLessonInSupabase(input: {
  title: string;
  unit: string;
  grade: string;
  summary: string;
  durationMinutes: number;
  difficulty: LessonItem["difficulty"];
  examWeight: LessonItem["examWeight"];
  isExamFocused: boolean;
  objectives: string[];
  commonMistakes: string[];
  practiceSets: LessonItem["practiceSets"];
}) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(LESSONS_TABLE)
    .insert({
      title: input.title,
      unit: input.unit,
      grade: input.grade,
      summary: input.summary,
      duration_minutes: input.durationMinutes,
      updated_at: new Date().toISOString(),
      difficulty: input.difficulty,
      exam_weight: input.examWeight,
      is_exam_focused: input.isExamFocused,
      objectives: input.objectives,
      common_mistakes: input.commonMistakes,
      practice_sets: input.practiceSets,
    })
    .select(getLessonsSelectQuery())
    .single();

  if (error) {
    throw error;
  }

  return mapRowToLesson(data as unknown as SupabaseLessonRow);
}

export async function updateLessonInSupabase(
  id: number,
  input: {
    title: string;
    unit: string;
    grade: string;
    summary: string;
    durationMinutes: number;
    difficulty: LessonItem["difficulty"];
    examWeight: LessonItem["examWeight"];
    isExamFocused: boolean;
    objectives: string[];
    commonMistakes: string[];
    practiceSets: LessonItem["practiceSets"];
  },
) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from(LESSONS_TABLE)
    .update({
      title: input.title,
      unit: input.unit,
      grade: input.grade,
      summary: input.summary,
      duration_minutes: input.durationMinutes,
      updated_at: new Date().toISOString(),
      difficulty: input.difficulty,
      exam_weight: input.examWeight,
      is_exam_focused: input.isExamFocused,
      objectives: input.objectives,
      common_mistakes: input.commonMistakes,
      practice_sets: input.practiceSets,
    })
    .eq("id", id)
    .select(getLessonsSelectQuery())
    .single();

  if (error) {
    throw error;
  }

  return mapRowToLesson(data as unknown as SupabaseLessonRow);
}

export async function deleteLessonFromSupabase(id: number) {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from(LESSONS_TABLE).delete().eq("id", id);

  if (error) {
    throw error;
  }
}
