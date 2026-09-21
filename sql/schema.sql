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
  view_approved boolean not null default false,  -- 조회자가 실제 내용(변경 이력/지침서)을 볼 수 있는지. 팀원·파트장은 role 자체로 항상 볼 수 있어 이 값과 무관.
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  added_by uuid references auth.users(id),
  added_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.profiles is '팀원 프로필/역할. 신규 가입자는 기본적으로 조회자로 생성됩니다.';

-- 이미 profiles 테이블이 있던 배포본(즉 위 create table이 그냥 건너뛰어진 경우)을 위해
-- view_approved 컬럼을 별도로 추가해준다. 아래 can_view() 함수가 이 컬럼을 참조하므로,
-- 그 함수보다 반드시 먼저 실행돼야 한다 (나중에 실행하면 "column view_approved does not exist" 에러로
-- 스크립트 전체가 중단되고, 그러면 이후의 guideline_docs 등 테이블 생성까지 전부 실행되지 않는다).
alter table public.profiles add column if not exists view_approved boolean not null default false;

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

-- 모든 기준이 대외비라, 조회자(기본 역할)는 팀원·파트장 중 누군가 승인(view_approved=true)해줘야
-- 실제 변경 이력/지침서 내용을 볼 수 있다. 팀원·파트장은 역할 자체로 항상 조회 가능.
create or replace function public.can_view()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce((select role in ('팀원','파트장') or is_admin or view_approved from public.profiles where id = auth.uid()), false);
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
  applied_guidelines jsonb not null default '{}',   -- { [major]: 그 시점 guideline_docs.uploaded_at } — 이 현장에 어느 개정판 지침서가 반영됐는지 기록
  manager_id uuid references auth.users(id),        -- 이 현장의 담당자
  manager_name text,
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

-- 이미 sites 테이블이 있던 배포본에는 위 create table이 그냥 건너뛰어지므로,
-- applied_guidelines / manager_id / manager_name 컬럼이 없을 수 있는 기존 배포본을 위해 별도로 추가해준다.
alter table public.sites add column if not exists applied_guidelines jsonb not null default '{}';
alter table public.sites add column if not exists manager_id uuid references auth.users(id);
alter table public.sites add column if not exists manager_name text;

-- ------------------------------------------------------------
-- 3-1. guideline_docs — 실행지침서 PDF (공통가설/건축/현장관리비, 각 1건)
-- id는 major 이름 대신 영문 고정 id 사용 ('common' | 'arch' | 'sitecost')
-- 페이지별 텍스트는 용량 제한(문서당 256KiB) 때문에 이 테이블에 직접 넣지 않고
-- guideline_chunks 테이블에 여러 조각으로 나눠 저장한다 (아래 3-2 참고).
-- ------------------------------------------------------------
create table if not exists public.guideline_docs (
  id text primary key,          -- 'common' | 'arch' | 'sitecost' (major 이름 대신 영문 고정 id)
  major text,                   -- 화면에 보여줄 대공종 이름 ('공통가설' | '건축' | '현장관리비')
  file_name text,
  url text,
  page_count int not null default 0,
  chunk_count int not null default 0,       -- guideline_chunks 에 나눠 저장된 조각 개수
  uploaded_by uuid references auth.users(id),
  uploaded_by_name text,
  uploaded_at timestamptz,
  updated_at timestamptz not null default now()
);

comment on table public.guideline_docs is '실행지침서 PDF 3종(공통가설/건축/현장관리비)의 메타정보. 반기 개정 등으로 교체될 때마다 파트장이 설정 페이지에서 업로드하면, 페이지별 텍스트는 guideline_chunks 테이블에 자동 추출되어 지침서 검색에 쓰인다.';

