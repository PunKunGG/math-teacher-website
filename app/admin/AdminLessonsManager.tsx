"use client";

import { useMemo, useState } from "react";
import type { DocumentItem, LessonItem } from "@/lib/types";

type AdminLessonsManagerProps = {
  initialLessons: LessonItem[];
  initialDocuments: DocumentItem[];
};

type FormState = {
  title: string;
  unit: string;
  grade: string;
  summary: string;
  durationMinutes: string;
  difficulty: LessonItem["difficulty"];
  examWeight: LessonItem["examWeight"];
  isExamFocused: boolean;
  objectivesText: string;
  commonMistakesText: string;
  practiceSetsText: string;
};

type PracticeSetInput = {
  title: string;
  level: LessonItem["practiceSets"][number]["level"];
  questionCount: number;
};

const defaultForm: FormState = {
  title: "",
  unit: "",
  grade: "ม.3",
  summary: "",
  durationMinutes: "50",
  difficulty: "กลาง",
  examWeight: "กลาง",
  isExamFocused: false,
  objectivesText: "",
  commonMistakesText: "",
  practiceSetsText: "",
};

function createFormFromLesson(lesson: LessonItem): FormState {
  const practiceSetsText = lesson.practiceSets
    .map((set) => `${set.title} | ${set.level} | ${set.questionCount}`)
    .join("\n");

  return {
    title: lesson.title,
    unit: lesson.unit,
    grade: lesson.grade,
    summary: lesson.summary,
    durationMinutes: String(lesson.durationMinutes),
    difficulty: lesson.difficulty,
    examWeight: lesson.examWeight,
    isExamFocused: lesson.isExamFocused,
    objectivesText: lesson.objectives.join("\n"),
    commonMistakesText: lesson.commonMistakes.join("\n"),
    practiceSetsText,
  };
}

function normalizeLineList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parsePracticeSets(value: string) {
  const lines = normalizeLineList(value);
  const parsed: PracticeSetInput[] = [];

  for (const line of lines) {
    const parts = line.split("|").map((item) => item.trim());

    if (parts.length !== 3) {
      return {
        error:
          "รูปแบบชุดแบบฝึกหัดไม่ถูกต้อง กรุณาใช้รูปแบบ ชื่อชุด | ระดับ | จำนวนข้อ",
      };
    }

    const [title, level, questionCountText] = parts;
    if (!title) {
      return { error: "กรุณาระบุชื่อชุดแบบฝึกหัดให้ครบถ้วน" };
    }

    if (level !== "ง่าย" && level !== "กลาง" && level !== "ยาก") {
      return {
        error: "ระดับของชุดแบบฝึกหัดต้องเป็น ง่าย, กลาง หรือ ยาก",
      };
    }

    const questionCount = Number(questionCountText);
    if (!Number.isInteger(questionCount) || questionCount <= 0) {
      return { error: "จำนวนข้อของชุดแบบฝึกหัดต้องเป็นเลขจำนวนเต็มมากกว่า 0" };
    }

    parsed.push({ title, level, questionCount });
  }

  if (parsed.length === 0) {
    return { error: "กรุณาเพิ่มชุดแบบฝึกหัดอย่างน้อย 1 รายการ" };
  }

  return { data: parsed };
}

function buildPayload(form: FormState) {
  const title = form.title.trim();
  const unit = form.unit.trim();
  const grade = form.grade.trim();
  const summary = form.summary.trim();
  const durationMinutes = Number(form.durationMinutes);
  const objectives = normalizeLineList(form.objectivesText);
  const commonMistakes = normalizeLineList(form.commonMistakesText);

  if (!title || !unit || !grade || !summary) {
    return { error: "กรุณากรอกข้อมูลบทเรียนให้ครบถ้วน" };
  }

  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    return { error: "เวลาเรียนต้องเป็นเลขจำนวนเต็มมากกว่า 0" };
  }

  if (objectives.length === 0) {
    return { error: "กรุณาเพิ่มจุดประสงค์การเรียนรู้อย่างน้อย 1 ข้อ" };
  }

  if (commonMistakes.length === 0) {
    return { error: "กรุณาเพิ่มข้อควรระวังอย่างน้อย 1 ข้อ" };
  }

  const parsedPracticeSets = parsePracticeSets(form.practiceSetsText);
  if (parsedPracticeSets.error) {
    return { error: parsedPracticeSets.error };
  }

  const practiceSets = parsedPracticeSets.data!.map((item, index) => ({
    id: index + 1,
    title: item.title,
    level: item.level,
    questionCount: item.questionCount,
  }));

  return {
    data: {
      title,
      unit,
      grade,
      summary,
      durationMinutes,
      difficulty: form.difficulty,
      examWeight: form.examWeight,
      isExamFocused: form.isExamFocused,
      objectives,
      commonMistakes,
      practiceSets,
    },
  };
}

