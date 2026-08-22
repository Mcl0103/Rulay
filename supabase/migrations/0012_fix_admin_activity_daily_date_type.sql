-- Fix: generate_series(date, date, interval) resuelve a la sobrecarga de
-- timestamp, así que s.dia salía como `timestamp without time zone` mientras
-- la función declara `dia date` -> "structure of query does not match
-- function result type". Se corrige casteando explícitamente a date.

create or replace function public.admin_activity_daily(p_days integer default 84)
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
      s.dia::date,
      coalesce((select count(*) from public.generated_assets ga where ga.created_at::date = s.dia::date), 0)::integer,
      coalesce((select sum(ct.amount) from public.credit_transactions ct where ct.created_at::date = s.dia::date), 0)::integer
    from generate_series(
      (current_date - (p_days - 1))::timestamp,
      current_date::timestamp,
      interval '1 day'
    ) as s(dia)
    order by s.dia::date asc;
end;
$$;
