-- Supabase 대시보드 > SQL Editor 에서 이 스크립트를 실행하세요.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 30),
  message text not null check (char_length(message) between 1 and 300),
  created_at timestamptz not null default now()
);

-- RLS 켜기: 공개 anon key로 접근하는 구조이므로 반드시 켜야 합니다.
alter table public.messages enable row level security;

-- 누구나 읽기 가능 (방명록 목록 공개)
create policy "public can read messages"
  on public.messages for select
  to anon
  using (true);

-- 누구나 쓰기 가능 (방명록이므로 로그인 없이 남길 수 있게)
create policy "public can insert messages"
  on public.messages for insert
  to anon
  with check (true);

-- 누구나 삭제 가능 (데모용 방명록 - 삭제 기능 데모를 위해 개방)
-- 실서비스라면 작성자 본인만 삭제하도록 auth.uid() 기반 정책으로 좁혀야 합니다.
create policy "public can delete messages"
  on public.messages for delete
  to anon
  using (true);
