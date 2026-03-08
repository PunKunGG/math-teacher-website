create table if not exists public.lessons (
  id bigint generated always as identity primary key,
  title text not null,
  unit text not null,
  grade text not null default 'ม.3',
  summary text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  updated_at timestamptz not null default now(),
  difficulty text not null check (difficulty in ('พื้นฐาน', 'กลาง', 'เข้มข้น')),
  exam_weight text not null check (exam_weight in ('สูง', 'กลาง', 'ต่ำ')),
  is_exam_focused boolean not null default false,
  objectives jsonb not null default '[]'::jsonb,
  common_mistakes jsonb not null default '[]'::jsonb,
  practice_sets jsonb not null default '[]'::jsonb
);

alter table public.lessons enable row level security;

drop policy if exists "public_can_read_lessons" on public.lessons;
create policy "public_can_read_lessons"
on public.lessons
for select
to anon, authenticated
using (true);

drop policy if exists "service_role_can_insert_lessons" on public.lessons;
create policy "service_role_can_insert_lessons"
on public.lessons
for insert
to service_role
with check (true);

drop policy if exists "service_role_can_update_lessons" on public.lessons;
create policy "service_role_can_update_lessons"
on public.lessons
for update
to service_role
using (true)
with check (true);

drop policy if exists "service_role_can_delete_lessons" on public.lessons;
create policy "service_role_can_delete_lessons"
on public.lessons
for delete
to service_role
using (true);

alter table if exists public.documents
add column if not exists lesson_id bigint null;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'documents'
  ) and not exists (
    select 1
    from pg_constraint
    where conname = 'documents_lesson_id_fkey'
  ) then
    alter table public.documents
    add constraint documents_lesson_id_fkey
    foreign key (lesson_id)
    references public.lessons(id)
    on delete set null;
  end if;
end
$$;

create index if not exists documents_lesson_id_idx
on public.documents (lesson_id);
