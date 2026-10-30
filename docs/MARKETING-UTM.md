# 외부 채널 UTM 운영 규칙

모든 외부 홍보 링크는 아래 벤츠프로 추적 주소를 사용합니다. GA4에서 세션 소스·매체·캠페인과 전화·카카오·문의폼 전환을 함께 비교할 수 있습니다.

| 채널 | 주소 형식 | 예시 |
| --- | --- | --- |
| YouTube | `https://benzpro.co.kr/go/youtube/<campaign>` | `https://benzpro.co.kr/go/youtube/e300-4matic-review` |
| 네이버 | `https://benzpro.co.kr/go/naver/<campaign>` | `https://benzpro.co.kr/go/naver/gle-october-promo` |
| Instagram | `https://benzpro.co.kr/go/instagram/<campaign>` | `https://benzpro.co.kr/go/instagram/gls580-reel` |

- `campaign`은 영문 소문자, 숫자, 하이픈만 사용합니다.
- 차종·콘텐츠·월을 포함해 구분합니다. 예: `e300-4matic-review`, `gle-october-promo`.
- 이름·전화번호·이메일·고객사명 등 개인정보 및 자유 입력값은 넣지 않습니다.
- 각 영상/게시물의 설명·고정댓글·프로필 링크에 원문 랜딩 URL 대신 위 주소를 사용합니다.

리디렉션 후에는 메인 페이지로 이동하며, UTM은 `utm_source`, `utm_medium`, `utm_campaign`으로 GA4에 전달됩니다.