-- ------------------------------------------------------------
-- 3-2. guideline_chunks — 실행지침서 페이지별 텍스트 (검색용, 조각 단위 저장)
-- id는 '{doc_id}_{chunk_index}' 형식 (예: 'arch_0', 'arch_1', ...)
-- 문서 하나(특히 200페이지 안팎의 건축 지침서)를 통째로 저장하면 용량 제한을
-- 넘을 수 있어서, 페이지들을 여러 조각으로 나눠 저장하고 검색 시 다시 합친다.
-- ------------------------------------------------------------
create table if not exists public.guideline_chunks (
  id text primary key,          -- '{doc_id}_{chunk_index}'
  doc_id text not null references public.guideline_docs(id) on delete cascade,
  chunk_index int not null,
  pages jsonb not null default '[]',        -- [{page:1, text:"..."}, ...]
  updated_at timestamptz not null default now()
);

create index if not exists guideline_chunks_doc_id_idx on public.guideline_chunks (doc_id);

comment on table public.guideline_chunks is 'guideline_docs 각 문서의 페이지별 텍스트를 용량 제한을 피해 여러 조각으로 나눠 저장하는 테이블.';

-- ------------------------------------------------------------
-- 3-3. guideline_revisions — 실행지침서 업로드(개정) 이력
-- guideline_docs는 대공종별 "현재" 판만 담고 있어서, 업로드할 때마다 이 테이블에도
-- 스냅샷을 하나씩 남겨 "몇 번 개정됐는지 / 과거에 어떤 판이 있었는지"를 확인하고,
-- 현장별로 실제 반영한 판을 과거 이력 중에서 골라 기록할 수 있게 한다.
-- id는 '{doc_id}_r{timestamp}' 형식.
-- ------------------------------------------------------------
create table if not exists public.guideline_revisions (
  id text primary key,          -- '{doc_id}_r{timestamp}'
  doc_id text not null references public.guideline_docs(id) on delete cascade,
  major text,
  file_name text,
  url text,
  page_count int not null default 0,
  uploaded_by uuid references auth.users(id),
  uploaded_by_name text,
  uploaded_at timestamptz,      -- 지침서에 적힌 실제 개정일
  created_at timestamptz not null default now()
);

create index if not exists guideline_revisions_doc_id_idx on public.guideline_revisions (doc_id);
create index if not exists guideline_revisions_major_idx on public.guideline_revisions (major);

comment on table public.guideline_revisions is '실행지침서(guideline_docs)를 업로드할 때마다 남기는 이력 스냅샷. 설정 페이지의 "변경 이력"과 현장 상세의 판 선택 드롭다운에 쓰인다.';

-- ------------------------------------------------------------
-- 4. Row Level Security
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.changes  enable row level security;
alter table public.sites    enable row level security;
alter table public.guideline_docs enable row level security;
alter table public.guideline_chunks enable row level security;
alter table public.guideline_revisions enable row level security;

-- profiles: 누구나(비로그인 포함) 목록 조회 가능(이름 표시용) / 본인 것은 본인이 수정 / 역할은 파트장만 변경
drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_all on public.profiles
  for select using (true);

-- 본인은 자기 행(이름/표시이름)을, 파트장·관리자는 아무 행이나(역할 변경) 수정 가능.
-- 팀원도 다른 사람 행을 수정할 수 있게 열어두는 건 조회자 승인(view_approved)을 팀원도 할 수 있게 하기 위함이고,
-- role/is_admin/view_approved는 아래 트리거로 한 번 더 보호해서 팀원이 역할까지 바꾸지 못하게 막는다.
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (auth.uid() = id or public.can_write());

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
  for insert with check (auth.uid() = id);

-- role/is_admin은 파트장·관리자만 바꿀 수 있도록 트리거로 강제(自기 자신의 role 셀프 승격 방지)
-- 추가로, 본인이 파트장인 경우 실수로든 고의로든 스스로를 파트장에서 내릴 수 없도록 막는다
-- (다른 파트장/관리자가 그 사람의 role을 바꾸는 것은 계속 가능).
-- view_approved(조회 승인)는 팀원도 바꿀 수 있어야 하므로 can_write()(팀원·파트장) 기준으로 별도 보호한다.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.can_manage_roster() then
    new.role := old.role;
    new.is_admin := old.is_admin;
  elsif auth.uid() = old.id and old.role = '파트장' and new.role <> '파트장' then
    new.role := old.role;
  end if;
  if not public.can_write() then
    new.view_approved := old.view_approved;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_profile_role on public.profiles;
