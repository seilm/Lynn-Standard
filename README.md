# Lynn Standard — 배포 가이드

건축예산팀 실행파트 실행 편성 기준 변경 이력 관리 사이트입니다. Supabase(데이터베이스+로그인+파일저장)와 GitHub Pages(무료 정적 호스팅)를 사용합니다. 누구나 인터넷으로 접속해서 조회할 수 있고, **팀원·파트장** 역할이 부여된 계정만 등록·수정·승인 권한을 가집니다. 새로 가입한 계정은 기본적으로 **조회자**(읽기 전용)로 등록됩니다.

## 폴더 구성

```
lynn-web/
├── index.html        ← 페이지 진입점
├── css/style.css      ← 스타일
├── js/
│   ├── config.js      ← ⚠️ 배포 전 이 파일에 Supabase 프로젝트 정보를 채워야 함
│   └── app.js          ← 전체 앱 로직
├── sql/
│   ├── schema.sql      ← 데이터베이스 테이블·권한 설정 (먼저 실행)
│   └── storage.sql     ← 첨부파일 저장소 설정 (그다음 실행)
└── README.md            ← 이 파일
```

## 1단계 — Supabase 프로젝트 준비

1. [supabase.com](https://supabase.com)에서 새 프로젝트를 만듭니다 (이미 있다면 그대로 사용).
2. 왼쪽 메뉴 **SQL Editor**를 엽니다.
3. `sql/schema.sql` 파일 내용 전체를 복사해서 붙여넣고 **Run**을 눌러 실행합니다.
4. 이어서 `sql/storage.sql` 파일 내용 전체를 복사해서 붙여넣고 **Run**을 눌러 실행합니다.
5. 왼쪽 메뉴 **Authentication → Providers**에서 **Email**이 켜져 있는지 확인합니다 (기본적으로 켜져 있습니다).
   - 팀 내부용으로만 쓸 거라면 **Authentication → Providers → Email**에서 "Confirm email"을 꺼두면, 가입 즉시 로그인되어 더 간편합니다 (꺼지 않으면 가입 후 확인 메일의 링크를 눌러야 로그인할 수 있어요).

## 2단계 — 연결 정보 입력

1. Supabase 프로젝트의 **Project Settings → API** 페이지를 엽니다.
2. **Project URL**과 **anon public** 키를 복사합니다.
3. 이 프로젝트의 `js/config.js` 파일을 열어 아래처럼 채워 넣습니다.

```js
window.LYNN_CONFIG = {
  url: "https://xxxxxxxxxxxx.supabase.co",
  anonKey: "eyJhbGciOi..."
};
```

`anonKey`(anon public key)는 브라우저에 그대로 노출되어도 안전하도록 설계된 키입니다. 실제 접근 권한은 `schema.sql`에서 설정한 Row Level Security(행 단위 보안) 정책이 담당합니다.

## 3단계 — 첫 관리자(파트장) 계정 만들기

가입만으로는 모든 계정이 조회자로 시작하기 때문에, 최초 1명은 SQL로 직접 파트장 권한을 줘야 합니다.

1. 배포된(또는 로컬의) 사이트에 접속해서 **회원가입**으로 본인 계정을 하나 만듭니다.
2. Supabase **SQL Editor**에서 아래 쿼리를 실행합니다. `본인이메일` 부분만 가입한 이메일로 바꿔주세요.

```sql
update public.profiles
set role = '파트장'
where id = (select id from auth.users where email = '본인이메일@example.com');
```

3. 사이트를 새로고침하면 파트장 권한(등록·수정·승인·팀원 역할 관리)이 생깁니다.
4. 이후 다른 팀원들은 각자 회원가입만 하면 되고, 파트장이 **설정** 페이지에서 그들의 역할을 팀원/파트장으로 바꿔주면 됩니다.

(선택) 파트장 계정이 실수로 잠기는 것에 대비해 `is_admin` 플래그도 함께 둘 수 있습니다: `update public.profiles set is_admin = true where id = ...;` — `is_admin = true`인 계정은 앱 화면에는 별도로 드러나지 않지만 파트장과 동일한 관리 권한을 가집니다.

## 4단계 — GitHub Pages로 배포

1. GitHub에 새 저장소를 만들고, 이 `lynn-web` 폴더의 내용 전체(이 README 포함)를 푸시합니다.
   - `js/config.js`에 실제 anon key가 들어가는데, anon key는 공개되어도 안전한 키이므로 공개(public) 저장소에 올려도 괜찮습니다.
2. 저장소의 **Settings → Pages**로 이동합니다.
3. **Source**를 `Deploy from a branch`로, **Branch**를 `main`(또는 사용 중인 기본 브랜치) `/ (root)`로 설정하고 저장합니다.
4. 몇 분 뒤 `https://사용자명.github.io/저장소명/` 주소로 사이트가 열립니다.

## 로컬에서 먼저 확인해보기

배포 전에 로컬에서 미리 확인하려면, `lynn-web` 폴더에서 아무 정적 서버나 띄우면 됩니다. 예:

```bash
npx serve .
# 또는
python3 -m http.server 8080
```

그 다음 브라우저로 `http://localhost:8080` (또는 표시된 주소)에 접속합니다. `js/config.js`에 Supabase 정보가 채워져 있어야 로그인 화면이 정상적으로 나타납니다 — 채워지지 않았다면 "설정이 필요해요" 안내가 표시됩니다.

## 이번 버전에서 빠진 기능

원래 Claude Artifact 버전에 있던 아래 두 기능은 이번 자체 호스팅 버전에서는 뺐습니다 (요청하신 대로, 나머지 기능부터 먼저 완성했습니다). 필요하면 나중에 추가로 요청해주세요.

- **AI 검색**: 자체 AI API 키 발급 + 요청을 처리할 서버(서버리스 함수)가 별도로 필요해서 제외했습니다.
- **팀원 추가 시 검색/일괄 추천**: 예전 버전은 Claude 플랫폼이 제공하는 "가입된 사용자 검색" 기능을 썼는데, Supabase에는 이런 공개 검색 API가 없습니다. 그래서 이번 버전은 "먼저 회원가입 → 설정 페이지에서 역할 변경" 흐름으로 바뀌었습니다 (위 3단계 참고).

## 문제가 생기면

- 로그인 화면 대신 **"설정이 필요해요"**가 보인다 → `js/config.js`에 URL/키가 아직 기본값(`YOUR-PROJECT`)입니다.
- 가입은 되는데 **아무 데이터도 안 보인다** → `sql/schema.sql`을 실행하지 않았거나 일부만 실행됐을 수 있습니다. SQL Editor에서 다시 전체 실행해보세요.
- 파일 첨부가 안 된다 → `sql/storage.sql`을 실행했는지 확인하세요.
- 로그인은 되는데 **등록 버튼이 안 보인다** → 정상입니다. 신규 가입자는 조회자로 시작합니다. 3단계의 SQL로 최초 1명을 파트장으로 올린 뒤, 그 사람이 설정 페이지에서 다른 사람 역할을 바꿔주면 됩니다.
