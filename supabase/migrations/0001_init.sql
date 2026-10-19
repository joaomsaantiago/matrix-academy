-- Matrix Academy: esquema inicial
-- Rode este arquivo no SQL Editor do Supabase (ou com `supabase db push`).

-- =========================================================
-- Funcoes utilitarias
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- profiles: dados do aluno (1 para 1 com auth.users)
-- =========================================================
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null check (char_length(btrim(full_name)) >= 5),
  email       text not null,
  -- somente digitos, com DDD (10 ou 11 digitos)
  phone       text not null check (phone ~ '^[0-9]{10,11}$'),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Cria o profile automaticamente quando a conta e criada.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, phone)
  values (
    new.id,
    btrim(new.raw_user_meta_data ->> 'full_name'),
    new.email,
    regexp_replace(coalesce(new.raw_user_meta_data ->> 'phone', ''), '\D', '', 'g')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- Estrutura do curso
-- =========================================================
create table public.modules (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text,
  thumbnail_url text,
  position      integer not null,
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger modules_set_updated_at
  before update on public.modules
  for each row execute function public.set_updated_at();

create table public.episodes (
  id               uuid primary key default gen_random_uuid(),
  module_id        uuid not null references public.modules (id) on delete cascade,
  slug             text not null,
  title            text not null,
  description      text,
  thumbnail_url    text,
  -- ID do video na biblioteca do Bunny Stream
  bunny_video_id   text,
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  position         integer not null,
  published        boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (module_id, slug),
  unique (module_id, position)
);

create index episodes_module_id_idx on public.episodes (module_id);

create trigger episodes_set_updated_at
  before update on public.episodes
  for each row execute function public.set_updated_at();

-- =========================================================
-- watch_progress: onde cada aluno parou em cada episodio
-- =========================================================
create table public.watch_progress (
  user_id          uuid not null references auth.users (id) on delete cascade,
  episode_id       uuid not null references public.episodes (id) on delete cascade,
  position_seconds integer not null default 0 check (position_seconds >= 0),
  completed        boolean not null default false,
  completed_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  primary key (user_id, episode_id)
);

create index watch_progress_user_updated_idx
  on public.watch_progress (user_id, updated_at desc);

-- Regras de progresso aplicadas no banco (nao dependem do navegador):
--  * o episodio conta como concluido ao passar de 90% da duracao real;
--  * depois de concluido, nunca volta a "nao concluido";
--  * a posicao nao passa da duracao do episodio.
create or replace function public.apply_watch_progress_rules()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  ep_duration integer;
begin
  select duration_seconds into ep_duration
  from public.episodes where id = new.episode_id;

  if ep_duration is not null and ep_duration > 0 then
    new.position_seconds := least(new.position_seconds, ep_duration);
    if new.position_seconds >= ep_duration * 0.9 then
      new.completed := true;
    end if;
  end if;

  if tg_op = 'UPDATE' and old.completed then
    new.completed := true;
    new.completed_at := old.completed_at;
  end if;

  if new.completed and new.completed_at is null then
    new.completed_at := now();
  end if;

  new.updated_at := now();
  return new;
end;
$$;

create trigger watch_progress_rules
  before insert or update on public.watch_progress
  for each row execute function public.apply_watch_progress_rules();

-- =========================================================
-- certificates
-- =========================================================
create table public.certificates (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null unique references auth.users (id) on delete cascade,
  code      text not null unique,
  -- nome gravado no momento da emissao
  full_name text not null,
  issued_at timestamptz not null default now()
);

-- =========================================================
-- Progresso total do aluno logado
-- =========================================================
create or replace view public.my_course_progress
with (security_invoker = true) as
select
  auth.uid() as user_id,
  t.total_episodes,
  c.completed_episodes,
  case
    when t.total_episodes = 0 then 0
    else round(100.0 * c.completed_episodes / t.total_episodes, 1)
  end as percent
from
  (select count(*)::int as total_episodes
     from public.episodes e
     join public.modules m on m.id = e.module_id
    where e.published and m.published) t,
  (select count(*)::int as completed_episodes
     from public.watch_progress wp
     join public.episodes e on e.id = wp.episode_id
     join public.modules m on m.id = e.module_id
    where wp.user_id = auth.uid()
      and wp.completed
      and e.published and m.published) c;

-- =========================================================
-- Emissao e verificacao de certificado
-- =========================================================
-- Emite o certificado do aluno logado, mas so se ele estiver em 100%.
create or replace function public.issue_certificate()
returns public.certificates
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  prog record;
  cert public.certificates;
  prof public.profiles;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into cert from public.certificates where user_id = uid;
  if found then
    return cert;
  end if;

  select * into prog from public.my_course_progress;
  if prog.total_episodes = 0 or prog.completed_episodes < prog.total_episodes then
    raise exception 'course_not_completed' using errcode = 'P0001';
  end if;

  select * into prof from public.profiles where id = uid;

  insert into public.certificates (user_id, code, full_name)
  values (
    uid,
    'MA-' || upper(substr(md5(random()::text || clock_timestamp()::text || uid::text), 1, 10)),
    prof.full_name
  )
  returning * into cert;

  return cert;
end;
$$;

-- Verificacao publica: qualquer pessoa confere um codigo, sem expor outros dados.
create or replace function public.verify_certificate(cert_code text)
returns table (full_name text, issued_at timestamptz)
language sql
security definer
set search_path = ''
stable
as $$
  select c.full_name, c.issued_at
  from public.certificates c
  where c.code = upper(btrim(cert_code));
$$;

-- =========================================================
-- Row Level Security
-- =========================================================
alter table public.profiles       enable row level security;
alter table public.modules        enable row level security;
alter table public.episodes       enable row level security;
alter table public.watch_progress enable row level security;
alter table public.certificates   enable row level security;

-- profiles: cada aluno ve e edita so o proprio
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- modulos e episodios: alunos logados veem o que esta publicado
create policy "modules_select_published" on public.modules
  for select to authenticated using (published);
create policy "episodes_select_published" on public.episodes
  for select to authenticated using (published);

-- A landing page (visitante sem login) pode listar os modulos publicados
create policy "modules_select_published_anon" on public.modules
  for select to anon using (published);

-- watch_progress: cada aluno le e grava so o proprio progresso
create policy "progress_select_own" on public.watch_progress
  for select to authenticated using (user_id = auth.uid());
create policy "progress_insert_own" on public.watch_progress
  for insert to authenticated with check (user_id = auth.uid());
create policy "progress_update_own" on public.watch_progress
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- certificates: o aluno so le o proprio; a emissao e feita por issue_certificate()
create policy "certificates_select_own" on public.certificates
  for select to authenticated using (user_id = auth.uid());

-- Permissoes das funcoes
revoke all on function public.issue_certificate() from public, anon;
grant execute on function public.issue_certificate() to authenticated;
grant execute on function public.verify_certificate(text) to anon, authenticated;