create trigger trg_protect_profile_role
  before update on public.profiles
  for each row execute procedure public.protect_profile_role();

-- changes: 조회는 팀원·파트장이거나 승인받은 조회자만(대외비), 등록/수정/삭제는 팀원·파트장만
drop policy if exists changes_select_public on public.changes;
create policy changes_select_public on public.changes
  for select using (public.can_view());

drop policy if exists changes_insert_writer on public.changes;
create policy changes_insert_writer on public.changes
  for insert with check (public.can_write());

drop policy if exists changes_update_writer on public.changes;
create policy changes_update_writer on public.changes
  for update using (public.can_write());

drop policy if exists changes_delete_lead on public.changes;
create policy changes_delete_lead on public.changes
  for delete using (public.can_manage_roster());

-- sites: 조회는 팀원·파트장이거나 승인받은 조회자만, 등록/수정은 팀원·파트장, 삭제는 파트장
drop policy if exists sites_select_public on public.sites;
create policy sites_select_public on public.sites
  for select using (public.can_view());

drop policy if exists sites_insert_writer on public.sites;
create policy sites_insert_writer on public.sites
  for insert with check (public.can_write());

drop policy if exists sites_update_writer on public.sites;
create policy sites_update_writer on public.sites
  for update using (public.can_write());

drop policy if exists sites_delete_lead on public.sites;
create policy sites_delete_lead on public.sites
  for delete using (public.can_manage_roster());

-- guideline_docs: 조회는 팀원·파트장이거나 승인받은 조회자만, 업로드/수정/삭제는 파트장·관리자만
-- (반기에 한 번 교체되는 기준문서라, 아무 팀원이나 바꾸기보다는 파트장이 관리하도록 제한한다)
drop policy if exists guideline_docs_select_public on public.guideline_docs;
create policy guideline_docs_select_public on public.guideline_docs
  for select using (public.can_view());

drop policy if exists guideline_docs_write_lead on public.guideline_docs;
create policy guideline_docs_write_lead on public.guideline_docs
  for all using (public.can_manage_roster()) with check (public.can_manage_roster());

-- guideline_chunks: 조회는 팀원·파트장이거나 승인받은 조회자만, 업로드/수정/삭제는 파트장·관리자만
drop policy if exists guideline_chunks_select_public on public.guideline_chunks;
create policy guideline_chunks_select_public on public.guideline_chunks
  for select using (public.can_view());

drop policy if exists guideline_chunks_write_lead on public.guideline_chunks;
create policy guideline_chunks_write_lead on public.guideline_chunks
  for all using (public.can_manage_roster()) with check (public.can_manage_roster());

-- guideline_revisions: 조회는 팀원·파트장이거나 승인받은 조회자만, 기록은 파트장·관리자만 (업로드할 때 자동으로 남겨진다)
drop policy if exists guideline_revisions_select_public on public.guideline_revisions;
create policy guideline_revisions_select_public on public.guideline_revisions
  for select using (public.can_view());

drop policy if exists guideline_revisions_write_lead on public.guideline_revisions;
create policy guideline_revisions_write_lead on public.guideline_revisions
  for all using (public.can_manage_roster()) with check (public.can_manage_roster());

-- ------------------------------------------------------------
-- 5. Realtime (변경 즉시 반영)
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.changes;
alter publication supabase_realtime add table public.sites;
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.guideline_docs;
alter publication supabase_realtime add table public.guideline_chunks;
alter publication supabase_realtime add table public.guideline_revisions;
