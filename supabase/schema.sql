create table if not exists public.documents (
  id bigint generated always as identity primary key,
  title text not null,
  category text not null,
  grade text not null default 'ม.3',
  file_type text not null,
  file_url text not null,
  updated_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "public_can_read_documents"
on public.documents
for select
to anon, authenticated
using (true);

create policy "service_role_can_insert_documents"
on public.documents
for insert
to service_role
with check (true);

-- Create a public storage bucket named assignments in Supabase dashboard,
-- then allow public read access for students.
