/* 재고·연식 규칙. 판매 소진은 비교 첫 목록과 프로모션 문의에서 빼 둡니다.
 * 지난 프로모션은 비교의 '지난 재고'와 가격표에서만 다시 봅니다.
 * 연식 배너는 확인된 옵션 차이만 적습니다. 모르면 문장을 만들지 않습니다. */
(function () {
  function nameOf(row) {
    return row && (row.name || row[2] || "");
  }
  function yearOf(row) {
    return row && (row.my || row[1] || "");
  }
  function isAmg(name) {
    return String(name).indexOf("AMG ") === 0;
  }
  function isSRegular(name) {
    return /^(S |AMG S )/.test(name);
  }
  function seriesOf(name) {
    name = String(name || "");
    if (name.indexOf("Maybach EQS") !== -1) return "Maybach EQS";
    if (name.indexOf("Maybach GLS") !== -1) return "Maybach GLS";
    if (name.indexOf("Maybach S") !== -1) return "Maybach S";
    if (name.indexOf("Maybach SL") !== -1) return "Maybach SL";
    if (name.indexOf("EQA") !== -1) return "EQA";
    if (name.indexOf("EQB") !== -1) return "EQB";
    if (name.indexOf("EQE") !== -1) return "EQE";
    if (name.indexOf("EQS") !== -1) return "EQS";
    if (name.indexOf("GLA") !== -1) return "GLA";
    if (name.indexOf("GLB") !== -1) return "GLB";
    if (name.indexOf("GLC") !== -1 && name.indexOf("electric") !== -1) return "GLC electric";
    if (name.indexOf("GLC") !== -1) return "GLC";
    if (name.indexOf("GLE") !== -1) return "GLE";
    if (name.indexOf("GLS") !== -1) return "GLS";
    if (name.indexOf("CLA") !== -1 && name.indexOf("electric") !== -1) return "CLA electric";
    if (name.indexOf("CLA") !== -1) return "CLA";
    if (name.indexOf("CLE") !== -1) return "CLE";
    if (name.indexOf("GT") !== -1) return "GT";
    if (name.indexOf("SL") !== -1) return "SL";
    if (/^G 450|^AMG G |^G 580/.test(name)) return "G";
    if (/^AMG S |^S \d/.test(name)) return "S";
    if (/^AMG E |^E \d/.test(name)) return "E";
    if (/^AMG C |^C \d/.test(name)) return "C";
    if (/^AMG A |^A \d/.test(name)) return "A";
    return name.split(" ")[0] || "";
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function yearNum(my) {
    var match = String(my || "").match(/MY(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
  /* 재고가 확인된 연식만 종료로 둡니다. 재고를 모르는 항목은 live로 남깁니다. */
  function ended(extra) {
    extra = extra || {};
    return {
      code: "soldout",
      label: "재고 소진",
      past: true,
      offer: "ended",
      promo: "ended",
      next: extra.next || "",
      reason: extra.reason || "",
      blockAsk: true
    };
  }
  function liveStatus() {
    return { code: "live", label: "", past: false, offer: "live", promo: "", next: "", reason: "", blockAsk: false };
  }
  /* 26년식 재고 소진: 일반 S, 일반 GLC, 일반 GLA·CLA, GLB, EQB 2026년식 이하.
   * S·GLC·GLA·CLA는 기존처럼 AMG를 빼 둡니다. GLB 2026년식은 AMG 포함입니다.
   * 마이바흐 S 580·680만 26년식 S 재고입니다. */
  function of(row) {
    var my = yearOf(row);
    var name = nameOf(row);
    var year = yearNum(my);

    if ((/^EQB /.test(name) || /^AMG EQB /.test(name)) && year && year < 27) {
      return ended({
        next: "MY27",
        reason: "2026년식과 그 이전 EQB는 현재 판매 항목이 아닙니다. 2027년식부터 판매 가능합니다. 등록된 2027년식 가격, 할인, 재고, 출고 일정은 없습니다. 즉시 출고가 아닙니다. 보이는 숫자는 종료된 프로모션입니다."
      });
    }
    if (my === "MY26" && (/^GLB /.test(name) || /^AMG GLB /.test(name))) {
      return ended({
        reason: "26년식 GLB는 재고가 소진되었습니다. 다른 연식의 GLB는 이 상태와 같이 숨기지 않습니다."
      });
    }
    if (my === "MY26") {
      if (isSRegular(name)) {
        return ended({
          next: "MY27",
          reason: "26년식 일반 S클래스는 재고가 없습니다. 지금 고르는 차는 27년식입니다."
        });
      }
      if (/^GLC /.test(name) && !isAmg(name)) {
        return ended({
          next: "MY27",
          reason: "26년식 일반 GLC는 재고가 없습니다. 27년식만 선택할 수 있습니다."
        });
      }
      if (/^GLA /.test(name) && !isAmg(name)) {
        return ended({
          next: "MY27",
          reason: "26년식 GLA는 재고가 없습니다. 27년식만 선택할 수 있습니다."
        });
      }
      if (/^CLA /.test(name) && !isAmg(name)) {
        return ended({
          next: "MY27",
          reason: "26년식 CLA는 재고가 없습니다. 27년식 신형 CLA만 선택할 수 있습니다."
        });
      }
    }

    return liveStatus();
  }
  function statusLabel(st) {
    if (!st || st.code !== "soldout") return "";
    return "재고 소진 · 종료된 프로모션";
  }

  function live(row) {
    return of(row).code !== "soldout";
  }

  function itemFits(item, a, b) {
    if (typeof item === "string") return true;
    var names = nameOf(a) + " " + nameOf(b);
    if (item.need && item.need.length && !item.need.some(function (key) {
      return names.indexOf(key) !== -1;
    })) return false;
    if (item.require && item.require.length && !item.require.every(function (key) {
      return names.indexOf(key) !== -1;
    })) return false;
    if (item.not && item.not.some(function (key) {
      return names.indexOf(key) !== -1;
    })) return false;
    return true;
  }

  function itemText(item) {
    return typeof item === "string" ? item : item.text;
  }

  function noteItems(pack, a, b) {
    return ((pack && pack.note && pack.note.items) || []).filter(function (item) {
      return itemFits(item, a, b);
    }).map(itemText);
  }

  /* 연식 배너. 확인된 옵션 차이만.
     27년식 E클래스 공통 사양의 출처는 26년식 같은 트림입니다.
     review: recorded = 연식 비교에 이미 있던 변경. pending = 26년식 기준을 채운 뒤 운영자 최종 확인 전. */
  var E_EQUIP = [
    {
      label: "사이드 볼스터",
      my26: "가죽",
      my27: "아티코 가죽",
      text: "사이드 볼스터가 가죽에서 아티코 가죽으로 바뀝니다.",
      source: "벤츠비교 연식 비교",
      review: "recorded"
    },
    {
      label: "시트백 맵포켓",
      my26: "기본 적용",
      my27: "미적용",
      text: "시트백 맵포켓이 빠집니다.",
      source: "벤츠비교 연식 비교",
      review: "recorded"
    },
    {
      label: "컵홀더",
      my26: "26년식 모양",
      my27: "모양이 바뀜",
      text: "컵홀더 모양이 바뀝니다.",
      source: "벤츠비교 연식 비교",
      review: "recorded"
    },
    {
      label: "어린이 시트 고정",
      my26: "ISOFIX",
      my27: "I-Size",
      text: "어린이 시트 고정 이름이 ISOFIX에서 I-Size로 바뀝니다.",
      source: "벤츠비교 연식 비교",
      review: "recorded"
    }
  ];

  function eClassRow(row) {
    if (!row || row.seg !== "E") return false;
    return String(row.name || "").indexOf("AMG ") !== 0;
  }

  function eDeltaRows(a, b) {
    if (!eClassRow(a) || !eClassRow(b)) return [];
    if (yearOf(a) === yearOf(b)) return [];
    var left27 = yearOf(a) === "MY27";
    return E_EQUIP.map(function (item) {
      return {
        cat: "달라진 점",
        label: item.label,
        left: left27 ? item.my27 : item.my26,
        right: left27 ? item.my26 : item.my27,
        differ: true,
        source: item.source,
        review: item.review
      };
    });
  }

  /* 연식 배너. 확인된 옵션 차이만. */
  var SERIES = {
    E: {
      title: "E클래스 26년식과 27년식",
      items: [
        {
          need: ["E 200 Exclusive", "E 200 AMG Line"],
          text: "27년식 E 200은 차량가가 26년식과 같습니다. 할인은 익스클루시브 18%, AMG Line 17%입니다."
        },
        {
          need: ["E 220 d"],
          text: "27년식 E 220 d는 아방가르드 구성입니다. 엔진과 사륜 구동은 26년식과 같고, 익스클루시브 사양으로 바꾸지 않습니다."
        }
      ].concat(E_EQUIP.map(function (item) { return item.text; }))
    },
    GLC: {
      title: "GLC 26년식과 27년식",
      items: [
        {
          require: ["GLC 300", "AMG Line"],
          not: ["electric"],
          text: "27년식 GLC 300 AMG Line에는 엔지니어링 패키지가 들어갑니다. 에어 서스펜션과 리어 액슬 스티어링입니다."
        }
      ]
    }
  };

  function seriesNote(a, b) {
    var sa = seriesOf(nameOf(a));
    var sb = seriesOf(nameOf(b));
    if (sa !== sb) return null;
    if (SERIES[sa]) return { id: sa, note: SERIES[sa] };
    return null;
  }

  function shouldBanner(a, b) {
    if (!a || !b) return false;
    if (yearOf(a) === yearOf(b)) return false;
    return noteItems(seriesNote(a, b), a, b).length > 0;
  }

  function yearSection(a, b, helpers) {
    helpers = helpers || {};
    var show = helpers.showName || function (n) { return n; };
    if (!shouldBanner(a, b)) return "";
    var pack = seriesNote(a, b);
    var items = noteItems(pack, a, b);
    var leftY = yearOf(a) === "MY27" ? "27년식" : "26년식";
    var rightY = yearOf(b) === "MY27" ? "27년식" : "26년식";

    var html = '<section id="year-change" class="year-change">';
    html += '<p class="year-kicker">달라진 점</p>';
    html += "<h3>" + esc(pack && pack.note ? pack.note.title : "26년식과 27년식") + "</h3>";
    html += '<p class="year-pair">' + esc(show(nameOf(a))) + " · " + leftY + "  ↔  " + esc(show(nameOf(b))) + " · " + rightY + "</p>";
    html += '<ul class="year-list">' + items.map(function (line) { return "<li>" + esc(line) + "</li>"; }).join("") + "</ul>";
    if (pack && pack.id === "E") {
      html += '<p class="year-note">공통 사양은 2026년식 기준으로 정리했으며, 확인된 2027년식 변경 사항을 반영했습니다. 실제 적용 사양은 출고 차량 기준으로 확인해 주세요.</p>';
    }
    html += "</section>";
    return html;
  }

  window.BenzStock = {
    of: of,
    live: live,
    seriesOf: seriesOf,
    shouldBanner: shouldBanner,
    yearSection: yearSection,
    eEquip: function () { return E_EQUIP.slice(); },
    eDeltaRows: eDeltaRows,
    soldOut: function (row) { return of(row).code === "soldout"; },
    statusLabel: statusLabel,
    showPast: false
  };
})();
