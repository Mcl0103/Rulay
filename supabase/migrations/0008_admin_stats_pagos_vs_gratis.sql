-- Agrega el cruce de usuarios que pagaron al menos una vez vs. los que nunca
-- compraron créditos a las métricas generales del panel admin.
-- (0006 ya está aplicada en prod, por eso esto va en migración nueva con
-- create or replace en vez de editar la función original.)

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
    'compras_total', (select count(*) from public.credit_batches where source = 'whop')
  ) into result;

  return result;
end;
$$;
