-- Enable PostGIS for geo queries (Supabase installs extensions in the extensions schema)
create extension if not exists postgis schema extensions;

-- Make PostGIS types available without schema-qualifying
set search_path to public, extensions;

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- MARKETS
-- ============================================================

create table public.markets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  location geography(point, 4326) not null,
  radius_km numeric not null default 50,
  created_at timestamptz not null default now()
);

-- ============================================================
-- CATEGORIES
-- ============================================================

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ATTRIBUTE TAGS (per category)
-- ============================================================

create table public.attribute_tags (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  label text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (category_id, label)
);

create index idx_attribute_tags_category on public.attribute_tags(category_id);

-- ============================================================
-- RESTAURANTS
-- ============================================================

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references public.markets(id),
  name text not null,
  address_line text not null,
  city text not null,
  state text not null,
  zip text not null,
  location geography(point, 4326) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_restaurants_market on public.restaurants(market_id);
create index idx_restaurants_location on public.restaurants using gist(location);

-- FTS: search by restaurant name
alter table public.restaurants add column fts tsvector
  generated always as (to_tsvector('english', name)) stored;
create index idx_restaurants_fts on public.restaurants using gin(fts);

-- ============================================================
-- ITEMS (menu items at a restaurant)
-- ============================================================

create table public.items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  name text not null,
  oakrank_score numeric(5,2) not null default 0,
  rating_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, name)
);

create index idx_items_restaurant on public.items(restaurant_id);
create index idx_items_category on public.items(category_id);
create index idx_items_score on public.items(category_id, oakrank_score desc);

-- FTS: search by item name
alter table public.items add column fts tsvector
  generated always as (to_tsvector('english', name)) stored;
create index idx_items_fts on public.items using gin(fts);

-- ============================================================
-- RATINGS (one per user per item)
-- ============================================================

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  sentiment smallint not null check (sentiment in (-2, -1, 1, 2)),
  photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, item_id)
);

create index idx_ratings_item on public.ratings(item_id);
create index idx_ratings_user on public.ratings(user_id, created_at desc);

-- ============================================================
-- RATING ATTRIBUTES (tags selected on a rating)
-- ============================================================

create table public.rating_attributes (
  id uuid primary key default gen_random_uuid(),
  rating_id uuid not null references public.ratings(id) on delete cascade,
  attribute_tag_id uuid not null references public.attribute_tags(id) on delete cascade,
  unique (rating_id, attribute_tag_id)
);

create index idx_rating_attributes_rating on public.rating_attributes(rating_id);
create index idx_rating_attributes_tag on public.rating_attributes(attribute_tag_id);

-- ============================================================
-- AGGREGATE RATING TRIGGERS
-- ============================================================

create or replace function public.update_item_rating_stats()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  target_item_id uuid;
begin
  target_item_id := coalesce(new.item_id, old.item_id);

  update public.items
  set
    oakrank_score = coalesce((
      select round(avg(
        case sentiment
          when  2 then  100
          when  1 then   50
          when -1 then  -50
          when -2 then -100
        end
      )::numeric, 2)
      from public.ratings
      where item_id = target_item_id
    ), 0),
    rating_count = (
      select count(*)
      from public.ratings
      where item_id = target_item_id
    ),
    updated_at = now()
  where id = target_item_id;

  return null;
end;
$$;

create trigger on_rating_change
  after insert or update or delete on public.ratings
  for each row execute function public.update_item_rating_stats();

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_restaurants_updated_at
  before update on public.restaurants
  for each row execute function public.set_updated_at();

create trigger set_items_updated_at
  before update on public.items
  for each row execute function public.set_updated_at();

create trigger set_ratings_updated_at
  before update on public.ratings
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.markets enable row level security;
alter table public.categories enable row level security;
alter table public.attribute_tags enable row level security;
alter table public.restaurants enable row level security;
alter table public.items enable row level security;
alter table public.ratings enable row level security;
alter table public.rating_attributes enable row level security;

