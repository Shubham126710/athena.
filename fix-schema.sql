-- Drop the existing table to ensure we start fresh with the correct schema
DROP TABLE IF EXISTS notes;

-- Recreate the 'notes' table with all required columns
create table notes (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  subject text not null,
  unit text not null,
  file_url text not null,
  file_path text not null
);

-- Enable Row Level Security (RLS)
alter table notes enable row level security;

-- Re-create Policies
create policy "Public Notes are viewable by everyone"
on notes for select
to public
using (true);

create policy "Anyone can upload notes"
on notes for insert
to public
with check (true);

create policy "Anyone can delete notes"
on notes for delete
to public
using (true);
