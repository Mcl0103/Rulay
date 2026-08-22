-- Top usuarios por gasto de créditos (proxy de "más activos" también, ya que
-- cada asset generado consume créditos vía spend_credits()). Mismo patrón
-- admin-only que las funciones anteriores.

create function public.admin_top_users(p_limit integer default 10)
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
      select user_id, sum(amount) as total_gastado
      from public.credit_transactions
      group by user_id
    ) ct on ct.user_id = p.id
    left join (
      select user_id, count(*) as total_assets, max(created_at) as ultima_actividad
      from public.generated_assets
      group by user_id
    ) ga on ga.user_id = p.id
    order by coalesce(ct.total_gastado, 0) desc, coalesce(ga.total_assets, 0) desc
    limit p_limit;
end;
$$;

grant execute on function public.admin_top_users(integer) to authenticated;
