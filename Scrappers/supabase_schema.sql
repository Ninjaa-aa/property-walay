-- Enable UUID generation
create extension if not exists pgcrypto;

-- 1) Main properties table
create table if not exists properties (
  our_id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('graana','lamudi','zameen')),
  source_id text not null,
  source_human_id text,
  title text,
  prop_type text,
  prop_subtype text,
  area_size numeric,
  area_unit text,
  beds int,
  baths int,
  area_name text,
  link text,
  images jsonb,
  poc_name text,
  poc_number text,
  latitude numeric,
  longitude numeric,
  current_price numeric,
  currency text,
  listing_type text check (listing_type in ('rent','sale')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_price_change_at timestamptz
);

create unique index if not exists ux_properties_source_sourceid
  on properties (source, source_id);

-- 2) Price history
create table if not exists property_price_history (
  id uuid primary key default gen_random_uuid(),
  our_id uuid not null references properties(our_id) on delete cascade,
  price numeric not null,
  currency text,
  changed_at timestamptz not null default now()
);

-- 3) Last updates mirror
create table if not exists property_last_updates (
  our_id uuid primary key references properties(our_id) on delete cascade,
  last_updated_at timestamptz not null default now()
);

-- 4) Saved properties by user
create table if not exists saved_properties (
  email text not null,
  our_id uuid not null references properties(our_id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (email, our_id)
);

create index if not exists idx_properties_updated_at on properties(updated_at desc);
create index if not exists idx_properties_listing_type on properties(listing_type);
create index if not exists idx_price_history_our_id_changed_at on property_price_history(our_id, changed_at desc);


