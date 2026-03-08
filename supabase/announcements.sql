create table if not exists public.announcements (
  id bigint generated always as identity primary key,
  title text not null,
  audience text not null,
  detail text not null,
  category text not null,
  priority text not null,
  is_pinned boolean not null default false,
  publish_at timestamptz not null,
  expire_at timestamptz null,
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

drop policy if exists "public_can_read_announcements" on public.announcements;
create policy "public_can_read_announcements"
on public.announcements
for select
to anon, authenticated
using (true);

drop policy if exists "service_role_can_insert_announcements" on public.announcements;
create policy "service_role_can_insert_announcements"
on public.announcements
for insert
to service_role
with check (true);
