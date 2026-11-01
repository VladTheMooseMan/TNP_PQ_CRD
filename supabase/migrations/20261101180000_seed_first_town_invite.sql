-- ============================================================
-- Migration: seed first town + fixed invite token
-- ------------------------------------------------------------
-- ASCII FLOW:
--   relax created_by not-null -> insert town -> insert invite
-- ============================================================

-- Seed migrations run as postgres (no auth.uid()). Allow null
-- so the default auth.uid() may return null for system seeds.
alter table towns alter column created_by drop not null;

-- Idempotent town seed.
insert into towns (id, name, created_by)
values ('11111111-1111-1111-1111-111111111111', 'Pickled Quill', null)
on conflict (id) do nothing;

-- Idempotent invite seed. Fixed code so the founder can hand it
-- out verbally. 50 uses, no expiration.
insert into invites (code, town_id, uses_left, expires_at)
values ('MOOSEMAN-01', '11111111-1111-1111-1111-111111111111', 50, null)
on conflict (code) do nothing;
