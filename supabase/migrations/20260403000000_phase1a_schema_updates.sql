-- ============================================================
-- CATEGORIES: add featured column
-- ============================================================

alter table public.categories add column featured boolean not null default false;

update public.categories set featured = true where slug in (
  'pizza', 'wings', 'tacos', 'ramen', 'sushi', 'ice-cream', 'bbq'
);

-- Re-sort featured categories to the top
update public.categories set sort_order = case slug
  when 'pizza'     then 1
  when 'wings'     then 2
  when 'tacos'     then 3
  when 'ramen'     then 4
  when 'sushi'     then 5
  when 'ice-cream' then 6
  when 'bbq'       then 7
  else sort_order + 100
end;

-- ============================================================
-- PROFILES: add role column
-- ============================================================

alter table public.profiles add column role text not null default 'user';

-- ============================================================
-- RATING TRIGGER: new weights (-3, -1, +1, +2)
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
          when  2 then   2
          when  1 then   1
          when -1 then  -1
          when -2 then  -3
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

-- ============================================================
-- RLS: admin write policies
-- ============================================================

-- Helper to check admin role
create or replace function public.is_admin()
returns boolean
language sql security definer set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Categories: admin insert/update
create policy "Admins can insert categories"
  on public.categories for insert with check (public.is_admin());
create policy "Admins can update categories"
  on public.categories for update using (public.is_admin());

-- Attribute tags: admin insert/update/delete
create policy "Admins can insert attribute tags"
  on public.attribute_tags for insert with check (public.is_admin());
create policy "Admins can update attribute tags"
  on public.attribute_tags for update using (public.is_admin());
create policy "Admins can delete attribute tags"
  on public.attribute_tags for delete using (public.is_admin());

-- Restaurants: admin update/delete (insert already allowed for authenticated users)
create policy "Admins can update restaurants"
  on public.restaurants for update using (public.is_admin());
create policy "Admins can delete restaurants"
  on public.restaurants for delete using (public.is_admin());

-- Items: admin update/delete (insert already allowed for authenticated users)
create policy "Admins can update items"
  on public.items for update using (public.is_admin());
create policy "Admins can delete items"
  on public.items for delete using (public.is_admin());

-- Markets: admin insert/update
create policy "Admins can insert markets"
  on public.markets for insert with check (public.is_admin());
create policy "Admins can update markets"
  on public.markets for update using (public.is_admin());
