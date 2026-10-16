-- ==========================================================
-- FINANCIAL RHYTHM — SUPABASE POSTGRESQL SCHEMA
-- Copy and run this in your Supabase Project -> SQL Editor
-- ==========================================================

-- 1. Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text default 'Alex',
  currency text default '$',
  monthly_budget numeric(10, 2) default 800.00,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Create subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  cost numeric(10, 2) not null,
  billing_cycle text default 'monthly',
  next_billing_date text not null,
  icon_type text default 'custom',
  is_paused boolean default false,
  notes text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;

-- 4. Policies: users can only view and modify their own data
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can insert own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can update own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id or user_id is null);

create policy "Users can delete own subscriptions"
  on public.subscriptions for delete
  using (auth.uid() = user_id or user_id is null);

-- 5. Auto-create profile trigger on auth.users sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Pre-seed initial subscriptions (available for demo)
insert into public.subscriptions (name, category, cost, billing_cycle, next_billing_date, icon_type, is_paused)
values
  ('Netflix', 'Entertainment', 15.99, 'monthly', 'Apr 12', 'netflix', false),
  ('Figma', 'Design Tool', 12.00, 'monthly', 'Apr 14', 'figma', false),
  ('Spotify', 'Entertainment', 10.99, 'monthly', 'Apr 18', 'spotify', false),
  ('Dropbox', 'Cloud Storage', 11.99, 'monthly', 'Apr 20', 'dropbox', false),
  ('Notion', 'Productivity', 10.00, 'monthly', 'Apr 22', 'notion', false)
on conflict do nothing;
