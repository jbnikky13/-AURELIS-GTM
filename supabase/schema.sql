create extension if not exists pgcrypto;

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  product_description text not null,
  target_market text not null,
  budget_usdc numeric(18,6) not null default 25,
  spent_usdc numeric(18,6) not null default 0,
  status text not null default 'draft' check (status in ('draft','running','paused','completed')),
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  company_name text,
  person_name text,
  role text,
  source_url text,
  fit_score integer check (fit_score between 0 and 100),
  intent_score integer check (intent_score between 0 and 100),
  confidence_score integer check (confidence_score between 0 and 100),
  evidence jsonb not null default '[]'::jsonb,
  contact_data jsonb not null default '{}'::jsonb,
  status text not null default 'discovered',
  created_at timestamptz not null default now()
);

create table if not exists agent_runs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  action text not null,
  status text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  service text not null,
  amount_usdc numeric(18,6) not null,
  chain text not null default 'BASE',
  status text not null default 'pending',
  tx_hash text,
  receipt jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns(id) on delete cascade,
  action text not null,
  amount_usdc numeric(18,6),
  reason text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create index if not exists leads_campaign_idx on leads(campaign_id);
create index if not exists payments_campaign_idx on payments(campaign_id);
create index if not exists approvals_campaign_idx on approvals(campaign_id);
