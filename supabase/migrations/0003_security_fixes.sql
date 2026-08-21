-- Fix de seguridad: autorización faltante en spend_credits() y whop_user_id editable por cualquiera

-- 1. spend_credits(): exigir que el llamador sea el dueño de p_user_id
create or replace function public.spend_credits(p_user_id uuid, p_amount integer, p_action text, p_reference_id uuid default null)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_batch record;
  v_remaining integer := p_amount;
  v_take integer;
begin
  if auth.uid() is null or auth.uid() != p_user_id then
    raise exception 'no autorizado';
  end if;

  if p_amount <= 0 then
    raise exception 'amount debe ser positivo';
  end if;

  for v_batch in
    select id, credits_remaining
    from public.credit_batches
    where user_id = p_user_id
      and credits_remaining > 0
      and expires_at > now()
    order by expires_at asc
    for update
  loop
    exit when v_remaining <= 0;

    v_take := least(v_batch.credits_remaining, v_remaining);

    update public.credit_batches
      set credits_remaining = credits_remaining - v_take
      where id = v_batch.id;

    insert into public.credit_transactions (user_id, batch_id, amount, action, reference_id)
      values (p_user_id, v_batch.id, v_take, p_action, p_reference_id);

    v_remaining := v_remaining - v_take;
  end loop;

  if v_remaining > 0 then
    raise exception 'créditos insuficientes';
  end if;
end;
$$;

-- 2. profiles: quitar whop_user_id del grant de update de tabla completa,
-- el cliente no debe poder editarlo nunca (solo el webhook, vía service role, lo asigna)
revoke update on public.profiles from authenticated;
grant update (name, avatar_url) on public.profiles to authenticated;
