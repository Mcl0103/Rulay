-- Serie diaria de actividad (para el area chart + heatmap tipo calendario del
-- panel admin) y comparativos semana-vs-semana-anterior (para los pills de
-- tendencia "+X%"). Mismo patrón admin-only que las funciones anteriores.

create function public.admin_activity_daily(p_days integer default 84)
returns table (
  dia date,
  assets_generados integer,
  creditos_gastados integer
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
      s.dia,
      coalesce((select count(*) from public.generated_assets ga where ga.created_at::date = s.dia), 0)::integer as assets_generados,
      coalesce((select sum(ct.amount) from public.credit_transactions ct where ct.created_at::date = s.dia), 0)::integer as creditos_gastados
    from generate_series((current_date - (p_days - 1)), current_date, interval '1 day') as s(dia)
    order by s.dia asc;
end;
$$;

grant execute on function public.admin_activity_daily(integer) to authenticated;

-- Agrega comparativos de 7 días (actual vs. los 7 días anteriores) a las
-- métricas generales, para los pills de tendencia.
create or replace function public.admin_dashboard_stats()
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_current_user_admin() then
    raise exception 'no autorizado';
  end if;

  select jsonb_build_object(
    'usuarios_totales', (select count(*) from public.profiles),
    'usuarios_activos_7d', (select count(distinct user_id) from public.generated_assets where created_at > now() - interval '7 days'),
    'usuarios_activos_30d', (select count(distinct user_id) from public.generated_assets where created_at > now() - interval '30 days'),
    'usuarios_pagos', (select count(distinct user_id) from public.credit_batches where source = 'whop'),
    'usuarios_sin_pago', (
      select count(*) from public.profiles p
      where not exists (select 1 from public.credit_batches cb where cb.user_id = p.id and cb.source = 'whop')
    ),
    'imagenes_generadas_total', (select count(*) from public.generated_assets where asset_type = 'imagen'),
    'assets_generados_total', (select count(*) from public.generated_assets),
    'creditos_comprados_total', (select coalesce(sum(credits_total), 0) from public.credit_batches),
    'creditos_consumidos_total', (select coalesce(sum(amount), 0) from public.credit_transactions),
    'creditos_disponibles_total', (select coalesce(sum(credits_remaining), 0) from public.credit_batches where expires_at > now()),
    'creditos_expirados_sin_usar', (select coalesce(sum(credits_remaining), 0) from public.credit_batches where expires_at <= now() and credits_remaining > 0),
    'compras_total', (select count(*) from public.credit_batches where source = 'whop'),
    'assets_7d', (select count(*) from public.generated_assets where created_at > now() - interval '7 days'),
    'assets_7d_prev', (select count(*) from public.generated_assets where created_at > now() - interval '14 days' and created_at <= now() - interval '7 days'),
    'creditos_consumidos_7d', (select coalesce(sum(amount), 0) from public.credit_transactions where created_at > now() - interval '7 days'),
    'creditos_consumidos_7d_prev', (select coalesce(sum(amount), 0) from public.credit_transactions where created_at > now() - interval '14 days' and created_at <= now() - interval '7 days'),
    'compras_7d', (select count(*) from public.credit_batches where source = 'whop' and purchased_at > now() - interval '7 days'),
    'compras_7d_prev', (select count(*) from public.credit_batches where source = 'whop' and purchased_at > now() - interval '14 days' and purchased_at <= now() - interval '7 days')
  ) into result;

  return result;
end;
$$;
