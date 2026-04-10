-- Trim categories to the 7 MVP categories defined in PRODUCT.md:
-- Pizza, Wings, Tacos, Ramen, Sushi, Ice Cream, BBQ
--
-- attribute_tags cascade-deletes via FK.
-- items.category_id does NOT cascade, so delete items (and their ratings) first.

delete from public.items
where category_id in (
    select id from public.categories
    where slug not in ('pizza', 'wings', 'tacos', 'ramen', 'sushi', 'ice-cream', 'bbq')
);

delete from public.categories
where slug not in ('pizza', 'wings', 'tacos', 'ramen', 'sushi', 'ice-cream', 'bbq');

-- Re-number sort_order to match the product doc ordering
update public.categories set sort_order = 1 where slug = 'pizza';
update public.categories set sort_order = 2 where slug = 'wings';
update public.categories set sort_order = 3 where slug = 'tacos';
update public.categories set sort_order = 4 where slug = 'ramen';
update public.categories set sort_order = 5 where slug = 'sushi';
update public.categories set sort_order = 6 where slug = 'ice-cream';
update public.categories set sort_order = 7 where slug = 'bbq';
