#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
node_bin="${NODE_BIN:-node}"
if ! command -v "$node_bin" >/dev/null 2>&1; then
  echo 'Node가 필요합니다. NODE_BIN=/절대경로/node sh scripts/check.sh 로 실행하세요.' >&2
  exit 1
fi
for source_file in ./*.js; do
  "$node_bin" --check "$source_file"
done
git diff --check
printf '%s\n' 'JavaScript 구문 및 diff 공백 검사 통과. 화면/가격 계산/상담 동작은 별도 확인이 필요합니다.'
