
-- Enable RLS permissions for public read access to businesses and deals

alter table businesses enable row level security;

create policy "Public businesses are viewable by everyone"
  on businesses for select
  to anon, authenticated
  using ( true );

alter table deals enable row level security;

create policy "Public deals are viewable by everyone"
  on deals for select
  to anon, authenticated
  using ( true );
