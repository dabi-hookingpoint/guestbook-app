# 방명록 (Guestbook)

**작동 링크: https://guestbook-app-ecru.vercel.app**

Supabase를 백엔드로 쓰는 정적 방명록 앱. 이름 + 메시지를 남기면 실제 DB에 저장되고,
새로고침해도 남습니다. 튜토리얼 기본 기능에 **항목 삭제 기능**을 추가했습니다.

## 로컬에서 준비하기

1. [supabase.com](https://supabase.com) 가입 → New Project 생성 (비밀번호는 아무 텍스트 편집기에도 남기지 말 것)
2. 프로젝트 대시보드 > SQL Editor 에서 `schema.sql` 내용을 실행
3. 프로젝트 대시보드 > Project Settings > API 에서 `Project URL`, `anon public key` 확인
4. `config.example.js` 를 복사해 `config.js` 로 저장하고 위 두 값을 채워 넣기
5. `index.html` 을 더블클릭하거나 로컬 서버로 열어서 확인

## 배포하기 (Vercel 예시)

1. 이 폴더를 GitHub 저장소로 push (`config.js`의 anon key는 공개되어도 되는 키이므로 그대로 커밋)
2. [vercel.com](https://vercel.com) 가입 → New Project → 방금 만든 저장소 선택
3. Framework Preset: **Other** (정적 파일이라 빌드 커맨드 없음)

## 보안 체크 (제출 전 확인)

- [x] 비밀값을 코드에 직접 안 적고 `config.js`(env 역할)로 분리
- [x] RLS를 켜고 정책을 넣음 (`schema.sql`)
- [x] anon key는 "공개되어도 되는 키"이며, 실제 접근 제어는 RLS 정책이 담당
- [ ] 실서비스로 확장 시: 삭제 정책을 작성자 본인만 가능하도록 `auth.uid()` 기반으로 좁힐 것 (현재는 데모 목적으로 개방)

## 개선한 점

기본 방명록 튜토리얼에는 없는 **항목 삭제 버튼**을 추가함 (`app.js`의 `deleteEntry`, `schema.sql`의 delete policy).
