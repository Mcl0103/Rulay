-- Usuarios y actividad agrupados por país (user_preferences.pais), cruzando
-- quiénes pagaron al menos una vez (credit_batches con source = 'whop') vs.
-- quiénes nunca compraron créditos. Mismo patrón admin-only que 0006.

create function public.admin_stats_by_country()
returns table (
  pais text,
  usuarios integer,
  usuarios_pagos integer,
  usuarios_sin_pago integer,
  activos_30d integer,
  assets_generados integer
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
      coalesce(up.pais, 'Sin especificar') as pais,
      count(distinct p.id)::integer as usuarios,
      count(distinct p.id) filter (
        where exists (select 1 from public.credit_batches cb where cb.user_id = p.id and cb.source = 'whop')
      )::integer as usuarios_pagos,
      count(distinct p.id) filter (
        where not exists (select 1 from public.credit_batches cb where cb.user_id = p.id and cb.source = 'whop')
      )::integer as usuarios_sin_pago,
      count(distinct ga.user_id) filter (where ga.created_at > now() - interval '30 days')::integer as activos_30d,
      count(ga.id)::integer as assets_generados
    from public.profiles p
    left join public.user_preferences up on up.user_id = p.id
    left join public.generated_assets ga on ga.user_id = p.id
    group by coalesce(up.pais, 'Sin especificar')
    order by usuarios desc;
end;
$$;

grant execute on function public.admin_stats_by_country() to authenticated;
