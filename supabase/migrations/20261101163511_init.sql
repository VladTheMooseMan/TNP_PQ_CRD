-- ============================================================
-- FILE: supabase/schema.sql
-- PURPOSE: Tables + Row Level Security for town-scoped data.
-- ------------------------------------------------------------
-- ASCII FLOW:
--   auth.users --> town_members --> towns
--                                 \-> families -> members
--                                             \-> rituals
--   invites -> join_town_by_invite() -> town_members
-- ============================================================

create extension if not exists "pgcrypto" with schema extensions;

create table if not exists towns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists town_members (
  town_id uuid references towns(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'player',
  primary key (town_id, user_id)
);

create table if not exists invites (
  code text primary key default encode(extensions.gen_random_bytes(6), 'hex'),
  town_id uuid not null references towns(id) on delete cascade,
  uses_left int not null default 10,
  expires_at timestamptz
);

create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  town_id uuid not null references towns(id) on delete cascade,
  user_id uuid not null references auth.users(id) default auth.uid(),
  name text not null,
  background text,
  seal_url text,
  holy_symbol_url text,
  larder int not null default 0
);

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  status text not null default 'alive',
  portrait_url text,
  background text
);

create table if not exists rituals (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  image_url text,
  mechanics text not null default '',
  effects text not null default '',
  learned_date date,
  taught_by text,
  icons jsonb not null default '{"cast_type":"touch","cast_time":"short","secrecy":"open"}'::jsonb,
  style jsonb not null default '{"border_variant":"plain","ink_color":"#1a140d","condition_variant":"pristine"}'::jsonb
);

-- Enable RLS
alter table towns enable row level security;
alter table town_members enable row level security;
alter table invites enable row level security;
alter table families enable row level security;
alter table members enable row level security;
alter table rituals enable row level security;

-- Policies: user must be a member of the town to see/modify its rows.
create policy "town_members read own towns"
  on towns for select using (
    exists(select 1 from town_members tm where tm.town_id = towns.id and tm.user_id = auth.uid())
  );

create policy "town_members read self"
  on town_members for select using (user_id = auth.uid()
    or exists(select 1 from town_members tm where tm.town_id = town_members.town_id and tm.user_id = auth.uid()));

create policy "families scoped by town"
  on families for all using (
    exists(select 1 from town_members tm where tm.town_id = families.town_id and tm.user_id = auth.uid())
  ) with check (
    exists(select 1 from town_members tm where tm.town_id = families.town_id and tm.user_id = auth.uid())
  );

create policy "members scoped by family"
  on members for all using (
    exists(
      select 1 from families f join town_members tm on tm.town_id = f.town_id
      where f.id = members.family_id and tm.user_id = auth.uid()
    )
  ) with check (
    exists(
      select 1 from families f join town_members tm on tm.town_id = f.town_id
      where f.id = members.family_id and tm.user_id = auth.uid()
    )
  );

create policy "rituals scoped by family"
  on rituals for all using (
    exists(
      select 1 from families f join town_members tm on tm.town_id = f.town_id
      where f.id = rituals.family_id and tm.user_id = auth.uid()
    )
  ) with check (
    exists(
      select 1 from families f join town_members tm on tm.town_id = f.town_id
      where f.id = rituals.family_id and tm.user_id = auth.uid()
    )
  );

-- Invite redemption RPC
create or replace function join_town_by_invite(invite_code_input text)
returns void
language plpgsql
security definer
as $$
declare
  matched_town_identifier uuid;
begin
  select town_id into matched_town_identifier from invites
    where code = invite_code_input and uses_left > 0
      and (expires_at is null or expires_at > now());
  if matched_town_identifier is null then
    raise exception 'invalid invite';
  end if;
  insert into town_members (town_id, user_id) values (matched_town_identifier, auth.uid())
    on conflict do nothing;
  update invites set uses_left = uses_left - 1 where code = invite_code_input;
end;
$$;
