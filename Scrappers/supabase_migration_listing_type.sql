-- Run this once if your properties table already exists and you need to add listing_type.
-- New deployments can ignore this; supabase_schema.sql already includes the column.

alter table properties
  add column if not exists listing_type text check (listing_type in ('rent','sale'));

create index if not exists idx_properties_listing_type on properties(listing_type);
