-- Matrix Academy: papéis (aluno e admin)
-- Rode no SQL Editor do Supabase DEPOIS do 0003_profession.sql.
--
-- Regras de segurança deste arquivo:
--  * o papel fica numa tabela própria (user_roles), nunca em profiles nem no user_metadata, que o
--    próprio usuário consegue editar;
--  * quem se cadastra pelo site recebe SEMPRE o papel 'student'. O gatilho ignora qualquer dado
--    enviado no cadastro, então não existe jeito de pedir 'admin' pelo formulário;
--  * ninguém logado (nem o próprio usuário) consegue inserir, alterar ou apagar papéis pela API:
--    sem política de escrita, sem permissão de escrita e com um gatilho de proteção extra;
--  * admins só são criados direto no banco (SQL Editor ou service role), veja o fim do arquivo;
--  * as políticas de admin usam public.is_admin(), que consulta a tabela com segurança.

-- =========================================================
-- Tipo e tabela de papéis
-- =========================================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role' and typnamespace = 'public'::regnamespace) then
    create type public.app_role as enum ('student', 'admin');
  end if;
end
$$;

create table if not exists public.user_roles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  role       public.app_role not null default 'student',
  created_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;

-- cada pessoa só enxerga o próprio papel (o menu e as telas de admin usam isso)
drop policy if exists "user_roles_select_own" on public.user_roles;
create policy "user_roles_select_own" on public.user_roles
  for select to authenticated using (user_id = (select auth.uid()));

-- nenhuma política de insert/update/delete: a API não escreve nesta tabela.
-- Reforço: tira também as permissões de escrita e todo o acesso do visitante sem login.
revoke all on public.user_roles from anon, authenticated;
grant select on public.user_roles to authenticated;

-- Proteção extra: mesmo que uma permissão seja concedida por engano no futuro, quem chega pela API
-- (papéis anon e authenticated) não consegue mudar papéis. O SQL Editor e a service role passam.
create or replace function public.protect_user_roles()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user in ('anon', 'authenticated') then
    raise exception 'papéis só podem ser alterados direto no banco' using errcode = '42501';
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists user_roles_protect on public.user_roles;
create trigger user_roles_protect
  before insert or update or delete on public.user_roles
  for each row execute function public.protect_user_roles();

-- quem já tem conta vira aluno (idempotente)
insert into public.user_roles (user_id, role)
select id, 'student' from auth.users
on conflict (user_id) do nothing;

-- =========================================================
-- Cadastro: toda conta nova é aluno, sempre
-- =========================================================
-- Mesmo gatilho do 0003, com a linha do papel. O papel é fixo no código: nada que venha do
-- formulário (raw_user_meta_data) é lido para decidir isso.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, phone, has_matrix, profession)
  values (
    new.id,
    btrim(new.raw_user_meta_data ->> 'full_name'),
    new.email,
    regexp_replace(coalesce(new.raw_user_meta_data ->> 'phone', ''), '\D', '', 'g'),
    (new.raw_user_meta_data ->> 'has_matrix')::boolean,
    nullif(new.raw_user_meta_data ->> 'profession', '')
  );

  insert into public.user_roles (user_id, role) values (new.id, 'student');
  return new;
end;
$$;

-- =========================================================
-- is_admin(): usado nas políticas
-- =========================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- =========================================================
-- O que o admin pode fazer (alunos continuam como no 0001)
-- =========================================================
-- gerenciar módulos e episódios, inclusive os não publicados
drop policy if exists "modules_admin_all" on public.modules;
create policy "modules_admin_all" on public.modules
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "episodes_admin_all" on public.episodes;
create policy "episodes_admin_all" on public.episodes
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ver os perfis dos alunos (somente leitura)
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin" on public.profiles
  for select to authenticated using ((select public.is_admin()));

-- =========================================================
-- Perfil: o aluno só edita os campos dele
-- =========================================================
-- A política "profiles_update_own" libera a linha, mas deixava editar qualquer coluna dela.
-- Agora só estas colunas podem ser alteradas pela API (e-mail e id, não).
revoke insert, update, delete on public.profiles from anon, authenticated;
revoke select on public.profiles from anon;
grant update (full_name, phone, has_matrix, profession) on public.profiles to authenticated;

-- =========================================================
-- COMO CRIAR UM ADMIN (somente aqui, direto no banco)
-- =========================================================
-- 1) A pessoa cria a conta normalmente pelo site (ela entra como aluno).
-- 2) No SQL Editor do Supabase, rode, trocando o e-mail:
--
--    update public.user_roles
--       set role = 'admin'
--     where user_id = (select id from auth.users where email = 'admin@exemplo.com');
--
-- Para voltar a aluno, troque 'admin' por 'student'.
--
-- CONFERIR (rode para ver o estado atual):
--
--    select u.email, r.role from public.user_roles r join auth.users u on u.id = r.user_id order by r.role, u.email;
--    select count(*) filter (where role = 'admin') as admins, count(*) filter (where role = 'student') as alunos from public.user_roles;
