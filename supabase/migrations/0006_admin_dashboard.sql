-- Panel de administración privado (solo Marlon) — flag is_admin + funciones
-- agregadas de solo lectura para el dashboard interno de métricas/facturación.
-- Las funciones son security definer (mismo patrón que spend_credits en 0001_init.sql)
-- y validan is_admin internamente antes de devolver cualquier dato cross-usuario.

alter table public.profiles add column is_admin boolean not null default false;

update public.profiles set is_admin = true
where id = (select id from auth.users where email = 'marlonfa123@gmail.com');

create function public.is_current_user_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

grant execute on function public.is_current_user_admin() to authenticated;

-- Métricas agregadas: usuarios, generación, créditos.
create function public.admin_dashboard_stats()
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

grant execute on function public.admin_dashboard_stats() to authenticated;

-- Compras recientes (lotes de créditos), para la sección de facturación.
-- Nota: aún no se guarda el monto pagado ni la moneda (el webhook de Whop solo
-- registra créditos otorgados) — ver wiki memory project_rulay_metricas_uso_pendiente
-- para agregar amount/currency a credit_batches cuando se retome ese tema.
create function public.admin_recent_purchases(p_limit integer default 20)
returns table (
  user_id uuid,
  user_name text,
  credits_total integer,
  credits_remaining integer,
  source text,
  payment_id text,
  purchased_at timestamptz,
  expires_at timestamptz
)
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_current_user_admin() then
    raise exception 'no autorizado';
  end if;

  return query
    select cb.user_id, p.name, cb.credits_total, cb.credits_remaining, cb.source, cb.payment_id, cb.purchased_at, cb.expires_at
    from public.credit_batches cb
    join public.profiles p on p.id = cb.user_id
    order by cb.purchased_at desc
    limit p_limit;
end;
$$;

grant execute on function public.admin_recent_purchases(integer) to authenticated;
