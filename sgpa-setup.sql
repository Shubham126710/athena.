-- Create the 'sgpa_history' table
create table if not exists sgpa_history (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  semester_name text,
  sgpa numeric,
  total_credits numeric,
  grade_points numeric
);

-- Enable Row Level Security (RLS)
alter table sgpa_history enable row level security;

-- Create Policies
create policy "Users can view their own sgpa history" 
on sgpa_history for select 
using (auth.uid() = user_id);

create policy "Users can insert their own sgpa history" 
on sgpa_history for insert 
with check (auth.uid() = user_id);

create policy "Users can delete their own sgpa history" 
on sgpa_history for delete 
using (auth.uid() = user_id);