-- Profiles: read own, update own
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Markets: public read
create policy "Markets are viewable by everyone"
  on public.markets for select using (true);

-- Categories: public read
create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

-- Attribute tags: public read
create policy "Attribute tags are viewable by everyone"
  on public.attribute_tags for select using (true);

-- Restaurants: public read, authenticated insert
create policy "Restaurants are viewable by everyone"
  on public.restaurants for select using (true);
create policy "Authenticated users can add restaurants"
  on public.restaurants for insert with check (auth.role() = 'authenticated');

-- Items: public read, authenticated insert
create policy "Items are viewable by everyone"
  on public.items for select using (true);
create policy "Authenticated users can add items"
  on public.items for insert with check (auth.role() = 'authenticated');

-- Ratings: public read, author insert/update/delete
create policy "Ratings are viewable by everyone"
  on public.ratings for select using (true);
create policy "Authenticated users can insert ratings"
  on public.ratings for insert with check (auth.uid() = user_id);
create policy "Users can update own ratings"
  on public.ratings for update using (auth.uid() = user_id);
create policy "Users can delete own ratings"
  on public.ratings for delete using (auth.uid() = user_id);

-- Rating attributes: public read, author insert/delete (via rating ownership)
create policy "Rating attributes are viewable by everyone"
  on public.rating_attributes for select using (true);
create policy "Users can insert rating attributes on own ratings"
  on public.rating_attributes for insert with check (
    exists (select 1 from public.ratings where id = rating_id and user_id = auth.uid())
  );
create policy "Users can delete rating attributes on own ratings"
  on public.rating_attributes for delete using (
    exists (select 1 from public.ratings where id = rating_id and user_id = auth.uid())
  );

-- ============================================================
-- SEED: RALEIGH MARKET
-- ============================================================

insert into public.markets (name, slug, location, radius_km)
values ('Raleigh, NC', 'raleigh-nc', st_point(-78.6382, 35.7796)::geography, 40);

-- ============================================================
-- SEED: CATEGORIES + ATTRIBUTE TAGS
-- ============================================================

do $$
declare
  cat_id uuid;
