-- Cadastro: campo "Profissao" (Pastor, Tecnico de Som ou Locador).
-- Rode no SQL Editor do Supabase DEPOIS do 0002_has_matrix.sql.
-- Este arquivo tambem recria o gatilho do cadastro para gravar profissao e has_matrix.

alter table public.profiles
  add column if not exists profession text
  check (profession in ('pastor', 'tecnico_som', 'locador'));

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
  return new;
end;
$$;
