-- Matrix Academy: o admin pode LER o progresso, os certificados e os papéis de todos os alunos
-- (o painel de admin mostra isso). Rode no SQL Editor do Supabase DEPOIS do 0004_roles.sql.
--
-- Somente leitura: o admin não escreve no progresso nem nos certificados dos alunos por aqui.
-- Alunos continuam enxergando apenas o que é deles.

drop policy if exists "progress_select_admin" on public.watch_progress;
create policy "progress_select_admin" on public.watch_progress
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "certificates_select_admin" on public.certificates;
create policy "certificates_select_admin" on public.certificates
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "user_roles_select_admin" on public.user_roles;
create policy "user_roles_select_admin" on public.user_roles
  for select to authenticated using ((select public.is_admin()));
