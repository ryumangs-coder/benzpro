/*
 * 차종 비교(models.html) 제원 해석 모듈
 * - 제원 한 줄: 쉬운 설명, 두 값, 차이, 우열 또는 크기 차이, 해석, 출처
 * - 핵심 차이 요약, 치수 그림(SVG), 전기차·PHEV 배터리 정보, 신형 일렉트릭 GLB와 EQB 세대 비교 카드
 * 판정 원칙
 * - up/down(클수록·작을수록 강점)도 연식·동력 방식·구동 방식·측정 기준이 다르면 우세를 붙이지 않고 차이만 적습니다.
 * - size(크기·무게)는 우세 대신 "더 큼/더 작음"과 생활 속 의미만 적습니다.
 * - ref(배터리 용량·트렁크)는 측정 기준 표기가 없어 참고용으로만 차이를 적습니다.
 * - 값이 없으면 숫자를 만들지 않고 "공식 자료 확인 필요"로 둡니다.
 */
(function () {
  var CHECKED = "2026-10-28";
  var SOURCES = {
    battery: {
      by: "메르세데스-벤츠 코리아 · 전기차 차종별 배터리 셀 제조사 현황",
      url: "https://www.mercedes-benz.co.kr/passengercars/electric-battery.html",
      checked: CHECKED
    },
    newsis: {
      by: "뉴시스 기사(벤츠코리아 발표 인용, 2026.10.28)",
      url: "https://www.newsis.com/view/NISX20261028_0003844233",
      checked: CHECKED,
      article: true
    },
    store: {
      by: "메르세데스-벤츠 스토어 공식 상세(사전예약, 사양 참고용)",
      url: "https://www.mercedes-benz.co.kr/passengercars/buy/new-car/product.html/MBJ3H2FF9C",
      checked: CHECKED
    }
  };

  /* 항목 설명. kind: up(클수록 강점) · down(작을수록 강점) · size(크기 차이만) · ref(참고용 차이) · info(차이만) · text(같음/다름) */
  var META = {
    "길이": { kind: "size", unit: "mm", name: "전장 (차 길이)", plain: "차 앞끝에서 뒤끝까지의 길이예요.", big: "더 깁니다",
      small: function (s, o) { return s + " 차가 더 짧아 좁은 길과 주차 칸에서 다루기 편할 수 있어요. " + o + " 차는 실내·트렁크를 설계할 여유가 생길 수 있어요."; } },
    "너비": { kind: "size", unit: "mm", basisCheck: true, name: "전폭 (차 너비)", plain: "차 왼쪽 끝에서 오른쪽 끝까지의 폭이에요. 사이드미러 포함 여부는 자료마다 다를 수 있어요.", big: "더 넓습니다",
      small: function (s, o) { return s + " 차가 더 좁아 골목이나 주차장 기둥 사이를 지나기 편할 수 있어요. " + o + " 차는 옆자리에 여유가 생길 수 있어요."; } },
    "높이": { kind: "size", unit: "mm", name: "전고 (차 높이)", plain: "땅에서 지붕까지의 높이예요.", big: "더 높습니다",
      small: function (s, o) { return s + " 차가 더 낮아 높이 제한이 있는 주차장에 여유가 있을 수 있어요. " + o + " 차는 타고 내리기와 머리 위 공간에 유리할 수 있어요."; } },
    "휠베이스": { kind: "size", unit: "mm", name: "휠베이스 (앞뒤 바퀴 사이)", plain: "앞바퀴 중심에서 뒷바퀴 중심까지의 거리예요.", big: "더 깁니다",
      bigSay: function (b) { return b + " 차가 더 길어 보통 뒷좌석 공간을 확보하는 데 유리할 수 있지만, 실제 실내 공간은 차체 설계에 따라 달라집니다."; } },
    "공차중량": { kind: "size", unit: "kg", name: "공차중량 (차 무게)", plain: "사람과 짐을 싣지 않은 차의 무게예요.", big: "더 무겁습니다",
      small: function (s) { return s + " 차가 더 가벼워 연비·전비에 유리할 수 있어요. 무게만으로 좋고 나쁨을 정하지는 않아요."; } },
    "배기량": { kind: "size", unit: "cc", name: "배기량 (엔진 크기)", plain: "엔진의 크기예요. 국내 자동차세를 매기는 기준이기도 해요.", big: "더 큽니다",
      say: "배기량이 크다고 무조건 힘이 센 것은 아니에요. 터보·하이브리드 같은 기술에 따라 힘이 달라져요." },
    "최고출력": { kind: "up", unit: "ps", perf: true, name: "최고출력 (낼 수 있는 최대 힘)", plain: "엔진이 낼 수 있는 가장 큰 힘이에요. 단위는 마력(ps)이에요.", more: "더 높습니다", short: "최고출력",
      say: "높으면 고속 추월이나 오르막에서 여유가 생길 수 있어요. 실제 가속감은 무게와 변속기에 따라 달라요." },
    "모터 최고출력": { kind: "up", unit: "kW", perf: true, name: "모터 최고출력", plain: "전기 모터가 낼 수 있는 가장 큰 힘이에요. 1kW는 약 1.36마력이에요.", more: "더 높습니다", short: "모터 출력",
      say: "높으면 가속과 고속에서 여유가 생길 수 있어요." },
    "최대토크": { kind: "up", unit: "kg·m", perf: true, name: "최대토크 (바퀴를 미는 힘)", plain: "출발하거나 언덕을 오를 때 바퀴를 돌리는 힘이에요.", more: "더 높습니다", short: "토크",
      say: "높으면 출발과 언덕길에서 힘의 여유를 느끼기 쉬워요." },
    "0-100km/h": { kind: "down", unit: "초", perf: true, name: "0→100km/h (가속 시간)", plain: "멈춘 상태에서 시속 100km에 이를 때까지 걸리는 시간이에요. 짧을수록 빨라요.", less: "더 빠릅니다", short: "가속",
      say: "제조사가 잰 값이라 실제 도로에서는 노면과 적재에 따라 달라져요. 가속감은 시승으로 확인하세요." },
    "최고속도": { kind: "info", unit: "km/h", name: "최고속도", plain: "낼 수 있는 가장 빠른 속도예요.", big: "더 높습니다",
      say: "국내 도로 제한속도를 생각하면 일상에서는 차이를 느끼기 어려워요." },
    "복합연비": { kind: "up", unit: "", perf: true, name: "복합연비 (연료 1단위로 가는 거리)", plain: "기름 1L(또는 전기 1kWh)로 갈 수 있는 거리예요. 높을수록 연료비가 덜 들어요.", more: "더 높습니다", short: "연비",
      say: "기름(km/L)과 전기(km/kWh)는 서로 비교할 수 없어요. 실제 연비는 운전 습관과 날씨에 따라 달라져요." },
    "1회 충전 주행거리": { kind: "up", unit: "km", perf: true, range: true, name: "국내 인증 주행거리", plain: "국내 인증 기준으로 한 번 충전해 갈 수 있는 거리예요.", more: "더 깁니다", short: "국내 인증 주행거리",
      say: "기온, 속도, 휠 크기에 따라 실제 주행거리는 달라져요. WLTP 수치와는 기준이 달라 섞어 비교하지 않아요." },
    "WLTP 주행거리": { kind: "up", unit: "km", perf: true, range: true, name: "WLTP 기준 주행거리 (유럽 시험)", plain: "유럽 시험 기준(WLTP)으로 잰 거리예요. 국내 인증과 시험 방식이 달라요.", more: "더 깁니다", short: "WLTP 주행거리",
      say: "국내 실주행거리가 아니에요. 기온·속도·휠 사양에 따라 실제 거리는 달라져요." },
    "배터리": { kind: "ref", unit: "kWh", name: "배터리 용량", plain: "전기를 담는 배터리의 크기예요.", big: "더 큽니다",
      say: "'사용 가능 용량'인지 '전체 용량'인지 표기가 없어 참고용으로만 차이를 적었어요." },
    "트렁크": { kind: "ref", unit: "L", name: "트렁크 (뒤쪽 짐 공간)", plain: "앞 숫자는 기본, 뒤 숫자는 뒷좌석을 접었을 때예요.", big: "더 큽니다",
      say: "재는 방법 표기가 없어 기본 용량 기준으로 참고만 하세요." },
    "전면 트렁크": { kind: "ref", unit: "L", name: "전면 트렁크 (앞쪽 짐 공간)", plain: "엔진 대신 앞쪽에 둔 작은 짐 공간이에요.", big: "더 큽니다", say: "충전 케이블 같은 작은 짐을 넣기 좋아요." },
    "급속 충전": { kind: "text", name: "급속 충전", plain: "휴게소 같은 빠른 충전기로 충전할 때의 최대 속도예요." },
    "전기 아키텍처": { kind: "text", name: "전기 아키텍처 (고전압 시스템)", plain: "차 안 고전압 전기 시스템의 전압이에요. 높으면 급속 충전을 빠르게 하는 설계에 쓰여요." },
    "연료탱크": { kind: "info", unit: "L", name: "연료탱크", plain: "기름을 채우는 통의 크기예요.", big: "더 큽니다", say: "크면 한 번 주유로 더 멀리 갈 수 있어요." },
    "연료": { kind: "text", name: "연료", plain: "차를 움직이는 에너지예요." },
    "구동": { kind: "text", name: "구동 방식", plain: "엔진·모터의 힘이 어느 바퀴로 가는지예요.", say: "사륜구동은 네 바퀴에 힘을 나눠 젖은 길이나 눈길 출발에 도움이 될 수 있어요." },
    "변속기": { kind: "text", name: "변속기", plain: "속도에 맞춰 기어를 바꾸는 장치예요." },
    "엔진": { kind: "text", name: "엔진", plain: "엔진의 형식이에요." },
    "타이어": { kind: "text", name: "타이어 규격", plain: "폭/높이 비율 R 휠 크기(인치) 순서예요. 앞·뒤가 다르면 두 개를 적어요." },
    "서스펜션": { kind: "text", name: "서스펜션", plain: "노면 충격을 걸러 주는 장치예요. 승차감은 숫자로 비교할 수 없어 시승으로 확인하세요." },
    "브레이크": { kind: "text", name: "브레이크", plain: "차를 멈추는 장치의 형식이에요." },
    "승차 정원": { kind: "info", unit: "인", name: "승차 정원", plain: "탈 수 있는 사람 수예요.", big: "더 많습니다" },
    "연비 등급": { kind: "text", name: "연비 등급", plain: "국내 에너지소비효율 등급이에요. 숫자가 작을수록 효율이 좋아요." },
    "도심 · 고속 연비": { kind: "text", name: "도심 · 고속 연비", plain: "시내와 고속도로에서 따로 잰 연비예요." },
    "스페어 타이어": { kind: "text", name: "스페어 타이어", plain: "펑크가 났을 때 쓰는 예비 타이어나 수리 키트예요." }
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function metaOf(label) {
    return META[label] || { kind: "text", name: label, plain: "" };
  }
  var MISSING = /^(—|-|)$|정보가 아직 없습니다|확인 필요/;
  function isMissing(v) {
    return MISSING.test(String(v == null ? "" : v).trim());
  }
  function notPublic(v) {
    return /미공개/.test(String(v || ""));
  }
  /* 단위에 맞는 첫 숫자. 트렁크처럼 "540–1,715L"이면 기본(앞) 값 */
  function numOf(label, text) {
    var m = metaOf(label);
    var s = String(text || "").replace(/(\d),(\d{3})/g, "$1$2");
    if (label === "복합연비") {
      if (/km\/kWh/.test(s) && /km\/L/.test(s)) return null;
      var e = s.match(/(\d+(?:\.\d+)?)\s*(km\/kWh|km\/L)/);
      return e ? { n: parseFloat(e[1]), unit: e[2] } : null;
    }
    var unit = m.unit || "";
    var re = unit ? new RegExp("(\\d+(?:\\.\\d+)?)\\s*(?:[–~-]\\s*\\d+(?:\\.\\d+)?\\s*)?" + unit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) : /(\d+(?:\.\d+)?)/;
    var hit = s.match(re);
    if (!hit && label === "트렁크") hit = s.match(/(\d+(?:\.\d+)?)/);
    return hit ? { n: parseFloat(hit[1]), unit: unit } : null;
  }
  function fmt(n, unit) {
    var r = Math.round(n * 10) / 10;
    var whole = Math.abs(r % 1) < 1e-9;
    var s = whole ? Math.round(r).toLocaleString("ko-KR") : r.toLocaleString("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return s + unit;
  }

  /* 차 한 대의 비교 조건: 연식, 동력 방식, 구동 방식 */
  var PHEV = /\d{3} e\b|E Performance|^AMG E 53/;
  function ptOf(row, fuel) {
    var n = String(row.name || "");
    if (/electric|^EQ|^Maybach EQS|^G 580/.test(n) || /^전기$/.test(String(fuel || "").trim())) return "ev";
    if (PHEV.test(n)) return "phev";
    if (/\d d\b|\bd 4MATIC/.test(n)) return "diesel";
    return "gas";
  }
  var PT_LABEL = { ev: "전기차", phev: "플러그인 하이브리드", diesel: "디젤", gas: "가솔린" };
  function driveOf(row, drive) {
    var d = String(drive || "").replace(/\s/g, "");
    if (/사륜/.test(d)) return "awd";
    if (/후륜/.test(d)) return "rwd";
    if (/전륜/.test(d)) return "fwd";
    if (/4MATIC/.test(row.name || "")) return "awd";
    return "";
  }
  function ctxOf(row, map) {
    return { my: row.my, pt: ptOf(row, map["연료"] && map["연료"].text), drive: driveOf(row, map["구동"] && map["구동"].text), name: row.name };
  }

  /* 받침이 있으면 "이", 없으면 "가" */
  function subject(word) {
    var last = String(word).charCodeAt(String(word).length - 1);
    var has = last >= 0xac00 && last <= 0xd7a3 ? (last - 0xac00) % 28 !== 0 : false;
    return word + (has ? "이" : "가");
  }
  function sideWord(side) { return side === "left" ? "왼쪽" : "오른쪽"; }
  function otherSide(side) { return side === "left" ? "right" : "left"; }

  /* 우세를 붙이지 않는 이유 */
  function blocker(meta, ca, cb, sa, sb) {
    if (sa && sb && sa.basis && sb.basis && sa.basis !== sb.basis) return { stop: true, why: "측정 기준이 달라(" + sa.basis + " · " + sb.basis + ") 비교하지 않아요." };
    var unclear = [sa, sb].filter(function (s) { return s && /미표기/.test(s.basis || ""); })[0];
    if (meta.basisCheck && unclear) return { stop: true, why: "한쪽 값의 측정 기준(" + unclear.basis + ")이 확인되지 않아 차이를 계산하지 않아요." };
    if (meta.range && (ca.pt !== "ev" || cb.pt !== "ev")) return { stop: true, why: "전기차끼리만 비교하는 항목이에요." };
    if (meta.perf && ca.pt !== cb.pt) return { stop: false, why: "동력 방식이 달라(" + PT_LABEL[ca.pt] + " · " + PT_LABEL[cb.pt] + ") 우열을 가리지 않고 차이만 적었어요." };
    if (ca.my !== cb.my) return { stop: false, why: "연식이 달라(" + ca.my.replace("MY", "") + "년식 · " + cb.my.replace("MY", "") + "년식) 우열을 가리지 않고 차이만 적었어요." };
    if (meta.perf && ca.drive && cb.drive && ca.drive !== cb.drive) return { stop: false, why: "구동 방식이 달라 우열을 가리지 않고 차이만 적었어요." };
    return null;
  }

  /* 제원 한 줄 판정 */
  function judge(label, va, vb, sa, sb, ca, cb) {
    var meta = metaOf(label);
    var out = { label: label, meta: meta, a: va, b: vb, type: "none", side: null, text: "", say: "", tag: "" };
    var missA = isMissing(va) || notPublic(va);
    var missB = isMissing(vb) || notPublic(vb);
    if (missA || missB) {
      out.type = "missing";
      out.text = missA && missB ? "두 차 모두 공식 자료 확인이 필요해요." : "한쪽 자료가 없어 비교하지 않아요.";
      return out;
    }
    if (meta.kind === "text") {
      var same = String(va).replace(/\s/g, "") === String(vb).replace(/\s/g, "");
      out.type = same ? "same" : "differ";
      out.text = same ? "두 차가 같아요." : "두 차가 달라요.";
      out.say = same ? "" : (meta.say || "");
      return out;
    }
    var x = numOf(label, va);
    var y = numOf(label, vb);
    if (!x || !y) {
      out.type = "differ";
      out.text = "숫자로 나란히 비교할 수 없는 값이에요.";
      return out;
    }
    if (x.unit !== y.unit) {
      out.type = "stop";
      out.text = "단위가 달라(" + x.unit + " · " + y.unit + ") 비교하지 않아요.";
      out.say = meta.say || "";
      return out;
    }
    var stop = blocker(meta, ca, cb, sa, sb);
    if (stop && stop.stop) {
      out.type = "stop";
      out.text = stop.why;
      return out;
    }
    if (Math.abs(x.n - y.n) < 1e-9) {
      out.type = "same";
      out.text = "두 차가 같아요.";
      out.say = meta.say || "";
      return out;
    }
    var bigSide = x.n > y.n ? "left" : "right";
    var smallSide = otherSide(bigSide);
    var diff = fmt(Math.abs(x.n - y.n), x.unit);
    out.diff = diff;
    if (meta.kind === "size" || meta.kind === "info" || meta.kind === "ref") {
      out.type = meta.kind === "ref" ? "ref" : "size";
      out.side = bigSide;
      out.text = sideWord(bigSide) + " 차가 " + diff + " " + (meta.big || "더 큽니다");
      if (meta.small) out.say = meta.small(sideWord(smallSide), sideWord(bigSide));
      else if (meta.bigSay) out.say = meta.bigSay(sideWord(bigSide));
      else out.say = meta.say || "";
      if (label === "트렁크") out.text = sideWord(bigSide) + " 차의 기본 트렁크가 " + diff + " " + meta.big;
      return out;
    }
    var winSide = meta.kind === "down" ? smallSide : bigSide;
    out.side = winSide;
    out.text = sideWord(winSide) + " 차가 " + diff + " " + (meta.kind === "down" ? meta.less : meta.more);
    out.say = meta.say || "";
    if (stop) {
      out.type = "plain";
      out.why = stop.why;
    } else {
      out.type = "win";
    }
    return out;
  }

  function sourceLine(s) {
    if (!s) return "출처 기록 없음";
    var text = esc(s.by || "출처");
    var extra = [];
    if (s.my) extra.push(s.my);
    if (s.basis) extra.push(s.basis);
    if (s.note) extra.push(s.note);
    if (s.checked) extra.push("확인 " + s.checked);
    var tail = extra.length ? " · " + esc(extra.join(" · ")) : "";
    return s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + text + " ↗</a>" + tail : text + tail;
  }
  function valueCell(side, v, win) {
    var miss = isMissing(v);
    var shown = miss ? "공식 자료 확인 필요" : v;
    return '<div class="sp-v ' + side + (win ? " is-win" : "") + (miss || notPublic(v) ? " is-miss" : "") + '"><small>' + (side === "left" ? "왼쪽 차" : "오른쪽 차") + "</small><b>" + esc(shown) + "</b>" +
      (win ? '<em class="sp-badge">✔ 우세</em>' : "") + "</div>";
  }
  var TAGS = {
    win: ["is-win", "✔ 이 항목은 강점 비교"],
    plain: ["is-note", "ⓘ 참고 · 우열 판단 안 함"],
    size: ["is-size", "↔ 크기 차이 · 좋고 나쁨 없음"],
    ref: ["is-note", "ⓘ 참고용 차이"],
    same: ["is-same", "＝ 같음"],
    differ: ["is-size", "≠ 다름"],
    stop: ["is-note", "ⓘ 직접 비교 안 함"],
    missing: ["is-miss", "？ 공식 자료 확인 필요"]
  };
  function row(label, va, vb, sa, sb, ca, cb, sameCar) {
    var j = judge(label, va, vb, sa, sb, ca, cb);
    var meta = j.meta;
    var tag = TAGS[j.type] || TAGS.differ;
    var arrow = j.side === "left" ? "◀ " : "";
    var tail = j.side === "right" ? " ▶" : "";
    var html = '<div class="sp-row ' + tag[0] + '" data-spec="' + esc(label) + '">' +
      '<div class="sp-head"><strong>' + esc(meta.name || label) + "</strong>" + (meta.plain ? '<span class="sp-plain">' + esc(meta.plain) + "</span>" : "") + "</div>" +
      '<div class="sp-vals">' + valueCell("left", va, j.type === "win" && j.side === "left") + valueCell("right", vb, j.type === "win" && j.side === "right") + "</div>";
    if (!sameCar) {
      html += '<p class="sp-diff"><span class="sp-tag">' + tag[1] + '</span> <span class="sp-diff-text">' + arrow + esc(j.text) + tail + "</span></p>";
      if (j.type === "win") html += '<p class="sp-say"><b>' + sideWord(j.side) + " 차 우세.</b> " + esc(j.say) + "</p>";
      else if (j.why) html += '<p class="sp-say">' + esc(j.why) + (j.say ? " " + esc(j.say) : "") + "</p>";
      else if (j.say) html += '<p class="sp-say">' + esc(j.say) + "</p>";
    }
    html += '<p class="sp-src">근거 · 왼쪽: ' + sourceLine(sa) + (sameCar ? "" : " / 오른쪽: " + sourceLine(sb)) + "</p></div>";
    return { html: html, judge: j };
  }

  /* 핵심 차이 요약: 실제 제원 판정에서만 문장을 만듭니다. 한 대에 3문장까지. */
  function summary(a, b, judged, price) {
    var lines = { left: [], right: [] };
    function add(side, text) {
      if (side && lines[side].length < 3 && lines[side].indexOf(text) === -1) lines[side].push(text);
    }
    if (price && price.left != null && price.right != null && price.left !== price.right) {
      var cheap = price.left < price.right ? "left" : "right";
      add(cheap, "정상가격이 " + Math.abs(price.left - price.right).toLocaleString("ko-KR") + "만원 낮아요. (" + price.basis + ")");
    }
    judged.forEach(function (j) {
      if (j.type === "win") add(j.side, subject(j.meta.short || j.label) + " " + j.diff + " " + (j.meta.kind === "down" ? "빨라요" : "앞서요") + ".");
    });
    judged.forEach(function (j) {
      if (j.type !== "size" || !j.side) return;
      if (j.label === "길이" || j.label === "높이" || j.label === "너비") {
        var small = otherSide(j.side);
        var word = { "길이": "짧아", "높이": "낮아", "너비": "좁아" }[j.label];
        var use = { "길이": "좁은 길과 주차가 편할 수 있어요.", "높이": "높이 제한 주차장에 여유가 있을 수 있어요.", "너비": "골목과 주차 칸에서 다루기 편할 수 있어요." }[j.label];
        add(small, "차가 " + j.diff + " 더 " + word + " " + use);
      }
      if (j.label === "휠베이스") add(j.side, "휠베이스가 " + j.diff + " 길어 실내 설계에 여유가 있을 수 있어요.");
    });
    function card(side, row) {
      var list = lines[side];
      return '<div class="sp-sum-card ' + side + '"><p class="sp-sum-name"><span>' + (side === "left" ? "왼쪽 차" : "오른쪽 차") + "</span>" + esc(row) + "</p>" +
        (list.length ? "<ul>" + list.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : '<p class="sp-sum-none">제원표에서 뚜렷이 앞서는 숫자를 찾지 못했어요.</p>') + "</div>";
    }
    return '<section class="sp-sum" aria-labelledby="sp-sum-h"><h4 id="sp-sum-h">핵심 차이 요약</h4>' +
      '<p class="sp-sum-lead">아래 제원표의 숫자에서만 골랐어요. 승차감·가속감·실내에서 느끼는 넓이는 숫자로 정할 수 없어 시승으로 확인하세요.</p>' +
      '<div class="sp-sum-grid">' + card("left", a) + card("right", b) + "</div></section>";
  }

  /* 치수 그림: 가상의 SUV 한 대. 숫자 표시(①~④)는 그림 밖 설명과 짝을 이룹니다. */
  function figure(dims) {
    function val(label, side) {
      var v = dims[label] && dims[label][side];
      return v && !isMissing(v) ? v : "공식 자료 확인 필요";
    }
    var side =
      '<svg class="sp-fig-svg" viewBox="0 0 640 330" role="img" aria-labelledby="sp-fig-side-t sp-fig-side-d">' +
      '<title id="sp-fig-side-t">옆에서 본 SUV 그림</title>' +
      '<desc id="sp-fig-side-d">차 앞끝에서 뒤끝까지가 전장, 땅에서 지붕까지가 전고, 앞바퀴 중심에서 뒷바퀴 중심까지가 휠베이스입니다.</desc>' +
      '<line x1="20" y1="236" x2="620" y2="236" class="sp-ground"/>' +
      '<path class="sp-body" d="M70 206 L70 160 Q74 140 100 134 L170 124 L232 76 Q244 68 262 68 L452 68 Q474 68 486 82 L528 128 L560 136 Q582 142 584 166 L584 206 Z"/>' +
      '<path class="sp-glass" d="M188 124 L240 84 Q248 78 260 78 L340 78 L340 124 Z M352 78 L446 78 Q462 78 472 90 L506 124 L352 124 Z"/>' +
      '<circle cx="180" cy="206" r="32" class="sp-wheel"/><circle cx="180" cy="206" r="12" class="sp-hub"/>' +
      '<circle cx="480" cy="206" r="32" class="sp-wheel"/><circle cx="480" cy="206" r="12" class="sp-hub"/>' +
      '<line x1="70" y1="286" x2="584" y2="286" class="sp-dim"/><line x1="70" y1="266" x2="70" y2="300" class="sp-tick"/><line x1="584" y1="266" x2="584" y2="300" class="sp-tick"/>' +
      '<circle cx="530" cy="286" r="17" class="sp-num-bg"/><text x="530" y="293" class="sp-num">1</text>' +
      '<line x1="180" y1="256" x2="480" y2="256" class="sp-dim alt"/><line x1="180" y1="206" x2="180" y2="268" class="sp-tick alt"/><line x1="480" y1="206" x2="480" y2="268" class="sp-tick alt"/>' +
      '<circle cx="330" cy="256" r="17" class="sp-num-bg alt"/><text x="330" y="263" class="sp-num">4</text>' +
      '<text x="505" y="294" class="sp-lbl end">전장</text><text x="356" y="264" class="sp-lbl alt">휠베이스</text><text x="594" y="112" class="sp-lbl end">전고</text>' +
      '<line x1="612" y1="68" x2="612" y2="236" class="sp-dim"/><line x1="596" y1="68" x2="626" y2="68" class="sp-tick"/><line x1="596" y1="236" x2="626" y2="236" class="sp-tick"/>' +
      '<circle cx="612" cy="152" r="17" class="sp-num-bg"/><text x="612" y="159" class="sp-num">3</text>' +
      '<text x="327" y="324" class="sp-cap">옆모습</text></svg>';
    var front =
      '<svg class="sp-fig-svg" viewBox="0 0 400 330" role="img" aria-labelledby="sp-fig-front-t sp-fig-front-d">' +
      '<title id="sp-fig-front-t">앞에서 본 SUV 그림</title>' +
      '<desc id="sp-fig-front-d">차 왼쪽 끝에서 오른쪽 끝까지가 전폭입니다. 점선은 사이드미러이며, 미러를 넣고 재는지는 자료마다 다릅니다.</desc>' +
      '<line x1="20" y1="236" x2="380" y2="236" class="sp-ground"/>' +
      '<path class="sp-body" d="M92 222 L92 150 Q96 128 116 124 L136 80 Q142 68 158 68 L242 68 Q258 68 264 80 L284 124 Q304 128 308 150 L308 222 Z"/>' +
      '<path class="sp-glass" d="M128 124 L146 84 Q150 78 160 78 L240 78 Q250 78 254 84 L272 124 Z"/>' +
      '<rect x="98" y="214" width="44" height="22" rx="6" class="sp-wheel"/><rect x="258" y="214" width="44" height="22" rx="6" class="sp-wheel"/>' +
      '<path class="sp-mirror" d="M92 120 L62 112 L62 132 L92 136 Z M308 120 L338 112 L338 132 L308 136 Z"/>' +
      '<line x1="92" y1="286" x2="308" y2="286" class="sp-dim"/><line x1="92" y1="266" x2="92" y2="300" class="sp-tick"/><line x1="308" y1="266" x2="308" y2="300" class="sp-tick"/>' +
      '<circle cx="200" cy="286" r="17" class="sp-num-bg"/><text x="200" y="293" class="sp-num">2</text>' +
      '<text x="226" y="294" class="sp-lbl">전폭</text>' +
      '<text x="200" y="324" class="sp-cap">앞모습</text></svg>';
    var items = [
      ["1", "길이", "전장 (차 길이)", "차 앞끝에서 뒤끝까지의 길이예요. 길면 실내와 트렁크에 여유가 생길 수 있고, 짧으면 주차와 좁은 길에서 편할 수 있어요."],
      ["2", "너비", "전폭 (차 너비)", "차 왼쪽 끝에서 오른쪽 끝까지예요. 보통 제원표는 사이드미러를 뺀 차체 폭을 적지만, 자료마다 기준이 달라요. 이 화면의 너비는 출처에 미러 포함 여부가 적혀 있지 않으면 '기준 미표기'로 봐 주세요."],
      ["3", "높이", "전고 (차 높이)", "땅에서 지붕까지의 높이예요. 지붕 위 루프랙이나 안테나를 넣고 재는지는 자료마다 다를 수 있어요. 지하주차장 높이 제한을 볼 때 확인하세요."],
      ["4", "휠베이스", "휠베이스 (앞뒤 바퀴 사이)", "앞바퀴 중심에서 뒷바퀴 중심까지의 거리예요. 길면 앞뒤 좌석 배치와 실내 공간 설계에 여유를 줄 수 있어요. 다만 이 수치 하나만으로 실내 공간이 결정되지는 않아요."]
    ];
    var list = items.map(function (it) {
      return '<li><span class="sp-fig-n" aria-hidden="true">' + it[0] + '</span><div><strong>' + esc(it[2]) + "</strong><p>" + esc(it[3]) + '</p><p class="sp-fig-vals">왼쪽 차 <b>' + esc(val(it[1], "left")) + "</b> · 오른쪽 차 <b>" + esc(val(it[1], "right")) + "</b></p></div></li>";
    }).join("");
    return '<section class="sp-fig" aria-labelledby="sp-fig-h"><h4 id="sp-fig-h">길이·너비·높이·휠베이스는 이렇게 잽니다</h4>' +
      '<p class="sp-fig-lead">그림은 이해를 돕는 가상의 SUV예요. 실제 차 모양과 비율은 달라요.</p>' +
      '<div class="sp-fig-pics">' + side + front + "</div><ol class=\"sp-fig-list\">" + list + "</ol></section>";
  }

  /* 배터리 셀 제조사: 공식 현황표에 그 연식·그 모델 이름으로 적힌 것만 씁니다. */
  var CELLS = [
    { my: "MY26", re: /^EQA 250/, maker: "SK on", as: "Mercedes-Benz EQA 250" },
    { my: "MY27", re: /^EQA 250/, maker: "SK on", as: "Mercedes-Benz EQA 250" },
    { my: "MY26", re: /^EQB 300 4MATIC/, maker: "SK on", as: "Mercedes-Benz EQB 300 4MATIC" },
    { my: "MY26", re: /^EQE 350\+$/, maker: "CATL", as: "Mercedes-Benz EQE 350+" },
    { my: "MY26", re: /^EQE 350\+ SUV$/, maker: "CATL", as: "Mercedes-Benz EQE 350+ SUV" },
    { my: "MY26", re: /^EQE 500 4MATIC/, maker: "CATL", as: "Mercedes-Benz EQE 500 4MATIC SUV", note: "가격표 이름도 EQE 500 4MATIC SUV입니다." },
    { my: "MY26", re: /^Maybach EQS 680 SUV$/, maker: "CATL", as: "Mercedes-Maybach EQS 680 SUV" },
    { my: "MY26", re: /^G 580$/, maker: "CATL", as: "The all-new G 580 with EQ Technology" }
  ];
  var CELL_NOTES = [
    { my: "MY26", re: /^EQS (450|580) 4MATIC SUV$/, text: "현황표의 26년식 칸이 비어 있어요(25년식까지는 CATL로 적혀 있음). 다른 연식 값은 쓰지 않았어요." },
    { my: "MY26", re: /^G 580 MANUFAKTUR$/, text: "현황표에 MANUFAKTUR 트림이 따로 적혀 있지 않아요(26년식 G 580은 CATL로 적혀 있음)." },
    { my: "MY27", re: /^G 580/, text: "현황표의 27년식 칸이 비어 있어요." }
  ];
  var MAKERS = {
    "CATL": { name: "CATL (닝더스다이)", about: "중국 푸젠성 닝더에 본사를 둔 회사로, 전기차용 배터리와 에너지 저장 배터리를 연구·생산·판매합니다.", url: "https://www.catl.com/en/about/profile/" },
    "SK on": { name: "SK온", about: "SK이노베이션의 자회사로, 2021년 독립 법인으로 출범한 한국의 전기차 배터리 회사입니다.", url: "https://eng.sk.com/companies/info/sk-on" },
    "Farasis": { name: "Farasis Energy (孚能科技)", about: "중국 장시성 간저우에 본사를 둔 회사로, 리튬이온 동력 배터리와 배터리 시스템을 연구·생산·판매합니다.", url: "https://en.farasis.com/" }
  };
  function cellOf(row) {
    var hit = CELLS.filter(function (c) { return c.my === row.my && c.re.test(row.name); })[0];
    if (hit) return hit;
    var note = CELL_NOTES.filter(function (c) { return c.my === row.my && c.re.test(row.name); })[0];
    return { maker: "", note: note ? note.text : "" };
  }
  function batteryCard(side, row, map, ctx) {
    var pt = ctx.pt;
    var cell = cellOf(row);
    function get(label) {
      var hit = map[label];
      return hit && !isMissing(hit.text) ? hit : null;
    }
    var lines = [];
    var makerHtml;
    if (cell.maker) {
      var mk = MAKERS[cell.maker] || { name: cell.maker, about: "" };
      makerHtml = "<b>" + esc(mk.name) + "</b>" +
        '<span class="sp-bat-src">' + sourceLine({ by: SOURCES.battery.by, url: SOURCES.battery.url, my: row.my + " · 표 이름 " + cell.as, checked: CHECKED }) + (cell.note ? " · " + esc(cell.note) : "") + "</span>" +
        (mk.about ? '<span class="sp-bat-about">' + esc(mk.about) + (mk.url ? ' <a href="' + esc(mk.url) + '" target="_blank" rel="noopener noreferrer">회사 공식 소개 ↗</a>' : "") + "</span>" : "");
    } else {
      makerHtml = "<b>국내 판매 사양의 제조사 정보는 공식 공개 자료에서 확인되지 않음</b>" +
        '<span class="sp-bat-src">' + sourceLine({ by: SOURCES.battery.by, url: SOURCES.battery.url, checked: CHECKED }) + (cell.note ? " · " + esc(cell.note) : (pt === "phev" ? " · 현황표는 전기차(BEV)만 다뤄요." : " · 이 모델·연식이 표에 없어요.")) + "</span>";
    }
    lines.push(["배터리 셀 제조사", makerHtml]);
    var bat = get("배터리");
    var batText = bat ? bat.text : "";
    if (pt === "phev" && !batText) {
      var fuel = get("연료");
      var m = fuel && String(fuel.text).match(/(\d+(?:\.\d+)?)\s*kWh/);
      if (m) batText = m[1] + "kWh";
    }
    var chem = batText.match(/\b(NCM|NMC|LFP|NCA)\b/);
    lines.push(["배터리 종류(화학 계열)", chem && bat && bat.src ? "<b>" + esc(chem[1]) + "</b>" : "<b>공식 공개 자료 확인 필요</b>" + (chem ? '<span class="sp-bat-src">사이트 기존 값 ' + esc(chem[1]) + "은(는) 출처가 기록되어 있지 않아 쓰지 않았어요.</span>" : "")]);
    var cap = batText.match(/(\d+(?:\.\d+)?)\s*kWh/);
    lines.push([pt === "phev" ? "고전압 구동 배터리 용량" : "배터리 용량", cap ? "<b>" + esc(cap[1]) + "kWh</b>" + '<span class="sp-bat-src">' + sourceLine(bat && bat.src) + " · 사용 가능 용량인지 전체 용량인지 표기 없음</span>" : "<b>공식 자료 확인 필요</b>"]);
    if (pt === "ev") {
      var dom = map["1회 충전 주행거리"];
      var wltp = map["WLTP 주행거리"];
      lines.push(["국내 인증 주행거리", dom && !isMissing(dom.text) && !notPublic(dom.text) ? "<b>" + esc(dom.text) + "</b>" + '<span class="sp-bat-src">' + sourceLine(dom.src) + "</span>" : "<b>국내 인증 수치 미공개</b>"]);
      lines.push(["WLTP 기준 주행거리", wltp && !isMissing(wltp.text) ? "<b>" + esc(wltp.text) + "</b>" + '<span class="sp-bat-src">' + sourceLine(wltp.src) + " · 유럽 시험 기준이라 국내 실주행거리와 달라요.</span>" : "<b>자료 없음</b>"]);
    } else {
      lines.push(["순수 전기 주행거리", "<b>공식 자료 확인 필요</b><span class=\"sp-bat-src\">엔진을 쓰지 않고 전기로만 가는 거리예요. 연료를 함께 쓰는 복합 연비·총 주행거리와는 다른 숫자예요.</span>"]);
      lines.push(["12V 보조배터리와의 차이", "<b>다른 배터리예요</b><span class=\"sp-bat-src\">위 내용은 주행용 고전압 배터리예요. 전조등·문 잠금 같은 전장품에 쓰는 12V 보조배터리와 혼동하지 마세요.</span>"]);
    }
    return '<div class="sp-bat-card ' + side + '"><p class="sp-sum-name"><span>' + (side === "left" ? "왼쪽 차" : "오른쪽 차") + "</span>" + esc(row.name) + " · " + esc(row.my) + " · " + PT_LABEL[pt] + "</p><dl>" +
      lines.map(function (l) { return "<dt>" + esc(l[0]) + "</dt><dd>" + l[1] + "</dd>"; }).join("") + "</dl></div>";
  }
  function battery(a, b, mapA, mapB, ca, cb) {
    var show = [];
    if (ca.pt === "ev" || ca.pt === "phev") show.push(batteryCard("left", a, mapA, ca));
    if (a.i !== b.i && (cb.pt === "ev" || cb.pt === "phev")) show.push(batteryCard("right", b, mapB, cb));
    if (!show.length) return "";
    return '<section class="sp-bat" aria-labelledby="sp-bat-h"><h4 id="sp-bat-h">배터리 정보 (전기차·플러그인 하이브리드)</h4>' +
      '<p class="sp-fig-lead">배터리 셀 제조사는 메르세데스-벤츠 코리아가 공개한 현황표에 그 연식·그 모델로 적힌 경우에만 적어요. 다른 연식이나 비슷한 모델 값으로 추정하지 않아요. 제조사 이름만으로 안전성이나 품질의 좋고 나쁨을 말할 수 없어요.</p>' +
      '<div class="sp-sum-grid">' + show.join("") + "</div></section>";
  }

  /* 세대 비교 카드: 신형 일렉트릭 GLB ↔ EQB. 공식 발표(기사 인용)에 적힌 차이만 씁니다. */
  function generation(a, b, mapA, mapB) {
    var glb = /^GLB 250\+ electric$/;
    var eqb = /^EQB /;
    var g = glb.test(a.name) && eqb.test(b.name) ? { n: a, o: b, nm: mapA, om: mapB } : (glb.test(b.name) && eqb.test(a.name) ? { n: b, o: a, nm: mapB, om: mapA } : null);
    if (!g) return "";
    function v(map, label) { var h = map[label]; return h && !isMissing(h.text) ? h.text : ""; }
    var wbN = numOf("휠베이스", v(g.nm, "휠베이스"));
    var wbO = numOf("휠베이스", v(g.om, "휠베이스"));
    var wb = wbN && wbO ? fmt(wbN.n - wbO.n, "mm") : "";
    var src = sourceLine(SOURCES.newsis);
    var rows = [
      ["휠베이스", "신형 GLB " + (v(g.nm, "휠베이스") || "자료 확인 필요") + " · EQB " + (v(g.om, "휠베이스") || "자료 확인 필요") +
        (wb ? " → 신형이 " + wb + " 더 깁니다. 발표 자료의 '전작 대비 60mm 증가'와 같아요." : ""), "계산"],
      ["뒷좌석 다리 공간", "전작 대비 최대 68mm 늘었다고 발표했어요. 엉덩이 관절 각도를 9도 조정하고 허벅지 받침 면적을 넓혔다고 해요.", "발표 수치"],
      ["머리 위 공간", "EQB 대비 앞좌석 최대 35mm, 뒷좌석 최대 64mm 늘었다고 발표했어요.", "발표 수치"],
      ["짐 공간", "신형 GLB는 앞 127L, 뒤 기본 540L(뒷좌석 접으면 최대 1,715L)로 발표했어요. EQB는 사이트 자료에 " + (v(g.om, "트렁크") || "값 없음") + "로 적혀 있지만, 두 자료의 측정 방법 표기가 없어 차이를 계산하지 않았어요.", "기준 차이"],
      ["플랫폼·전기 시스템", "신형 GLB는 벤츠의 차세대 모듈형 아키텍처(MMA)와 800V 전기 시스템을 쓴다고 발표했어요. EQB의 플랫폼·전압은 이 사이트 자료에 없어 비교하지 않았어요.", "참고"],
      ["배터리·충전", "신형 GLB는 85kWh 리튬이온 배터리, 최대 320kW 직류 급속 충전, 10분 충전으로 최대 260km를 갈 수 있다고 발표했어요(260km의 측정 기준은 기사에 없음). EQB의 급속 충전 수치는 사이트 자료에 없어요.", "참고"],
      ["주행거리", "신형 GLB는 WLTP 기준 최대 631km(국내 인증 수치 미공개), EQB는 국내 인증 " + (v(g.om, "1회 충전 주행거리") || "값 없음") + "이에요. 시험 기준이 달라 어느 쪽이 더 멀리 가는지 비교하지 않아요.", "기준 차이"],
      ["화면·소프트웨어", "신형 GLB는 운전석 10.25인치, 가운데·조수석 각 14인치 화면과 벤츠 자체 운영체제(MB.OS)를 쓴다고 발표했어요.", "발표 내용"]
    ];
    return '<section class="sp-gen" aria-labelledby="sp-gen-h"><h4 id="sp-gen-h">세대가 바뀌며 달라진 점 · 신형 일렉트릭 GLB와 EQB</h4>' +
      '<p class="sp-fig-lead">EQB는 지난 세대의 소형 전기 SUV이고, 신형 일렉트릭 GLB는 벤츠코리아가 EQB와 견주어 설명한 새 세대 전기 SUV예요. 어느 차가 이긴다기보다, 무엇이 바뀌었는지 보는 카드예요.</p>' +
      "<dl>" + rows.map(function (r) { return "<dt>" + esc(r[0]) + ' <em class="sp-gen-k">' + esc(r[2]) + "</em></dt><dd>" + esc(r[1]) + "</dd>"; }).join("") +
      "</dl>" + '<p class="sp-src">근거 · ' + src + " · EQB 값은 사이트 기존 자료(출처 기록 없음)</p></section>";
  }

  window.BenzSpecs = {
    META: META,
    SOURCES: SOURCES,
    ctx: ctxOf,
    row: row,
    summary: summary,
    figure: figure,
    battery: battery,
    generation: generation
  };
})();
