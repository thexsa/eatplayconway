-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Users) - Create types if not exist
do $$ begin
    create type user_role as enum ('admin', 'manager', 'user');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role user_role default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. BUSINESSES
create table if not exists public.businesses (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id),
  name text not null,
  slug text unique not null,
  description text,
  address text,
  website_url text,
  subscription_tier text check (subscription_tier in ('free', 'basic', 'premium')) default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. SCRAPE SOURCES (Where we get events)
create table if not exists public.scrape_sources (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id),
  name text not null,
  source_type text not null, -- 'facebook_page', 'website_rss', etc.
  source_url text not null,
  difficulty text check (difficulty in ('easy', 'hard')) default 'easy',
  frequency_hours int default 24,
  last_scraped_at timestamp with time zone,
  last_status text, -- 'success', 'error'
  error_log text,
  is_active boolean default true,
  config_json jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. EVENTS
create table if not exists public.events (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id),
  source_id uuid references public.scrape_sources(id),
  title text not null,
  slug text unique not null,
  description_raw text,
  description_summary text, -- AI Generated
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  price_min numeric,
  price_max numeric,
  currency text default 'USD',
  image_url text,
  categories text[], 
  is_family_friendly boolean default false,
  ai_confidence numeric default 0,
  status text check (status in ('raw', 'draft', 'published', 'rejected')) default 'raw',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. DEALS
create table if not exists public.deals (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id),
  title text not null,
  description text,
  deal_type text, -- 'happy_hour', 'lunch_special', 'coupon'
  days_active text[], -- ['Mon', 'Tue']
  start_time time,
  end_time time,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. GENERATED CONTENT (Weekly Guides)
create table if not exists public.generated_content (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content text not null, -- Markdown/HTML
  type text not null, -- 'weekly_guide', 'social_post'
  status text default 'draft',
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Simplified for MVP Verification)
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.scrape_sources enable row level security;
alter table public.events enable row level security;
alter table public.deals enable row level security;
alter table public.generated_content enable row level security;

-- Allow public read/write access (Development only logic)
drop policy if exists "Public Access" on public.scrape_sources;
create policy "Public Access" on public.scrape_sources for all using (true) with check (true);

drop policy if exists "Public Access Events" on public.events;
create policy "Public Access Events" on public.events for all using (true) with check (true);

drop policy if exists "Public Access Generated" on public.generated_content;
create policy "Public Access Generated" on public.generated_content for all using (true) with check (true);
