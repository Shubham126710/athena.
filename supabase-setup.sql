-- RESET (Optional - Be careful in production!)
-- Drop the existing table to ensure we start fresh with the correct schema
DROP TABLE IF EXISTS notes;

-- 1. Create the 'notes' table
create table notes (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  subject text not null,
  unit text not null,
  file_url text not null,
  file_path text not null
);

-- 2. Enable Row Level Security (RLS)
alter table notes enable row level security;

-- 3. Create Policy: Allow public read access to notes
create policy "Public Notes are viewable by everyone"
on notes for select
to public
using (true);

-- 4. Create Policy: Allow public insert access (For development - restrict this in production!)
create policy "Anyone can upload notes"
on notes for insert
to public
with check (true);

-- 5. Create Policy: Allow public delete access (For development)
create policy "Anyone can delete notes"
on notes for delete
to public
using (true);

-- STORAGE SETUP --

-- 6. Create a storage bucket for 'notes'
insert into storage.buckets (id, name, public)
values ('notes', 'notes', true)
on conflict (id) do nothing;

-- Drop existing storage policies to avoid conflicts
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Public Upload" on storage.objects;
drop policy if exists "Public Delete" on storage.objects;

-- 7. Storage Policy: Allow public read access
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'notes' );

-- 8. Storage Policy: Allow public upload access
create policy "Public Upload"
on storage.objects for insert
to public
with check ( bucket_id = 'notes' );

-- 9. Storage Policy: Allow public delete access
create policy "Public Delete"
on storage.objects for delete
to public
using ( bucket_id = 'notes' );
