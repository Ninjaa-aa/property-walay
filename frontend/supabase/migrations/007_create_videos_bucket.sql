-- Public videos bucket for property / demo MP4 assets (upload via service role or dashboard)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'videos',
  'videos',
  true,
  524288000,
  array[
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update
  set public = true,
      file_size_limit = 524288000,
      allowed_mime_types = array[
        'video/mp4',
        'video/webm',
        'video/quicktime'
      ];

-- Anyone can read objects in this bucket (bucket is public; URLs are shareable)
create policy "videos public read" on storage.objects
  for select
  using (bucket_id = 'videos');
