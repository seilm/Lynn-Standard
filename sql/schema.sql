-- ============================================================
-- Lynn Standard — Supabase schema
-- 실행 편성 기준(실행기준) 변경 이력 관리 도구
--
-- 적용 방법: Supabase 프로젝트 > SQL Editor 에서 이 파일 전체를 붙여넣고 실행하세요.
-- 순서: schema.sql 실행 → storage.sql 실행 → Authentication에서 Email 로그인 켜기
-- ============================================================

-- pgcrypto: gen_random_uuid() 사용을 위해 필요 (Supabase는 기본 활성화되어 있는 경우가 많음)
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1. profiles — 팀 구성원 (auth.users 1:1)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  display_name text,               -- 상단에 표시할 이름을 직접 지정 (예: "김세림 대리"). 비워두면 name 사용
  role text not null default '조회자' check (role in ('조회자','팀원','파트장')),
  is_admin boolean not null default false,   -- 최종 관리자(계정 잠김 대비 비상용). 앱에서는 노출 안 함, SQL로만 지정
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  added_by uuid references auth.users(id),
  added_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.profiles is '팀원 프로필/역할. 신규 가입자는 기본적으로 조회자로 생성됩니다.';

-- 신규 회원가입 시 자동으로 profiles 행 생성 (기본 역할: 조회자)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, first_seen_at, last_seen_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    now(), now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 역할 확인 헬퍼 (RLS 정책에서 재사용). SECURITY DEFINER로 profiles RLS 재귀 방지.
create or replace function public.current_role()
returns text
language sql
security definer set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.can_write()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce((select role in ('팀원','파트장') or is_admin from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.can_manage_roster()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce((select role = '파트장' or is_admin from public.profiles where id = auth.uid()), false);
$$;

-- ------------------------------------------------------------
-- 2. changes — 실행기준 변경 이력
-- ------------------------------------------------------------
create table if not exists public.changes (
  id uuid primary key default gen_random_uuid(),
  major text not null,
  minor text not null,
  title text not null,
  summary text not null,
  change_date text not null,           -- "YYYY-MM-DD" 또는 "YYYY-MM" (월 단위 정밀도 지원)
  effective_date text,
  effective_scope text default '전현장',
  reason text,
  urgency text check (urgency in ('required','confirm') or urgency is null),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  tags text[] not null default '{}',
  exec_items jsonb not null default '[]',
  attachments jsonb not null default '[]',
  submitted_by uuid references auth.users(id),
  submitted_by_name text,
  submitted_at timestamptz,
  approved_by uuid references auth.users(id),
  approved_by_name text,
  approved_at timestamptz,
  edited_by uuid references auth.users(id),
  edited_by_name text,
  edited_at timestamptz,
  reject_reason text,
  created_at timestamptz not null default now()
);

create index if not exists changes_change_date_idx on public.changes (change_date desc);
create index if not exists changes_status_idx on public.changes (status);
create index if not exists changes_major_minor_idx on public.changes (major, minor);

-- ------------------------------------------------------------
-- 3. sites — 현장 (실행 마감/체크리스트)
-- ------------------------------------------------------------
create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  deadline text,                        -- "YYYY-MM-DD"
  checklist_status text not null default 'draft' check (checklist_status in ('draft','pending_approval','approved')),
  applied_map jsonb not null default '{}',   -- { [changeId]: {by, byName, at} | null }
  submitted_by uuid references auth.users(id),
  submitted_by_name text,
  submitted_at timestamptz,
  approved_by uuid references auth.users(id),
  approved_by_name text,
  approved_at timestamptz,
  reopened_by uuid references auth.users(id),
  reopened_by_name text,
  reopened_at timestamptz,
  updated_by uuid references auth.users(id),
  updated_by_name text,
  updated_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists sites_name_idx on public.sites (name);

-- ------------------------------------------------------------
-- 4. Row Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.changes  enable row level security;
alter table public.sites    enable row level security;

-- profiles: 누구나(비로그인 포함) 목록 조회 가능(이름 표시용) / 본인 것은 본인이 수정 / 역할은 파트장만 변경
drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_all on public.profiles
  for select using (true);

-- 본인은 자기 행(이름/표시이름)을, 파트장·관리자는 아무 행이나(역할 변경) 수정 가능.
-- role/is_admin을 아래 트리거로 한 번 더 보호해서, 본인 스스로 역할을 올리는 걸 막는다.
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (auth.uid() = id or public.can_manage_roster());

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
  for insert with check (auth.uid() = id);

-- role/is_admin은 파트장·관리자만 바꿀 수 있도록 트리거로 강제(自기 자신의 role 셀프 승격 방지)
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.can_manage_roster() then
    new.role := old.role;
    new.is_admin := old.is_admin;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_role on public.profiles;
create trigger trg_protect_profile_role
  before update on public.profiles
  for each row execute procedure public.protect_profile_role();

-- changes: 조회는 전체 공개(비로그인 포함), 등록/수정/삭제는 팀원·파트장만
drop policy if exists changes_select_public on public.changes;
create policy changes_select_public on public.changes
  for select using (true);

drop policy if exists changes_insert_writer on public.changes;
create policy changes_insert_writer on public.changes
  for insert with check (public.can_write());

drop policy if exists changes_update_writer on public.changes;
create policy changes_update_writer on public.changes
  for update using (public.can_write());

drop policy if exists changes_delete_lead on public.changes;
create policy changes_delete_lead on public.changes
  for delete using (public.can_manage_roster());

-- sites: 조회는 전체 공개, 등록/수정은 팀원·파트장, 삭제는 파트장
drop policy if exists sites_select_public on public.sites;
create policy sites_select_public on public.sites
  for select using (true);

drop policy if exists sites_insert_writer on public.sites;
create policy sites_insert_writer on public.sites
  for insert with check (public.can_write());

drop policy if exists sites_update_writer on public.sites;
create policy sites_update_writer on public.sites
  for update using (public.can_write());

drop policy if exists sites_delete_lead on public.sites;
create policy sites_delete_lead on public.sites
  for delete using (public.can_manage_roster());

-- ------------------------------------------------------------
-- 5. Realtime (변경 즉시 반영)
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.changes;
alter publication supabase_realtime add table public.sites;
alter publication supabase_realtime add table public.profiles;
