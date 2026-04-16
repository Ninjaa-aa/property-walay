-- Create private avatar bucket with size and mime restrictions
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatar',
  'avatar',
  false,
  2097152,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = 2097152,
      allowed_mime_types = array[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml'
      ];

-- RLS policies: users can only read/write files under their own user_id folder
-- Path convention: {user_id}/avatar.{ext}
create policy "avatar owner read" on storage.objects
  for select
  using (
    bucket_id = 'avatar'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatar owner insert" on storage.objects
  for insert
  with check (
    bucket_id = 'avatar'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatar owner update" on storage.objects
  for update
  using (
    bucket_id = 'avatar'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatar owner delete" on storage.objects
  for delete
  using (
    bucket_id = 'avatar'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
