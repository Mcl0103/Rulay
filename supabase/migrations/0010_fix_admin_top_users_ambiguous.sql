-- Fix: el OUT parameter "user_id" de la función (por el RETURNS TABLE)
-- choca con la columna user_id referenciada sin calificar dentro de los
-- subqueries — Postgres no sabe si es la variable de la función o la
-- columna de la tabla. Se corrige calificando todas las columnas.

create or replace function public.admin_top_users(p_limit integer default 10)
returns table (
  user_id uuid,
  user_name text,
  pais text,
  creditos_gastados integer,
  assets_generados integer,
  ultima_actividad timestamptz
)
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_current_user_admin() then
    raise exception 'no autorizado';
  end if;

  return query
    select
      p.id as user_id,
      p.name as user_name,
      up.pais,
      coalesce(ct.total_gastado, 0)::integer as creditos_gastados,
      coalesce(ga.total_assets, 0)::integer as assets_generados,
      ga.ultima_actividad
    from public.profiles p
    left join public.user_preferences up on up.user_id = p.id
    left join (
      select credit_transactions.user_id as uid, sum(credit_transactions.amount) as total_gastado
      from public.credit_transactions
      group by credit_transactions.user_id
    ) ct on ct.uid = p.id
    left join (
      select generated_assets.user_id as uid, count(*) as total_assets, max(generated_assets.created_at) as ultima_actividad
      from public.generated_assets
      group by generated_assets.user_id
    ) ga on ga.uid = p.id
    order by coalesce(ct.total_gastado, 0) desc, coalesce(ga.total_assets, 0) desc
    limit p_limit;
end;
$$;
