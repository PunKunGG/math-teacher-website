create table if not exists public.documents (
  id bigint generated always as identity primary key,
  title text not null,
  category text not null,
  grade text not null default 'ม.3',
  lesson_id bigint null,
  file_type text not null,
  file_url text not null,
  updated_at timestamptz not null default now()
);

alter table public.documents
add column if not exists lesson_id bigint null;

alter table public.documents enable row level security;

drop policy if exists "public_can_read_documents" on public.documents;
create policy "public_can_read_documents"
on public.documents
for select
to anon, authenticated
using (true);

drop policy if exists "service_role_can_insert_documents" on public.documents;
create policy "service_role_can_insert_documents"
on public.documents
for insert
to service_role
with check (true);

-- Create a public storage bucket named assignments in Supabase dashboard,
-- then allow public read access for students.
