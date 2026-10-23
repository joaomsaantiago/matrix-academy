-- Cadastro: "Ja possui a mesa Matrix?" (sim/nao).
-- Rode este arquivo no SQL Editor do Supabase depois do 0001_init.sql.
-- Enquanto nao rodar, o cadastro continua funcionando (a resposta fica so no metadata do usuario).

alter table public.profiles
  add column if not exists has_matrix boolean;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, phone, has_matrix)
  values (
    new.id,
    btrim(new.raw_user_meta_data ->> 'full_name'),
    new.email,
    regexp_replace(coalesce(new.raw_user_meta_data ->> 'phone', ''), '\D', '', 'g'),
    (new.raw_user_meta_data ->> 'has_matrix')::boolean
  );
  return new;
end;
$$;
