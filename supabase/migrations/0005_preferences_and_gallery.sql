-- Preferencias de cuenta (hoy en localStorage, ver Configuración) +
-- galería reutilizable de ángulos de venta y assets generados
-- (soporta /app/landing y su ADR de arquitectura).

-- 1. Preferencias de cuenta — 1:1 con profiles
create table public.user_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,

  pais text,
  idioma_contenido text,
  moneda text,
  welcome_message text,

  low_credits_alert_enabled boolean not null default false,
  low_credits_threshold integer not null default 50 check (low_credits_threshold > 0),

  auto_recarga_enabled boolean not null default false,
  auto_recarga_threshold integer not null default 20 check (auto_recarga_threshold > 0),
  auto_recarga_package text not null default 'Starter', -- 'Starter' | 'Growth' | 'Pro'

  watermark_enabled boolean not null default false,
  watermark_storage_path text, -- path dentro del bucket 'watermarks'

  ui_language text not null default 'Español',

  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create policy "user_preferences: usuario ve/edita solo las suyas"
  on public.user_preferences for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.user_preferences to authenticated;

-- 2. Ángulos de venta guardados y reutilizables (ver ADR — Arquitectura landing desde imágenes)
create table public.sales_angles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  brief text, -- prompt libre del usuario; null si se generó con IA
  ai_generated boolean not null default false,
  details jsonb not null default '{}'::jsonb, -- publico, precio, pais, idioma (Detalles avanzados)
  palette jsonb, -- { bg, accent, tone } — se fija con la primera sección generada de este ángulo
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sales_angles enable row level security;

create policy "sales_angles: usuario ve/edita solo los suyos"
  on public.sales_angles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.sales_angles to authenticated;

-- 3. Assets generados (páginas, imágenes sueltas, secciones de landing) —
-- alimenta "Mi galería" como referencia y el futuro listado de "Tus páginas".
create table public.generated_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  sales_angle_id uuid references public.sales_angles (id) on delete set null,
  asset_type text not null check (asset_type in ('pagina', 'imagen', 'seccion_landing')),
  section_type text, -- solo si asset_type = 'seccion_landing': 'hero' | 'oferta' | 'beneficios' | ...
  image_url text not null,
  prompt text,
  credits_spent integer not null default 0 check (credits_spent >= 0),
  created_at timestamptz not null default now()
);

create index generated_assets_user_idx on public.generated_assets (user_id, created_at desc);

alter table public.generated_assets enable row level security;

create policy "generated_assets: usuario ve solo los suyos"
  on public.generated_assets for select
  using (auth.uid() = user_id);

grant select on public.generated_assets to authenticated;
-- Insert SOLO vía service role (el pipeline de generación real, cuando exista),
-- igual que credit_batches — nunca se escribe directo desde el cliente.

-- 4. Storage privado para la marca de agua que sube cada usuario
insert into storage.buckets (id, name, public)
values ('watermarks', 'watermarks', false)
on conflict (id) do nothing;

create policy "watermarks: usuario ve solo la suya"
  on storage.objects for select
  using (bucket_id = 'watermarks' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "watermarks: usuario sube solo a su propia carpeta"
  on storage.objects for insert
  with check (bucket_id = 'watermarks' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "watermarks: usuario reemplaza solo la suya"
  on storage.objects for update
  using (bucket_id = 'watermarks' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "watermarks: usuario borra solo la suya"
  on storage.objects for delete
  using (bucket_id = 'watermarks' and (storage.foldername(name))[1] = auth.uid()::text);
