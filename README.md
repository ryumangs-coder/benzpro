# 벤츠프로 랜딩페이지

운영: https://benzpro.co.kr
공통 작업 폴더: `/Users/mingookim/Downloads/benz-landing`
GitHub: https://github.com/ryumangs-coder/benzpro

HTML/CSS/JavaScript 정적 사이트입니다. 현재 빌드 패키지는 없습니다.

## 미리보기
```sh
python3 -m http.server 8080 --bind 127.0.0.1
```
브라우저에서 http://127.0.0.1:8080 을 엽니다. 종료는 Ctrl+C입니다.
이 미리보기는 Cloudflare의 `_redirects`, `_headers`, 실제 문의 백엔드를 재현하지 않습니다. 특히 `/chat` 리다이렉트는 이 서버에서 확인할 수 없습니다. 실제 상담을 제출하지 않습니다.

## 코드 검사
```sh
sh scripts/check.sh
```
Node가 PATH에 없다면 `NODE_BIN=/절대경로/node sh scripts/check.sh`로 실행합니다.

먼저 [작업 인수인계](docs/HANDOFF.md), [배포 절차](docs/DEPLOYMENT.md), [작업 기록](docs/WORKLOG.md)를 읽습니다.