function sortLessons(items: LessonItem[]) {
  return [...items].sort((a, b) => a.id - b.id);
}

function LessonsFormFields({
  form,
  disabled,
  onChange,
}: {
  form: FormState;
  disabled: boolean;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">
            ชื่อบทเรียน
          </label>
          <input
            value={form.title}
            onChange={(event) => onChange("title", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">
            หน่วยการเรียน
          </label>
          <input
            value={form.unit}
            onChange={(event) => onChange("unit", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="เช่น พีชคณิต"
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">
          สรุปบทเรียน
        </label>
        <textarea
          rows={3}
          value={form.summary}
          onChange={(event) => onChange("summary", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          disabled={disabled}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">
            ระดับชั้น
          </label>
          <input
            value={form.grade}
            onChange={(event) => onChange("grade", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">
            เวลาเรียน (นาที)
          </label>
          <input
            type="number"
            min={1}
            value={form.durationMinutes}
            onChange={(event) =>
              onChange("durationMinutes", event.target.value)
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">
            ความยาก
          </label>
          <select
            value={form.difficulty}
            onChange={(event) =>
              onChange(
                "difficulty",
                event.target.value as FormState["difficulty"],
              )
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled={disabled}
          >
            <option value="พื้นฐาน">พื้นฐาน</option>
            <option value="กลาง">กลาง</option>
            <option value="เข้มข้น">เข้มข้น</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">
            น้ำหนักข้อสอบ
          </label>
          <select
            value={form.examWeight}
            onChange={(event) =>
              onChange(
                "examWeight",
                event.target.value as FormState["examWeight"],
              )
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled={disabled}
          >
            <option value="สูง">สูง</option>
            <option value="กลาง">กลาง</option>
            <option value="ต่ำ">ต่ำ</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={form.isExamFocused}
          onChange={(event) => onChange("isExamFocused", event.target.checked)}
          disabled={disabled}
        />
        ทำเครื่องหมายว่าเป็นบทที่เน้นออกสอบ
      </label>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">
          จุดประสงค์การเรียนรู้ (1 บรรทัดต่อ 1 ข้อ)
        </label>
        <textarea
          rows={4}
          value={form.objectivesText}
          onChange={(event) => onChange("objectivesText", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">
          ข้อควรระวังที่พลาดบ่อย (1 บรรทัดต่อ 1 ข้อ)
        </label>
        <textarea
          rows={4}
          value={form.commonMistakesText}
          onChange={(event) =>
            onChange("commonMistakesText", event.target.value)
          }
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          disabled={disabled}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800">
          ชุดแบบฝึกหัด (รูปแบบ: ชื่อชุด | ระดับ | จำนวนข้อ)
        </label>
        <textarea
          rows={5}
          value={form.practiceSetsText}
          onChange={(event) => onChange("practiceSetsText", event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder="ฝึกแยกตัวประกอบ | ง่าย | 10"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default function AdminLessonsManager({
  initialLessons,
  initialDocuments,
}: AdminLessonsManagerProps) {
  const [lessons, setLessons] = useState(sortLessons(initialLessons));
  const [documents, setDocuments] = useState(initialDocuments);
  const [createForm, setCreateForm] = useState<FormState>(defaultForm);
  const [createLessonFile, setCreateLessonFile] = useState<File | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<LessonItem | null>(null);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deletingDocumentId, setDeletingDocumentId] = useState<number | null>(
    null,
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const editingLesson = useMemo(
    () => lessons.find((item) => item.id === editingLessonId) ?? null,
    [editingLessonId, lessons],
  );

  function updateCreateField<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
    setError("");
    setSuccess("");
  }

  function updateEditField<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setEditForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setError("");
    setSuccess("");
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = buildPayload(createForm);
    if (payload.error) {
      setError(payload.error);
      return;
    }

    setIsSubmittingCreate(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.data),
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
        lesson?: LessonItem;
      };

      if (!response.ok || !result.success || !result.lesson) {
        setError(result.message ?? "เพิ่มบทเรียนไม่สำเร็จ");
        return;
      }

      if (createLessonFile) {
        const fileFormData = new FormData();
        fileFormData.set("title", `เอกสารประกอบ: ${result.lesson.title}`);
        fileFormData.set("category", "เอกสารประกอบบทเรียน");
        fileFormData.set("grade", result.lesson.grade);
        fileFormData.set("lessonId", String(result.lesson.id));
        fileFormData.set("file", createLessonFile);

        const documentResponse = await fetch("/api/admin/documents", {
          method: "POST",
          body: fileFormData,
        });

        const documentResult = (await documentResponse.json()) as {
          success: boolean;
          message?: string;
          document?: DocumentItem;
        };

        if (!documentResponse.ok || !documentResult.success) {
          setLessons((prev) => sortLessons([...prev, result.lesson!]));
          setCreateForm(defaultForm);
          setCreateLessonFile(null);
          setError(
            documentResult.message ??
              "เพิ่มบทเรียนสำเร็จ แต่แนบไฟล์ไม่สำเร็จ กรุณาอัปโหลดเอกสารแยกอีกครั้ง",
          );
          return;
        }

        if (documentResult.document) {
          setDocuments((prev) => [documentResult.document!, ...prev]);
        }
      }

      setLessons((prev) => sortLessons([...prev, result.lesson!]));
      setCreateForm(defaultForm);
      setCreateLessonFile(null);
      setSuccess(
        createLessonFile
          ? "เพิ่มบทเรียนและแนบไฟล์เรียบร้อยแล้ว"
          : "เพิ่มบทเรียนเรียบร้อยแล้ว",
      );
    } catch {
      setError("เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setIsSubmittingCreate(false);
    }
  }

  function openEditLesson(lesson: LessonItem) {
    setEditingLessonId(lesson.id);
    setEditForm(createFormFromLesson(lesson));
    setError("");
    setSuccess("");
  }

  function closeEditLesson() {
    if (isSubmittingEdit) {
      return;
    }

    setEditingLessonId(null);
    setEditForm(null);
  }

  async function saveEditLesson() {
    if (!editingLesson || !editForm) {
      return;
    }

    const payload = buildPayload(editForm);
    if (payload.error) {
      setError(payload.error);
      return;
    }

    setIsSubmittingEdit(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/lessons/${editingLesson.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.data),
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
        lesson?: LessonItem;
      };

      if (!response.ok || !result.success || !result.lesson) {
        setError(result.message ?? "อัปเดตบทเรียนไม่สำเร็จ");
        return;
      }

      setLessons((prev) =>
        sortLessons(
          prev.map((item) =>
            item.id === editingLesson.id ? result.lesson! : item,
          ),
        ),
      );
      setSuccess("อัปเดตบทเรียนเรียบร้อยแล้ว");
      setEditingLessonId(null);
      setEditForm(null);
    } catch {
      setError("เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setIsSubmittingEdit(false);
    }
  }

  async function confirmDeleteLesson() {
    if (!deletingLesson) {
      return;
    }

    setDeletingId(deletingLesson.id);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/lessons/${deletingLesson.id}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        setError(result.message ?? "ลบบทเรียนไม่สำเร็จ");
        return;
      }

      setLessons((prev) =>
        prev.filter((item) => item.id !== deletingLesson.id),
      );
      setSuccess("ลบบทเรียนเรียบร้อยแล้ว");
      setDeletingLesson(null);
    } catch {
      setError("เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setDeletingId(null);
    }
  }

  async function deleteLessonDocument(documentId: number) {
    setDeletingDocumentId(documentId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/documents/${documentId}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        setError(result.message ?? "ลบเอกสารที่ผูกกับบทเรียนไม่สำเร็จ");
        return;
      }

      setDocuments((prev) => prev.filter((item) => item.id !== documentId));
      setSuccess("ลบเอกสารที่ผูกกับบทเรียนเรียบร้อยแล้ว");
    } catch {
      setError("เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setDeletingDocumentId(null);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="space-y-4" noValidate>
        <LessonsFormFields
          form={createForm}
          disabled={isSubmittingCreate}
          onChange={updateCreateField}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-800">
            ไฟล์เอกสารประกอบบทเรียน (ไม่บังคับ)
          </label>
          <input
            type="file"
            onChange={(event) =>
              setCreateLessonFile(event.target.files?.[0] ?? null)
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            disabled={isSubmittingCreate}
          />
          <p className="mt-1 text-xs text-slate-500">
            หากเลือกไฟล์
            ระบบจะอัปโหลดเข้าหน้าเอกสารให้โดยอัตโนมัติหลังสร้างบทเรียน
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmittingCreate}
          className="rounded-md border border-slate-400 bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          {isSubmittingCreate ? "กำลังเพิ่มบทเรียน..." : "เพิ่มบทเรียน"}
        </button>
      </form>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}

      <div className="space-y-3">
        {lessons.length === 0 ? (
          <p className="text-sm text-slate-600">ยังไม่มีบทเรียนในระบบ</p>
        ) : (
          <ul className="space-y-3">
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium text-slate-900">{lesson.title}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {lesson.unit} | {lesson.grade} | {lesson.duration} | อัปเดต{" "}
                    {lesson.updatedAt}
                  </p>
                  {documents.filter(
                    (document) => document.lessonId === lesson.id,
                  ).length > 0 ? (
                    <ul className="mt-2 space-y-1">
                      {documents
                        .filter((document) => document.lessonId === lesson.id)
                        .map((document) => (
                          <li
                            key={document.id}
                            className="flex items-center gap-2 text-xs text-slate-600"
                          >
                            <span>
                              เอกสาร: {document.title} ({document.fileType})
                            </span>
                            <button
                              type="button"
                              onClick={() => deleteLessonDocument(document.id)}
                              disabled={deletingDocumentId === document.id}
                              className="rounded border border-red-200 px-2 py-0.5 text-red-700 hover:bg-red-50"
                            >
                              {deletingDocumentId === document.id
                                ? "กำลังลบ..."
                                : "ลบเอกสาร"}
                            </button>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">
                      ยังไม่มีเอกสารที่ผูกกับบทเรียนนี้
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditLesson(lesson)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    แก้ไข
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingLesson(lesson)}
                    disabled={deletingId === lesson.id}
                    className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
                  >
                    {deletingId === lesson.id ? "กำลังลบ..." : "ลบ"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editingLesson && editForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-full w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900">
              แก้ไขบทเรียน: {editingLesson.title}
            </h3>
            <div className="mt-4">
              <LessonsFormFields
                form={editForm}
                disabled={isSubmittingEdit}
                onChange={updateEditField}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEditLesson}
                disabled={isSubmittingEdit}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={saveEditLesson}
                disabled={isSubmittingEdit}
                className="rounded-md border border-slate-400 bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
              >
                {isSubmittingEdit ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deletingLesson ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900">
              ยืนยันการลบบทเรียน
            </h3>
            <p className="mt-2 text-sm text-slate-700">
              ต้องการลบบทเรียน &quot;{deletingLesson.title}&quot; ใช่หรือไม่?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingLesson(null)}
                disabled={deletingId !== null}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={confirmDeleteLesson}
                disabled={deletingId !== null}
                className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
              >
                {deletingId !== null ? "กำลังลบ..." : "ยืนยันการลบ"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
