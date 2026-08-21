-- Desacopla el proveedor de pagos del schema núcleo: en vez de una columna
-- whop_user_id en profiles, una tabla payment_customers que soporta cualquier
-- proveedor (whop, stripe, etc.) sin tocar profiles/credit_batches/spend_credits.

create table public.payment_customers (
  user_id uuid not null references public.profiles (id) on delete cascade,
  provider text not null, -- 'whop' | 'stripe'
  external_customer_id text not null, -- id del usuario/cliente en el proveedor
  created_at timestamptz not null default now(),
  primary key (user_id, provider),
  unique (provider, external_customer_id)
);

alter table public.payment_customers enable row level security;

create policy "payment_customers: usuario ve solo su propio link"
  on public.payment_customers for select
  using (auth.uid() = user_id);

grant select on public.payment_customers to authenticated;
-- Insert/update SOLO vía service role (webhook), nunca desde el cliente.

-- Migra cualquier whop_user_id existente antes de eliminar la columna
insert into public.payment_customers (user_id, provider, external_customer_id)
select id, 'whop', whop_user_id
from public.profiles
where whop_user_id is not null
on conflict do nothing;

alter table public.profiles drop column whop_user_id;

-- credit_batches: generalizar whop_payment_id -> payment_id (ya independiente vía source)
alter table public.credit_batches rename column whop_payment_id to payment_id;
