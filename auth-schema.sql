-- Run this in your Supabase SQL Editor

-- 0. Drop existing table if it exists (to fix "relation already exists" error)
drop table if exists profiles;

-- 1. Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  uid text,
  gender text,
  role text default 'student', -- 'admin' or 'student'
  section text,
  avatar_seed text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- 3. Create Policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  to public
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- 4. Create a trigger to automatically create a profile entry when a new user signs up
-- This bypasses RLS because it runs as a system trigger

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, uid, gender, role, section, avatar_seed)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'uid',
    new.raw_user_meta_data->>'gender',
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'section',
    new.raw_user_meta_data->>'avatar_seed'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop the trigger if it already exists to avoid errors
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
