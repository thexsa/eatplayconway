-- 1. Ensure Profile Trigger is Correct
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

-- 2. Repair All RLS Policies with Safe Syntax
-- PROFILES
alter table public.profiles enable row level security;
drop policy if exists "Users can manage own profile" on public.profiles;
create policy "Users can manage own profile" on public.profiles
  for all using (auth.uid() = id);

-- BUSINESSES
alter table public.businesses enable row level security;
drop policy if exists "Public read businesses" on public.businesses;
create policy "Public read businesses" on public.businesses for select using (true);
drop policy if exists "Owners can manage own business" on public.businesses;
create policy "Owners can manage own business" on public.businesses
  for all using (auth.uid() = owner_id);

-- EVENTS
alter table public.events enable row level security;
drop policy if exists "Public read published events" on public.events;
create policy "Public read published events" on public.events for select 
  using (status = 'published');

drop policy if exists "Owners can manage own events" on public.events;
create policy "Owners can manage own events" on public.events
  for all using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );

-- DEALS
alter table public.deals enable row level security;
drop policy if exists "Public read active deals" on public.deals;
create policy "Public read active deals" on public.deals for select 
  using (is_active = true);

drop policy if exists "Owners can manage own deals" on public.deals;
create policy "Owners can manage own deals" on public.deals
  for all using (
    business_id in (select id from businesses where owner_id = auth.uid())
  );
