-- Add moderation_status to ratings for admin moderation workflow.
-- Values: active (default), hidden (visible but excluded from display), uncounted (excluded from scores).

alter table public.ratings
  add column moderation_status text not null default 'active'
  constraint ratings_moderation_status_check
    check (moderation_status in ('active', 'hidden', 'uncounted'));

create index idx_ratings_moderation on public.ratings(moderation_status);

-- Update trigger: exclude uncounted ratings from score calculation
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
        and moderation_status in ('active', 'hidden')
    ), 0),
    rating_count = (
      select count(*)
      from public.ratings
      where item_id = target_item_id
        and moderation_status in ('active', 'hidden')
    ),
    updated_at = now()
  where id = target_item_id;

  return null;
end;
$$;

-- Admin RLS policy for moderation updates
create policy "Admins can update any rating"
  on public.ratings for update using (public.is_admin());
