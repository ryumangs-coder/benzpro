(function () {
  var icons = {
    car: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 16l1.5-4.5A2 2 0 0 1 8.4 10h7.2a2 2 0 0 1 1.9 1.5L19 16v4h-2v-2H7v2H5v-4zm2.2-1h9.6l-1-3H8.2l-1 3zM7.5 16.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm9 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5z"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm11 8H6v10h12V10z"/></svg>',
    swap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 7h11l-2.2-2.2 1.4-1.4L22 8l-4.8 4.6-1.4-1.4L18 9H7V7zm10 10H6l2.2 2.2-1.4 1.4L2 16l4.8-4.6 1.4 1.4L6 15h11v2z"/></svg>',
    tire: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>',
    gift: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 10h16v10H4V10zm8-6l2.2 3H20v3H4V7h5.8L12 4zM11 12v6h2v-6h-2z"/></svg>',
    fleet: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 20V8l6-4h6l6 4v12h-6v-5H9v5H3zm2-2h2v-3h4v3h6V9.2L15 6H9L5 9.2V18z"/></svg>',
    key: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 4a6 6 0 0 1 1.2 11.9L14 17v3h-3v2H8v-2H6v-3l1.8-1.1A6 6 0 0 1 14 4zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>',
    mou: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 20V9l8-5 8 5v11h-6v-6H10v6H4z"/></svg>',
    card: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 6h18v12H3V6zm2 4h14V8H5v2z"/></svg>'
  };
  var tabs = [
    { id: "cars", label: "차종별 할인", icon: icons.car, ids: ["promo-board", "highlights", "raised", "finder", "how", "examples"] },
    { id: "extra", label: "추가 혜택", icon: icons.plus, ids: ["owned", "benefit-slot"] },
    { id: "golden", label: "골든타임", icon: icons.gift, ids: ["golden-slot"] },
    { id: "fleet", label: "법인 할인", icon: icons.fleet, ids: ["fleet-slot"] },
    { id: "rental", label: "렌터카", icon: icons.key, ids: ["rental-slot"] },
    { id: "support", label: "6개월 지원", icon: icons.cal, ids: ["support"] },
    { id: "care", label: "신차교환", icon: icons.swap, ids: ["programs", "care-card"] },
    { id: "tire", label: "타이어", icon: icons.tire, ids: ["tire-card"] },
    { id: "mou", label: "MOU 할인", icon: icons.mou, ids: ["company"] },
    { id: "card", label: "카드", icon: icons.card, ids: ["paycard"] }
  ];
  var hashTab = {
    finder: "cars",
    highlights: "cars",
    raised: "cars",
    how: "cars",
    examples: "cars",
    owned: "extra",
    extra: "extra",
    fleet: "fleet",
    golden: "golden",
    rental: "rental",
    support: "support",
    programs: "care",
    "care-card": "care",
    "tire-card": "tire",
    company: "mou",
    paycard: "card"
  };

  var highlights = document.getElementById("highlights");
  if (!highlights || !window.OCTOBER_2026) return;

  var board = document.createElement("section");
  board.id = "promo-board";
  board.className = "jump mt-6";
  highlights.parentNode.insertBefore(board, highlights);

  var tire = document.getElementById("tire-card");
  var programs = document.getElementById("programs");
  if (tire && programs && programs.contains(tire)) {
    tire.classList.add("mt-6");
    programs.parentNode.insertBefore(tire, programs.nextSibling);
  }

  var slot = document.createElement("section");
  slot.id = "benefit-slot";
  slot.className = "jump mt-6";
  highlights.parentNode.insertBefore(slot, highlights);

  var fleetSlot = document.createElement("section");
  fleetSlot.id = "fleet-slot";
  fleetSlot.className = "jump mt-6";
  highlights.parentNode.insertBefore(fleetSlot, highlights);

  var goldenSlot = document.createElement("section");
  goldenSlot.id = "golden-slot";
  goldenSlot.className = "jump mt-6";
  highlights.parentNode.insertBefore(goldenSlot, highlights);

  var rentalSlot = document.createElement("section");
  rentalSlot.id = "rental-slot";
  rentalSlot.className = "jump mt-6";
  highlights.parentNode.insertBefore(rentalSlot, highlights);

  var bar = document.createElement("div");
  bar.className = "promo-tabs mt-6";
  bar.setAttribute("role", "tablist");
  bar.setAttribute("aria-label", "프로모션 분류");
  bar.innerHTML = tabs
    .map(function (tab) {
      return '<button type="button" role="tab" data-tab="' + tab.id + '" aria-selected="false">' + tab.icon + tab.label + "</button>";
    })
    .join("");
  highlights.parentNode.insertBefore(bar, board);

  var jump = document.querySelector('nav[aria-label="이 페이지 바로가기"]');
  if (jump) jump.classList.add("promo-off");

  function simplePct(s) {
    if (!s) return 0;
    var m = String(s).match(/^\+(\d+(?:\.\d+)?)%/);
    return m ? parseFloat(m[1]) : 0;
  }
  function anyPct(s) {
    if (!s || s === "—") return 0;
    var m = String(s).match(/(\d+(?:\.\d+)?)%/);
    return m ? parseFloat(m[1]) : 0;
  }
  function deal(row) {
    if (!window.BenzQuote || row[3] == null) return null;
    var q = window.BenzQuote.of({ seg: row[0], my: row[1], name: row[2], price: row[3], cash: row[4], mbm: row[5] });
    var man = window.BenzQuote.man;
    return { priceMan: man(q.basis), basicMan: man(q.normal), maxMan: man(q.normal), earlyMan: q.early == null ? null : man(q.early), rate: q.rate, name: row[2] };
  }

  var families = [
    { group: "sedan", name: "A클래스", line: "도심에서 쓰기 좋은 작은 세단과 해치백입니다.", prefix: "A ", car: "A, CLA, GLA, GLB" },
    { group: "sedan", name: "CLA", line: "지붕이 낮은 쿠페형 세단입니다.", prefix: "CLA ", car: "A, CLA, GLA, GLB" },
    { group: "sedan", name: "C클래스", line: "가장 많이 비교하는 중형 세단입니다.", prefix: "C ", car: "C-Class" },
    { group: "sedan", name: "E클래스", line: "가족 세단의 기준입니다. 이번 달 현금 할인이 크게 보입니다.", prefix: "E ", car: "E-Class" },
    { group: "sedan", name: "S클래스", line: "플래그십 세단입니다. 2027년형은 사전예약으로 이어집니다.", prefix: "S ", car: "S-Class" },
    { group: "suv", name: "GLA", line: "가장 작은 SUV입니다.", prefix: "GLA ", car: "A, CLA, GLA, GLB" },
    { group: "suv", name: "GLB", line: "2열과 3열을 고를 수 있는 컴팩트 SUV입니다.", prefix: "GLB ", car: "A, CLA, GLA, GLB" },
    { group: "suv", name: "GLC", line: "가장 많이 찾는 중형 SUV입니다.", prefix: "GLC ", not: "Coup", car: "GLC" },
    { group: "suv", name: "GLC 쿠페", line: "지붕선이 내려가는 GLC입니다.", prefix: "GLC ", has: "Coup", car: "GLC" },
    { group: "suv", name: "GLE", line: "공간이 더 필요한 중대형 SUV입니다.", prefix: "GLE ", not: "Coup", car: "GLE" },
    { group: "suv", name: "GLE 쿠페", line: "GLE의 쿠페형입니다.", prefix: "GLE ", has: "Coup", car: "GLE" },
    { group: "suv", name: "GLS", line: "큰 3열 SUV입니다.", prefix: "GLS ", car: "GLS" },
    { group: "suv", name: "G클래스", line: "각진 오프로더입니다. 이번 달 현금 할인은 없습니다.", prefix: "G 450", car: "상담 후 결정" },
    { group: "ev", name: "일렉트릭 GLC", line: "지금 사전예약 중인 전기 SUV입니다.", staticPrice: "9,000만원부터", car: "GLC", href: "preorder.html#glc" },
    { group: "ev", name: "EQA", line: "작은 전기 SUV입니다.", prefix: "EQA", car: "상담 후 결정" },
    { group: "ev", name: "EQB", line: "3열을 볼 수 있는 전기 컴팩트입니다.", prefix: "EQB", car: "상담 후 결정" },
    { group: "ev", name: "EQE", line: "전기 세단과 SUV가 있습니다.", prefix: "EQE", car: "상담 후 결정" },
    { group: "ev", name: "EQS", line: "큰 전기 SUV입니다.", prefix: "EQS", car: "상담 후 결정" },
    { group: "ev", name: "G 580", line: "전기 G클래스입니다.", prefix: "G 580", car: "상담 후 결정" },
    { group: "coupe", name: "CLE 쿠페", line: "2도어 쿠페입니다.", prefix: "CLE ", has: "Coup", not: "Cabriolet", car: "상담 후 결정" },
    { group: "coupe", name: "CLE 카브리올레", line: "지붕이 열리는 CLE입니다.", prefix: "CLE ", has: "Cabriolet", car: "상담 후 결정" },
    { group: "amg", name: "AMG A클래스", line: "A클래스의 고성능입니다.", prefix: "AMG A", kind: "amg", car: "AMG" },
    { group: "amg", name: "AMG CLA", line: "CLA의 고성능입니다.", prefix: "AMG CLA", kind: "amg", car: "AMG" },
    { group: "amg", name: "AMG GLB", line: "GLB의 고성능입니다.", prefix: "AMG GLB", kind: "amg", car: "AMG" },
    { group: "amg", name: "AMG E클래스", line: "E클래스의 고성능입니다.", prefix: "AMG E", kind: "amg", car: "AMG" },
    { group: "amg", name: "AMG S클래스", line: "S클래스의 고성능입니다.", prefix: "AMG S ", kind: "amg", car: "AMG" },
    { group: "amg", name: "AMG GLC", line: "GLC의 고성능입니다.", prefix: "AMG GLC", kind: "amg", car: "AMG" },
    { group: "amg", name: "AMG GLE", line: "GLE의 고성능입니다.", prefix: "AMG GLE", kind: "amg", car: "AMG" },
    { group: "amg", name: "AMG GLS", line: "GLS의 고성능입니다.", prefix: "AMG GLS", kind: "amg", car: "AMG" },
    { group: "amg", name: "AMG CLE", line: "CLE의 고성능입니다.", prefix: "AMG CLE", kind: "amg", car: "AMG" },
    { group: "amg", name: "AMG GT", line: "2도어 스포츠카입니다.", prefix: "AMG GT", kind: "amg", car: "AMG" },
    { group: "amg", name: "AMG SL", line: "지붕이 열리는 스포츠카입니다.", prefix: "AMG SL", kind: "amg", car: "AMG" },
    { group: "amg", name: "AMG G클래스", line: "G클래스의 고성능입니다.", prefix: "AMG G ", kind: "amg", car: "AMG" },
    { group: "maybach", name: "마이바흐 S클래스", line: "뒷좌석이 중심인 플래그십입니다.", prefix: "Maybach S ", kind: "maybach", car: "MAYBACH" },
    { group: "maybach", name: "마이바흐 GLS", line: "3열 마이바흐입니다.", prefix: "Maybach GLS", kind: "maybach", car: "MAYBACH" },
    { group: "maybach", name: "마이바흐 EQS", line: "전기 마이바흐 SUV입니다.", prefix: "Maybach EQS", kind: "maybach", car: "MAYBACH" },
    { group: "maybach", name: "마이바흐 SL", line: "오픈 마이바흐입니다.", prefix: "Maybach SL", kind: "maybach", car: "MAYBACH" }
  ];
  var groupMeta = [
    { id: "sedan", label: "세단" },
    { id: "suv", label: "SUV" },
    { id: "ev", label: "전기차" },
    { id: "coupe", label: "쿠페" },
    { id: "amg", label: "AMG" },
    { id: "maybach", label: "마이바흐" }
  ];

  function rowsOf(f) {
    if (!f.prefix) return [];
    var kind = f.kind || "base";
    return window.OCTOBER_2026.models.filter(function (r) {
      var n = r[2];
      if (n.toLowerCase().indexOf(f.prefix.toLowerCase()) !== 0) return false;
      if (f.has && n.toLowerCase().indexOf(f.has.toLowerCase()) === -1) return false;
      if (f.not && n.toLowerCase().indexOf(f.not.toLowerCase()) !== -1) return false;
      var amg = n.indexOf("AMG ") === 0;
      var may = n.indexOf("Maybach") !== -1;
      if (kind === "base" && (amg || may)) return false;
      if (kind === "amg" && !amg) return false;
      if (kind === "maybach" && !may) return false;
      return true;
    });
  }
  function won(n) {
    return n.toLocaleString("ko-KR") + "만원";
  }
  function showName(name) {
    var s = String(name).replace("(SWB)", "숏바디").replace(/ Long/g, " 롱바디");
    if (s === "S 450 4MATIC") return "S 450 4MATIC 숏바디";
    return s;
  }
  function consultHref(f) {
    var params = new URLSearchParams();
    params.set("car", f.car);
    params.set("note", f.name);
    return "index.html?" + params.toString() + "#consulting";
  }
  function card(f) {
    var rows = rowsOf(f);
    if (!f.staticPrice && !rows.length) return "";
    var best = null;
    rows.forEach(function (r) {
      var d = deal(r);
      if (!d) return;
      if (!best || d.maxMan < best.maxMan) best = d;
    });
    if (!f.staticPrice && !best) return "";
    var priceHtml = f.staticPrice
      ? '<p class="mt-3 text-[20px] font-bold">정상가격 ' + f.staticPrice + "</p>"
      : '<p class="mt-3 text-[18px] leading-snug">정상가격은 <b>' +
        won(best.priceMan) +
        "</b>인데, 기본 할인과 금융 할인을 더한 실구매가격은 <b class=\"text-[#E4CB86]\">" +
        won(best.maxMan) +
        "</b>입니다.</p>" +
        '<p class="mt-1 text-[15px] text-[#A4AAAE]">' +
        showName(best.name) +
        " 기준" +
        (best.rate ? " · " + best.rate + "%" : "") +
        (best.earlyMan != null ? " · 7월 1일 이전 통관 " + won(best.earlyMan) : "") +
        "</p>";
    var voucher = (f.group === "ev" && !f.staticPrice) || f.name === "마이바흐 EQS"
      ? '<p class="mt-2 text-[16px] font-semibold text-[#E4CB86]">벤츠 금융으로 사면 충전 바우처 100만원</p>'
      : "";
    var seeHref = f.href || (function () {
      var params = new URLSearchParams();
      params.set("prefix", f.prefix);
      params.set("kind", f.kind || "base");
      if (f.has) params.set("has", f.has);
      if (f.not) params.set("not", f.not);
      return "prices.html?" + params.toString() + "#finder";
    })();
    var see = '<a class="inline-flex rounded-full bg-[#E4CB86] px-4 py-2.5 text-[15px] font-bold text-[#0B1F2A]" href="' + seeHref + '">' + (f.href ? "차 설명 보기" : "이 차종 할인 보기") + "</a>";
    return (
      '<article class="rounded-3xl bg-white p-5">' +
      '<p class="text-[14px] font-semibold text-[#E4CB86]">' +
      (f.staticPrice ? "사전예약" : rows.length + "개 트림") +
      "</p>" +
      '<h3 class="mt-1 text-[24px] font-bold leading-snug">' +
      f.name +
      "</h3>" +
      '<p class="mt-2 text-[17px] leading-relaxed text-[#C5CED3]">' +
      f.line +
      "</p>" +
      voucher +
      priceHtml +
      '<div class="mt-4 flex flex-wrap gap-2">' +
      see +
      '<a class="inline-flex rounded-full border border-[#E4CB86] px-4 py-2.5 text-[15px] font-bold text-[#E4CB86]" href="' +
      consultHref(f) +
      '">구매 문의</a></div></article>'
    );
  }

  var html = '<h2 class="text-[26px] font-bold">차종을 고르면 실구매가가 보입니다</h2>';
  html += '<p class="mt-2 text-[17px] leading-relaxed text-[#C5CED3]">정상가격과, 재구매·인증 중고·신한카드까지 맞을 때의 최대 실구매가입니다. 트림별 조건은 같은 화면 아래에서 이어집니다.</p>';
  groupMeta.forEach(function (g) {
    var cards = families.filter(function (f) { return f.group === g.id; }).map(card).filter(Boolean);
    if (!cards.length) return;
    html += '<section class="mt-6"><h3 class="text-[20px] font-bold">' + g.label + '</h3><div class="mt-3 grid gap-3 sm:grid-cols-2">' + cards.join("") + "</div>";
    if (g.id === "ev") {
      html += '<p class="mt-3 text-[16px] leading-relaxed text-[#C5CED3]">EQA, EQB, EQE, EQS, 마이바흐 EQS, G 580을 10월에 벤츠 금융으로 사면 충전 바우처 100만원입니다. SK일렉링크에서 쓰고, 계약이 실행된 뒤 휴대폰으로 가입 링크가 옵니다. 일렉트릭 GLC 사전예약에는 이 바우처가 아직 없습니다.</p>';
    }
    html += "</section>";
  });
  html += '<p class="mt-4 text-[16px]"><a class="font-bold text-[#E4CB86] underline" href="models.html">전 트림을 나란히 비교하려면 차량 가이드</a></p>';
  board.innerHTML = html;

  var loadedBenefit = false;
  function loadBenefit() {
    if (loadedBenefit) return;
    loadedBenefit = true;
    slot.innerHTML = '<p class="text-[17px] text-[#C5CED3]">추가 혜택을 불러오는 중입니다.</p>';
    fetch("benefit.html")
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var main = doc.querySelector("main");
        slot.innerHTML = main ? main.innerHTML : "";
      })
      .catch(function () {
        slot.innerHTML = '<p class="text-[17px]"><a class="font-bold text-[#E4CB86] underline" href="benefit.html">추가 혜택 페이지 보기</a></p>';
      });
  }

  var loadedFleet = false;
  function loadFleet() {
    if (loadedFleet) return;
    loadedFleet = true;
    fleetSlot.innerHTML = '<p class="text-[17px] text-[#C5CED3]">법인 할인을 불러오는 중입니다.</p>';
    fetch("fleet.html")
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var main = doc.querySelector("main");
        fleetSlot.innerHTML = main ? main.innerHTML : "";
      })
      .catch(function () {
        fleetSlot.innerHTML = '<p class="text-[17px]"><a class="font-bold text-[#E4CB86] underline" href="fleet.html">법인 구매 특별 할인 보기</a></p>';
      });
  }

  function loadPage(flag, el, url, loading, failHref, failLabel) {
    if (flag.done) return;
    flag.done = true;
    el.innerHTML = '<p class="text-[17px] text-[#C5CED3]">' + loading + "</p>";
    fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var main = doc.querySelector("main");
        el.innerHTML = main ? main.innerHTML : "";
      })
      .catch(function () {
        el.innerHTML = '<p class="text-[17px]"><a class="font-bold text-[#E4CB86] underline" href="' + failHref + '">' + failLabel + "</a></p>";
      });
  }
  var goldenFlag = { done: false };
  var rentalFlag = { done: false };

  function allIds() {
    var ids = ["promo-board", "benefit-slot", "fleet-slot", "golden-slot", "rental-slot"];
    tabs.forEach(function (tab) {
      tab.ids.forEach(function (id) {
        if (ids.indexOf(id) === -1) ids.push(id);
      });
    });
    return ids;
  }
  function activate(tabId, scrollId) {
    var tab = null;
    tabs.forEach(function (item) {
      if (item.id === tabId) tab = item;
    });
    if (!tab) tab = tabs[0];
    bar.querySelectorAll("button").forEach(function (btn) {
      btn.setAttribute("aria-selected", btn.getAttribute("data-tab") === tab.id ? "true" : "false");
    });
    allIds().forEach(function (id) {
      var node = document.getElementById(id);
      if (!node) return;
      if (tab.ids.indexOf(id) === -1) node.classList.add("promo-off");
      else node.classList.remove("promo-off");
    });
    if (tab.id === "extra") loadBenefit();
    if (tab.id === "fleet") loadFleet();
    if (tab.id === "golden") loadPage(goldenFlag, goldenSlot, "golden.html", "골든타임을 불러오는 중입니다.", "golden.html", "골든타임 보기");
    if (tab.id === "rental") loadPage(rentalFlag, rentalSlot, "rental.html", "렌터카 조건을 불러오는 중입니다.", "rental.html", "렌터카·장기렌트 보기");
    if (history.replaceState) history.replaceState(null, "", "prices.html" + location.search + "#" + (scrollId || tab.id));
    if (scrollId && document.getElementById(scrollId)) {
      document.getElementById(scrollId).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  bar.addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;
    activate(btn.getAttribute("data-tab"));
  });
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || !document.body.contains(a)) return;
    var id = a.getAttribute("href").slice(1);
    if (!hashTab[id]) return;
    e.preventDefault();
    activate(hashTab[id], id);
  });

  var start = (location.hash || "").replace("#", "");
  activate(hashTab[start] || "cars", start && document.getElementById(start) ? start : "");
})();
