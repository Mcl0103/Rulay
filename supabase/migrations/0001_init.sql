-- Rulay — esquema inicial
-- Perfiles, ledger de créditos (FIFO por lote, vencimiento 3 meses), integraciones y compras Whop

-- 1. Perfiles (extiende auth.users de Supabase)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  avatar_url text,
  whop_user_id text unique, -- vinculado cuando el usuario completa su primera compra en Whop
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: usuario ve/edita su propio perfil"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

grant select, insert, update on public.profiles to authenticated;

-- Crea el perfil automáticamente cuando alguien se registra (Google OAuth / magic link)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Lotes de créditos (cada compra = un lote con su propia fecha de vencimiento a 3 meses)
create table public.credit_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  credits_total integer not null check (credits_total > 0),
  credits_remaining integer not null check (credits_remaining >= 0),
  source text not null default 'whop', -- 'whop' | 'manual' | 'promo'
  whop_payment_id text,
  purchased_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '3 months'),
  created_at timestamptz not null default now()
);

create index credit_batches_user_active_idx
  on public.credit_batches (user_id, expires_at)
  where credits_remaining > 0;

alter table public.credit_batches enable row level security;

create policy "credit_batches: usuario ve solo sus lotes"
  on public.credit_batches for select
  using (auth.uid() = user_id);

grant select on public.credit_batches to authenticated;
-- Insert/update de lotes SOLO vía service role (webhook de Whop / funciones backend), nunca desde el cliente.

-- 3. Transacciones de consumo (auditoría de en qué se gastó cada crédito)
create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  batch_id uuid not null references public.credit_batches (id) on delete cascade,
  amount integer not null check (amount > 0),
  action text not null, -- 'pagina_generada' | 'imagen_generada' | 'regenerar_seccion'
  reference_id uuid, -- id de la página o imagen generada
  created_at timestamptz not null default now()
);

alter table public.credit_transactions enable row level security;

create policy "credit_transactions: usuario ve solo las suyas"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

grant select on public.credit_transactions to authenticated;

-- 4. Función: gastar créditos consumiendo lotes FIFO (el que vence primero, primero)
create function public.spend_credits(p_user_id uuid, p_amount integer, p_action text, p_reference_id uuid default null)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_batch record;
  v_remaining integer := p_amount;
  v_take integer;
begin
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

grant execute on function public.spend_credits(uuid, integer, text, uuid) to authenticated;

-- 5. Vista: saldo vigente de créditos por usuario (excluye lotes vencidos)
create view public.credit_balances as
  select
    user_id,
    coalesce(sum(credits_remaining), 0) as balance,
    min(expires_at) filter (where credits_remaining > 0) as next_expiration
  from public.credit_batches
  where expires_at > now()
  group by user_id;

grant select on public.credit_balances to authenticated;

-- 6. Integraciones (tokens de Shopify OAuth, guardados server-side)
create table public.shopify_integrations (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  shop_domain text not null,
  access_token text not null, -- cifrado a nivel de aplicación antes de guardar
  connected_at timestamptz not null default now()
);

alter table public.shopify_integrations enable row level security;

create policy "shopify_integrations: usuario ve solo su conexión (sin token)"
  on public.shopify_integrations for select
  using (auth.uid() = user_id);

revoke select (access_token) on public.shopify_integrations from authenticated;
grant select (user_id, shop_domain, connected_at) on public.shopify_integrations to authenticated;
