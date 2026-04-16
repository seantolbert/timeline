-- ============================================================
-- Timeline Task Tracker — Supabase Schema (no auth)
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- TASKS TABLE
-- ============================================================
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  status      text not null default 'todo'
                check (status in ('todo', 'in_progress', 'done')),
  priority    text not null default 'medium'
                check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date    date,
  completed   boolean not null default false,
  tag         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_tasks_status    on public.tasks(status);
create index if not exists idx_tasks_priority  on public.tasks(priority);
create index if not exists idx_tasks_due_date  on public.tasks(due_date);
create index if not exists idx_tasks_completed on public.tasks(completed);

-- ============================================================
-- updated_at TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_tasks_updated on public.tasks;
create trigger on_tasks_updated
  before update on public.tasks
  for each row execute function public.handle_updated_at();

-- ============================================================
-- OPEN ACCESS (no auth — anon key can read/write)
-- ============================================================
alter table public.tasks enable row level security;

drop policy if exists "Public full access" on public.tasks;
create policy "Public full access"
  on public.tasks for all
  using (true)
  with check (true);
