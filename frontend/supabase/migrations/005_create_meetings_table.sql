-- Meetings: stores scheduled meeting requests between users and property dealers
create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null,
  status text not null default 'pending',
  message text,
  webhook_response jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_meetings_user
  on public.meetings (user_id, created_at desc);

create index if not exists idx_meetings_property
  on public.meetings (property_id);

alter table public.meetings enable row level security;

create policy "meetings owner read" on public.meetings
  for select
  using (auth.uid() = user_id);

create policy "meetings owner insert" on public.meetings
  for insert
  with check (auth.uid() = user_id);

create policy "meetings owner update" on public.meetings
  for update
  using (auth.uid() = user_id);

create policy "meetings owner delete" on public.meetings
  for delete
  using (auth.uid() = user_id);
