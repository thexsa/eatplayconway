-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users & Roles (Extends Supabase Auth)
create type user_role as enum ('admin', 'manager', 'moderator', 'public');

create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  role user_role default 'public',
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Business Listings
create type subscription_tier as enum ('free', 'basic', 'premium');
create type business_category as enum ('restaurant', 'bar', 'retail', 'service', 'nonprofit', 'community', 'arts_entertainment', 'other');

create table public.businesses (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id), -- Nullable, business might not be claimed yet
  name text not null,
  slug text not null unique,
  description text,
  category business_category not null default 'other',
  address text,
  geo_lat float,
  geo_lng float,
  social_links jsonb default '{}'::jsonb, -- { facebook: "", instagram: "", website: "" }
  subscription_tier subscription_tier default 'free',
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Scraping Configuration
create type source_type as enum ('facebook_page', 'instagram', 'website_rss', 'website_html', 'gmb', 'api_integration');
create type source_difficulty as enum ('easy', 'hard'); -- Easy = internal, Hard = external runner

create table public.scrape_sources (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade,
  source_type source_type not null,
  difficulty source_difficulty default 'easy',
  source_url text not null,
  config_json jsonb default '{}'::jsonb, -- Selectors, API keys, etc.
  frequency_hours int default 24,
  last_scraped_at timestamp with time zone,
  last_status text default 'pending', -- 'success', 'error'
  error_log text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Content (Events)
create type processing_status as enum ('raw', 'enriched', 'published', 'rejected', 'archived');
create type price_type as enum ('free', 'paid', 'ticketed');

create table public.events (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete set null,
  source_id uuid references public.scrape_sources(id) on delete set null,
  
  -- Core Data
  title text not null,
  slug text not null unique,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  
  -- AI Enriched Data
  description_raw text,
  description_summary text, -- AI generated
  categories text[], -- AI assigned tags
  ai_confidence float default 0.0,
  
  -- Details
  price_type price_type default 'free',
  price_min decimal(10,2),
  price_max decimal(10,2),
  ticket_url text,
  image_url text,
  
  -- Meta
  is_featured boolean default false,
  status processing_status default 'raw',
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Deals
create type deal_type as enum ('happy_hour', 'discount', 'bogo', 'special');

create table public.deals (
  id uuid default uuid_generate_v4() primary key,
  business_id uuid references public.businesses(id) on delete cascade,
  source_id uuid references public.scrape_sources(id) on delete set null,
  title text not null,
  description text,
  promo_code text,
  deal_type deal_type default 'special',
  valid_from timestamp with time zone,
  valid_until timestamp with time zone,
  active_days text[], -- ['Mon', 'Tue']
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Generated Content (Weekly Guides)
create table public.generated_content (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  content_markdown text,
  type text default 'weekly_guide', -- or 'blog_post'
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) Policies Stubs
-- alter table public.businesses enable row level security;
-- Policy for "Manager": can update rows where owner_id = auth.uid()
-- Policy for "Public": can select where is_verified = true etc.
