-- Content-based recommendation embeddings exported from the trained
-- PyTorch model (numeric_pca representation, 8 dims).
-- Enables pgvector so similarity queries can later be moved to the DB
-- side without a new migration.

create extension if not exists vector;

create table if not exists public.property_embeddings (
  our_id uuid primary key references public.properties(our_id) on delete cascade,
  representation text not null default 'numeric_pca',
  embedding vector(8) not null,
  updated_at timestamptz not null default now()
);

create index if not exists idx_property_embeddings_cosine
  on public.property_embeddings
  using hnsw (embedding vector_cosine_ops);

alter table public.property_embeddings enable row level security;

drop policy if exists "embeddings readable by authenticated" on public.property_embeddings;
create policy "embeddings readable by authenticated"
  on public.property_embeddings for select
  using (auth.role() = 'authenticated');
