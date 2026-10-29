# 랜딩페이지 배포 경로

## 확인된 사실 (2026-10-29)
- 저장소: `https://github.com/ryumangs-coder/benzpro.git`
- 원격 main: `9ef18fbb5f9cf8a94cced5fc71623310585a67fa`
- 정리 전 로컬 main은 50개 커밋 뒤처졌지만, 원격 추적 파일 900개의 바이트는 모두 현재 로컬 파일과 일치했습니다.
- 전체 백업 후 `git reset --mixed origin/main`으로 Git 이력/인덱스만 맞췄습니다. 사이트 소스 파일은 바꾸지 않았습니다.
- `_redirects`에는 Cloudflare Pages용 `/chat` 상담 리다이렉트가 있습니다.
- 공개 home.js는 로컬과 같고 index.html HTTP 응답 바이트는 로컬과 다릅니다. 응답 변환 가능성을 포함해 배포 상세에서 확인해야 하며, 이것만으로 버전 불일치를 단정하지 않습니다.

## 확인 상태
Cloudflare 관리 화면 검증 결과는 아래 최신 항목에 기록했습니다. 운영 자동 배포 경로는 확인됐으며, 별도 미리보기 환경은 미설정입니다.

## 표준 절차
1. 작업 브랜치에서 수정하고 로컬 화면과 코드 검사를 확인합니다.
2. 변경을 커밋하고 변경 내용/검증 결과를 검토합니다.
3. 미리보기 배포 연결이 확인된 경우 그 경로로 검증합니다.
4. 운영 배포가 승인되면 확인된 운영 브랜치/배포 방식으로 반영합니다. main push가 즉시 배포될 수 있습니다.
5. 실제 도메인의 화면·가격 계산·상담 링크·분석 이벤트를 확인하고 커밋/배포 ID를 기록합니다.

## 복구
Cloudflare에서 확인된 직전 정상 배포로 복구한 뒤 소스도 해당 버전과 맞춥니다. Git 이력은 필요한 변경만 `git revert`로 되돌립니다. 전체 폴더를 무조건 덮어쓰거나 `reset --hard`로 복구하지 않습니다.

## Cloudflare 관리 화면 검증 완료 (2026-10-29)
- 실제 서비스: **Workers 정적 자산 전용**, Worker 이름 `benzpro` (Pages 아님).
- 도메인 `benzpro.co.kr`, workers.dev `benzpro.mingoozoara.workers.dev`.
- GitHub `ryumangs-coder/benzpro`, 운영 브랜치 `main`, Root `/`.
- Build command 없음, Deploy command `npx wrangler deploy`, Version command `npx wrangler versions upload`.
- 비운영 브랜치 빌드는 활성화되어 있으나 Worker Previews는 아직 미설정. 미리보기 분리 완료로 간주하지 않습니다.
- 활성 배포 `1807f541`, Git 커밋 `9ef18fbb5f9cf8a94cced5fc71623310585a67fa`, 100% Ready.
- compatibility date `2026-10-23`, runtime bindings/변수 없음. Cron 없음.
- `main` push는 운영 자동 배포를 유발하므로 배포 승인 전에는 push하지 않습니다.
- `.assetsignore`로 인수인계 문서와 개발 도구가 공개 자산에 포함되지 않도록 구성했습니다. Cloudflare에 아직 반영하지 않았습니다.
- 기존 `_redirects` 주석의 Pages 표현은 과거 설명입니다. 실제 서비스는 Workers Static Assets입니다.

확인된 배포 경로: 로컬 수정/검사 → Git commit → 승인 후 GitHub main push → Workers Builds → benzpro.co.kr 확인.
