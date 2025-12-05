-- Create notifications table
create table if not exists notifications (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  message text not null,
  type text default 'info' -- 'alert', 'info', 'warning'
);

-- Enable RLS
alter table notifications enable row level security;

-- Policy: Everyone can read
create policy "Everyone can read notifications"
  on notifications for select
  to public
  using (true);

-- Policy: Only admins can insert
-- Note: This assumes the profiles table exists and has a 'role' column
create policy "Admins can insert notifications"
  on notifications for insert
  to authenticated
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Insert initial data
insert into notifications (title, message, type) values 
('Welcome to Athena', 'Thank you for trying out the platform! Your centralized academic hub is ready. Manage your timetable, track attendance, and access resources seamlessly.', 'info'),
('Domain Camp: Dec 10 - 16', 'Prepare for an immersive week of domain-specific training. Check your updated timetable for details.', 'alert'),
('Winning Camp: Dec 17 - 24', 'The final sprint begins soon. Join the Winning Camp for DCPD classes to maximize your performance before the break.', 'alert');