begin
  -- Pizza
  insert into public.categories (name, slug, sort_order) values ('Pizza', 'pizza', 1) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Great crust', 1), (cat_id, 'Good sauce', 2), (cat_id, 'Cheesy', 3), (cat_id, 'Wood-fired', 4);

  -- Burgers
  insert into public.categories (name, slug, sort_order) values ('Burgers', 'burgers', 2) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Great patty', 1), (cat_id, 'Good bun', 2), (cat_id, 'Melty cheese', 3), (cat_id, 'Cooked perfectly', 4);

  -- BBQ
  insert into public.categories (name, slug, sort_order) values ('BBQ', 'bbq', 3) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Great smoke', 1), (cat_id, 'Good bark', 2), (cat_id, 'Tender', 3), (cat_id, 'Flavorful sauce', 4), (cat_id, 'Falls off the bone', 5);

  -- Wings
  insert into public.categories (name, slug, sort_order) values ('Wings', 'wings', 4) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Crispy', 1), (cat_id, 'Saucy', 2), (cat_id, 'Good size', 3), (cat_id, 'Bone-in', 4), (cat_id, 'Spicy', 5);

  -- Fried Chicken
  insert into public.categories (name, slug, sort_order) values ('Fried Chicken', 'fried-chicken', 5) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Crispy', 1), (cat_id, 'Juicy', 2), (cat_id, 'Well-seasoned', 3), (cat_id, 'Spicy', 4), (cat_id, 'Nashville hot', 5);

  -- Tacos
  insert into public.categories (name, slug, sort_order) values ('Tacos', 'tacos', 6) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Great tortilla', 1), (cat_id, 'Flavorful meat', 2), (cat_id, 'Good salsa', 3), (cat_id, 'Authentic', 4);

  -- Burritos
  insert into public.categories (name, slug, sort_order) values ('Burritos', 'burritos', 7) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Good tortilla', 1), (cat_id, 'Flavorful meat', 2), (cat_id, 'Well-balanced', 3), (cat_id, 'Holds together', 4);

  -- Ramen
  insert into public.categories (name, slug, sort_order) values ('Ramen', 'ramen', 8) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Rich broth', 1), (cat_id, 'Great noodles', 2), (cat_id, 'Good chashu', 3), (cat_id, 'Perfect egg', 4);

  -- Sushi
  insert into public.categories (name, slug, sort_order) values ('Sushi', 'sushi', 9) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Super fresh', 1), (cat_id, 'Good rice', 2), (cat_id, 'Beautiful cuts', 3), (cat_id, 'Creative', 4);

  -- Hot Dogs
  insert into public.categories (name, slug, sort_order) values ('Hot Dogs', 'hot-dogs', 10) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Great snap', 1), (cat_id, 'Good toppings', 2), (cat_id, 'Nice char', 3);

  -- Mac and Cheese
  insert into public.categories (name, slug, sort_order) values ('Mac and Cheese', 'mac-and-cheese', 11) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Cheesy', 1), (cat_id, 'Creamy', 2), (cat_id, 'Crispy top', 3), (cat_id, 'Good add-ins', 4);

  -- Donuts
  insert into public.categories (name, slug, sort_order) values ('Donuts', 'donuts', 12) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Fresh', 1), (cat_id, 'Great glaze', 2), (cat_id, 'Creative flavors', 3), (cat_id, 'Light dough', 4);

  -- Fried Chicken Sandwich
  insert into public.categories (name, slug, sort_order) values ('Fried Chicken Sandwich', 'fried-chicken-sandwich', 13) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Crunchy', 1), (cat_id, 'Good pickle', 2), (cat_id, 'Great bun', 3), (cat_id, 'Spicy', 4);

  -- Steak
  insert into public.categories (name, slug, sort_order) values ('Steak', 'steak', 14) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Perfect cook', 1), (cat_id, 'Great sear', 2), (cat_id, 'Quality cut', 3), (cat_id, 'Well-aged', 4);

  -- Pho
  insert into public.categories (name, slug, sort_order) values ('Pho', 'pho', 15) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Deep broth', 1), (cat_id, 'Good noodles', 2), (cat_id, 'Quality protein', 3), (cat_id, 'Great garnish bar', 4);

  -- Sandwiches
  insert into public.categories (name, slug, sort_order) values ('Sandwiches', 'sandwiches', 16) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Great bread', 1), (cat_id, 'Quality meat', 2), (cat_id, 'Generous portion', 3), (cat_id, 'Good sauce', 4);

  -- Ice Cream
  insert into public.categories (name, slug, sort_order) values ('Ice Cream', 'ice-cream', 17) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Creamy', 1), (cat_id, 'Creative flavors', 2), (cat_id, 'Good portion', 3), (cat_id, 'Fresh', 4);

  -- Curry
  insert into public.categories (name, slug, sort_order) values ('Curry', 'curry', 18) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Great heat', 1), (cat_id, 'Rich sauce', 2), (cat_id, 'Quality protein', 3), (cat_id, 'Good rice', 4);

  -- Pasta
  insert into public.categories (name, slug, sort_order) values ('Pasta', 'pasta', 19) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Great sauce', 1), (cat_id, 'Good noodles', 2), (cat_id, 'Fresh', 3), (cat_id, 'Generous portion', 4);

  -- Pastries
  insert into public.categories (name, slug, sort_order) values ('Pastries', 'pastries', 20) returning id into cat_id;
  insert into public.attribute_tags (category_id, label, sort_order) values
    (cat_id, 'Flaky', 1), (cat_id, 'Fresh-baked', 2), (cat_id, 'Creative', 3), (cat_id, 'Buttery', 4);
end;
$$;
