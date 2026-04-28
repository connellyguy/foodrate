-- Rebrand: OakRank → OakRate. Rename items.oakrank_score and recreate the
-- score-recalculation trigger function so it references the new column name.

alter table public.items rename column oakrank_score to oakrate_score;

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
    oakrate_score = coalesce((
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
