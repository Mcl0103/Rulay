-- Bucket público para fotos de perfil
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars: lectura pública"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars: usuario sube solo a su propia carpeta"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars: usuario reemplaza solo su propia foto"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
