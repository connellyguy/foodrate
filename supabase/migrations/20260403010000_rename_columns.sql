-- Rename columns to match plan docs and migration conventions
alter table public.ratings rename column stars to sentiment;
alter table public.items rename column avg_rating to oakrank_score;
