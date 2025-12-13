
-- Add missing columns for Eat section features

alter table businesses 
add column if not exists menu_url text,
add column if not exists social_links jsonb default '{}'::jsonb,
add column if not exists category text;
