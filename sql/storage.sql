-- ============================================================
-- Lynn Standard — Supabase Storage 설정
-- schema.sql을 먼저 실행한 뒤 이 파일을 실행하세요.
-- ============================================================

-- 첨부파일용 버킷 생성 (이미 있으면 무시)
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', true)
on conflict (id) do nothing;

-- 조회는 누구나(공개 버킷), 업로드/삭제는 팀원·파트장만
drop policy if exists attachments_select_public on storage.objects;
create policy attachments_select_public on storage.objects
  for select using (bucket_id = 'attachments');

drop policy if exists attachments_insert_writer on storage.objects;
create policy attachments_insert_writer on storage.objects
  for insert with check (bucket_id = 'attachments' and public.can_write());

drop policy if exists attachments_delete_writer on storage.objects;
create policy attachments_delete_writer on storage.objects
  for delete using (bucket_id = 'attachments' and public.can_write());

-- 실행지침서 PDF용 버킷 생성 (이미 있으면 무시)
insert into storage.buckets (id, name, public)
values ('guidelines', 'guidelines', true)
on conflict (id) do nothing;

-- 조회는 누구나(공개 버킷), 업로드/삭제는 파트장·관리자만 (지침서는 반기 개정 등 드물게 교체되는 기준문서)
drop policy if exists guidelines_select_public on storage.objects;
create policy guidelines_select_public on storage.objects
  for select using (bucket_id = 'guidelines');

drop policy if exists guidelines_insert_lead on storage.objects;
create policy guidelines_insert_lead on storage.objects
  for insert with check (bucket_id = 'guidelines' and public.can_manage_roster());

drop policy if exists guidelines_delete_lead on storage.objects;
create policy guidelines_delete_lead on storage.objects
  for delete using (bucket_id = 'guidelines' and public.can_manage_roster());
