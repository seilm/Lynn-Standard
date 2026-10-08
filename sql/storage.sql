-- ============================================================
-- Lynn Standard — Supabase Storage 설정 (비공개 버킷)
-- schema.sql을 먼저 실행한 뒤 이 파일을 실행하세요. 이미 예전 버전(공개 버킷)을 실행했어도
-- 이 파일을 다시 실행하면 비공개로 전환됩니다(여러 번 실행해도 안전).
--
-- ⚠️ 먼저 새 app.js(서명 URL 사용)를 배포한 뒤에 실행하세요.
--    옛 app.js는 공개 URL을 쓰기 때문에, 버킷을 비공개로 바꾸면 첨부/지침서가 열리지 않습니다.
-- ============================================================

-- 첨부파일용 버킷 (비공개). 이미 있으면 public 값만 false로 바꾼다.
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do update set public = false;

-- 조회는 팀원·파트장이거나 조회 승인(view_approved)을 받은 계정만, 업로드/삭제는 팀원·파트장만
drop policy if exists attachments_select_public on storage.objects;
drop policy if exists attachments_select_viewer on storage.objects;
create policy attachments_select_viewer on storage.objects
  for select to authenticated using (bucket_id = 'attachments' and public.can_view());

drop policy if exists attachments_insert_writer on storage.objects;
create policy attachments_insert_writer on storage.objects
  for insert to authenticated with check (bucket_id = 'attachments' and public.can_write());

drop policy if exists attachments_delete_writer on storage.objects;
create policy attachments_delete_writer on storage.objects
  for delete to authenticated using (bucket_id = 'attachments' and public.can_write());

-- 실행지침서 PDF용 버킷 (비공개)
insert into storage.buckets (id, name, public)
values ('guidelines', 'guidelines', false)
on conflict (id) do update set public = false;

-- 조회는 팀원·파트장이거나 승인받은 조회자만, 업로드/삭제는 파트장·관리자만
drop policy if exists guidelines_select_public on storage.objects;
drop policy if exists guidelines_select_viewer on storage.objects;
create policy guidelines_select_viewer on storage.objects
  for select to authenticated using (bucket_id = 'guidelines' and public.can_view());

drop policy if exists guidelines_insert_lead on storage.objects;
create policy guidelines_insert_lead on storage.objects
  for insert to authenticated with check (bucket_id = 'guidelines' and public.can_manage_roster());

drop policy if exists guidelines_delete_lead on storage.objects;
create policy guidelines_delete_lead on storage.objects
  for delete to authenticated using (bucket_id = 'guidelines' and public.can_manage_roster());

-- 교체(upsert) 업로드를 쓰는 경우를 위해 update 정책도 같은 조건으로 둔다
drop policy if exists guidelines_update_lead on storage.objects;
create policy guidelines_update_lead on storage.objects
  for update to authenticated using (bucket_id = 'guidelines' and public.can_manage_roster())
  with check (bucket_id = 'guidelines' and public.can_manage_roster());
