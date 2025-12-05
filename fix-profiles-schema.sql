-- Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS section text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_seed text;

-- Update the handle_new_user function to include these new columns
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
