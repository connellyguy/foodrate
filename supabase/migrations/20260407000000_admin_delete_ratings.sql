-- Allow admins to delete any rating (complements the existing admin UPDATE policy).
create policy "Admins can delete any rating"
  on public.ratings for delete using (public.is_admin());
