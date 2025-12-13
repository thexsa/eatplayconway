
-- Add hours column to businesses table
alter table businesses 
add column if not exists hours jsonb default '{}'::jsonb;
