/* 메인 구매 화면. 금액은 quote.js BenzQuote.scene 한 곳만 사용합니다. */
(function () {
  var data = window.OCTOBER_2026;
  if (!data || !window.BenzQuote) return;

  var E_EX = "E 200 Exclusive";
  var E_AMG = "E 200 AMG Line";
  var PAYS = [
    ["cash", "현금"],
    ["install", "할부"],
    ["care", "안심보장할부"],
    ["lease", "운용리스·장기렌트"]
  ];
  var PAY_OK = { cash: 1, install: 1, care: 1, lease: 1 };
  var OTHERS = [
    { line: "E클래스", name: "E 300 4MATIC Exclusive", my: "MY27" },
    { line: "C클래스", name: "C 200 AMG Line", my: "MY26" },
    { line: "GLC", name: "GLC 300 4MATIC Avantgarde", my: "MY27" },
    { line: "GLE", name: "GLE 450 4MATIC", my: "MY26" },
    { line: "S클래스", name: "S 450 4MATIC", my: "MY27" }
  ];
  var SPEC = {
    MY26: [
      ["외관 스타일", "크롬 라디에이터 그릴. 더블 루버 3개.", "파워 돔 보닛, AMG 프론트 에이프런. Mercedes-AMG 고성능 모델이 아닙니다."],
      ["휠", "18인치 5 트윈 스포크 경량 알로이", "19인치 AMG 5 트윈 스포크 경량 알로이"],
      ["기본 사양", "컴포트 서스펜션", "어질리티 컨트롤 서스펜션"]
    ]
  };

  var rows = (data.models || []).map(function (row) {
    return {
      seg: row[0], my: row[1], name: row[2], price: row[3], cash: row[4], mbm: row[5],
      jc: row[6], retain: row[7], conquest: row[8], shinhan: row[9], note: row[10] || ""
    };
  });
  var state = {
    year: "",
    modelYear: "",
    pay: "install",
    model: E_EX,
    retain: false,
    trade: false,
    conquest: false,
    mou: false,
    engaged: false
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function showName(name) {
    var text = String(name).replace("(SWB)", "숏바디").replace(/ Long/g, " 롱바디").replace(/ electric/g, " 일렉트릭");
    if (text === "S 450 4MATIC") return "S 450 4MATIC 숏바디";
    return text;
  }
  function yearLabel(my) {
    var num = String(my || "").replace("MY", "");
    return num ? num + "년식" : "";
  }
  function dateLabel(value) {
    var match = String(value || "").match(/(\d{4})\.(\d{2})\.(\d{2})/);
    if (!match) return "";
    return match[1] + "년 " + Number(match[2]) + "월 " + Number(match[3]) + "일";
  }
  function monthLabel(value) {
    var match = String(value || "").match(/(\d{4})\.(\d{2})/);
    if (!match) return "";
    return match[1] + "년 " + Number(match[2]) + "월";
  }
  function manText(won) {
    var man = window.BenzQuote.man(won);
    if (man == null) return "";
    return man.toLocaleString("ko-KR") + "만원";
  }
  function percentSaved(view) {
    if (!view || !view.q || view.q.basis == null || !view.rate) return null;
    return view.q.basis - window.BenzQuote.floorWon(view.q.basis * (1 - view.rate / 100));
  }
  function dealHtml(view) {
    if (!view || view.status !== "ok" || !view.rate) return "";
    return '<p class="hp-deal"><span class="hp-badge">' + esc(String(view.rate)) + '% 할인</span><b>' + esc(manText(percentSaved(view))) + " 할인</b></p>";
  }
  function payName(pay) {
    var hit = PAYS.filter(function (item) { return item[0] === pay; })[0];
    return hit ? hit[1] : "";
  }
  function findRow(name, my) {
    return rows.filter(function (row) { return row.name === name && row.my === my; })[0] || null;
  }
  function yearsOf(name) {
    var list = [];
    rows.forEach(function (row) {
      if (row.name === name && list.indexOf(row.my) === -1) list.push(row.my);
    });
    return list.sort().reverse();
  }
  function eYears() {
    var list = [];
    yearsOf(E_EX).concat(yearsOf(E_AMG)).forEach(function (my) {
      if (list.indexOf(my) === -1) list.push(my);
    });
    return list.sort().reverse();
  }
  function stockOf(row) {
    if (!row || !window.BenzStock) return { code: "live", label: "", reason: "" };
    return window.BenzStock.of(row);
  }
  function plainScene(row) {
    return window.BenzQuote.scene(row, { pay: state.pay });
  }
  function fullScene(row) {
    return window.BenzQuote.scene(row, {
      pay: state.pay,
      retain: state.retain,
      trade: state.trade,
      conquest: state.conquest,
      mou: state.mou
    });
  }
  function calcRow() {
    return findRow(state.model, state.modelYear || state.year);
  }
  function financeBasis(pay) {
    return pay === "install" || pay === "care" || pay === "lease";
  }
  function pickPayload(name, my) {
    return {
      name: name || state.model,
      my: my || state.modelYear || state.year,
      pay: state.pay,
      retain: state.retain,
      trade: state.trade,
      conquest: state.conquest,
      mou: state.mou
    };
  }
  function remember() {
    if (!window.BenzPick) return;
    window.BenzPick.write(pickPayload());
  }
  function quoteHref(name, my) {
    var query = window.BenzPick ? window.BenzPick.params(pickPayload(name, my)).toString() : "";
    return "quote.html?" + query;
  }
  function syncUrl() {
    if (!history.replaceState) return;
    var query = window.BenzPick ? window.BenzPick.params(pickPayload()).toString() : "";
    var hash = location.hash || "";
    history.replaceState(null, "", (query ? "?" + query : location.pathname) + hash);
  }

  function photo(name, my, eager) {
    var src = window.BenzPhoto ? window.BenzPhoto.src(name) : "";
    if (!src) return "";
    var alt = showName(name) + " 앞모습";
    if (my === "MY26") alt += ". 26년식 카탈로그 사진";
    else alt += ". 26년식 카탈로그의 같은 트림 사진";
    return '<div class="car-photo"><img src="' + esc(src) + '" alt="' + esc(alt) + '" width="640" height="400" decoding="async"' + (eager ? "" : ' loading="lazy"') + "></div>";
  }

  function paintHero() {
    var month = monthLabel(data.asOfPromo);
    var kicker = document.getElementById("hero-kicker");
    if (kicker) kicker.textContent = "벤츠프로 · " + (month || "구매 혜택") + (month ? " 구매 혜택" : "");
  }

  function chip(group, value, label, pressed) {
    return '<button type="button" class="hp-chip" data-group="' + group + '" data-value="' + esc(value) + '" aria-pressed="' + (pressed ? "true" : "false") + '">' + esc(label) + "</button>";
  }

  function card(name) {
    var row = findRow(name, state.year);
    var ko = name === E_EX ? "익스클루시브" : "AMG 라인";
    var warn = name === E_AMG ? '<p class="hp-note">AMG 라인 트림입니다. Mercedes-AMG 고성능 모델이 아닙니다.</p>' : "";
    if (!row) {
      return '<article class="hp-card"><h3>' + esc(name) + "</h3><p>" + esc(ko) + "</p><p class=\"hp-num\">조건 확인 필요</p><p class=\"hp-note\">" + esc(yearLabel(state.year)) + " 가격 데이터가 없습니다.</p></article>";
    }
    var stock = stockOf(row);
    var view = plainScene(row);
    var period = "가격표 " + (dateLabel(data.asOfPrice) || "확인 필요") + " · 할인 " + (dateLabel(data.asOfPromo) || "확인 필요");
    var photoNote = state.year === "MY26" ? "" : '<p class="hp-photo-note">사진은 26년식 카탈로그의 이 트림입니다. ' + esc(yearLabel(state.year)) + " 전용 사진은 없습니다.</p>";
    var body;
    if (stock.code === "soldout") {
      body = '<p class="hp-num">재고 소진</p><p class="hp-note">' + esc(stock.reason || "이 연식은 현재 구매 가격으로 보여 드리지 않습니다.") + "</p>";
    } else if (view.status !== "ok") {
      body = '<p class="hp-meta">차량가 ' + esc(manText(view.q.basis) || "확인 필요") + '</p><p class="hp-num">조건 확인 필요</p><p class="hp-note">' + esc(payName(state.pay)) + " 기준 할인이 이 데이터에 없습니다. 다른 연식 가격으로 바꾸지 않았습니다.</p>";
    } else {
      var basis = financeBasis(state.pay) ? '<p class="hp-basis">대상 금융 이용 기준 · ' + esc(payName(state.pay)) + "</p>" : '<p class="hp-basis">' + esc(payName(state.pay)) + " 구매 기준</p>";
      body =
        '<p class="hp-meta">차량가 ' + esc(manText(view.q.basis)) + "</p>" +
        dealHtml(view) +
        '<p class="hp-num" data-count data-count-key="hero-final-' + esc(name) + '">' + esc(manText(view.after)) + "</p>" +
        '<p class="hp-note">할인 적용 차량가. 취득세, 등록비, 보험료, 금융 이자는 포함되지 않습니다.</p>' +
        basis +
        '<p class="hp-note">' + esc(view.lines.map(function (line) { return line.label + " " + line.pct + "%"; }).join(" · ")) + "</p>";
    }
    return (
      '<article class="hp-card">' +
      photo(name, state.year, true) + photoNote +
      "<h3>" + esc(name) + "</h3>" +
      "<p>" + esc(ko) + " · " + esc(yearLabel(row.my)) + "</p>" + warn + body +
      '<p class="hp-note">' + esc(period) + "</p>" +
      '<div class="hp-actions"><button type="button" class="hp-btn" data-open-calc="' + esc(name) + '">내 조건으로 견적 보기</button><a class="hp-btn-line" href="#trim">트림 차이 보기</a></div>' +
      "</article>"
    );
  }

  function paintE() {
    var host = document.getElementById("e-tools");
    var grid = document.getElementById("e-cards");
    if (!host || !grid) return;
    host.innerHTML =
      eYears().map(function (my) { return chip("year", my, yearLabel(my), my === state.year); }).join("") +
      PAYS.map(function (item) { return chip("pay", item[0], item[1], item[0] === state.pay); }).join("");
    grid.innerHTML = card(E_EX) + card(E_AMG);
  }

  function optionHtml(row) {
    var stock = stockOf(row);
    var ended = stock.code === "soldout";
    var value = row.name + "|" + row.my;
    var selected = optionHtml.select && row.name === state.model && row.my === (state.modelYear || state.year) ? " selected" : "";
    var attrs = ended ? ' data-offer="ended" data-status="재고 소진 · 종료된 프로모션"' : "";
    var label = showName(row.name) + " · " + yearLabel(row.my) + (ended ? " · 재고 소진" : "");
    return '<option value="' + esc(value) + '"' + attrs + selected + ">" + esc(label) + "</option>";
  }
  function modelOptions(mark) {
    optionHtml.select = !!mark;
    var html = '<option value="">선택해 주세요</option><option value="상담 후 결정">미정</option>';
    var live = rows.filter(function (row) { return stockOf(row).code !== "soldout"; });
    var past = rows.filter(function (row) { return stockOf(row).code === "soldout"; });
    function groups(list, title) {
      var seg = "";
      var chunk = "";
      list.forEach(function (row) {
        if (row.seg !== seg) {
          if (seg) chunk += "</optgroup>";
          seg = row.seg;
          chunk += '<optgroup label="' + esc(title ? title + " · " + row.seg : row.seg) + '">';
        }
        chunk += optionHtml(row);
      });
      if (seg) chunk += "</optgroup>";
      return chunk;
    }
    html += groups(live, "");
    html += groups(past, "지난 프로모션");
    return html;
  }

  function resultOf(row) {
    if (!row) return { status: "need", blocks: ["차종을 데이터에서 찾지 못했습니다."] };
    var stock = stockOf(row);
    if (stock.code === "soldout") {
      if (window.BenzStock && window.BenzStock.discountPending && window.BenzStock.discountPending(row)) {
        return { status: "list", q: window.BenzQuote.of(row), blocks: [window.BenzStock.pendingNote()], stock: stock };
      }
      return { status: "sold", blocks: [stock.reason || "판매 소진된 연식입니다."], stock: stock };
    }
    return fullScene(row);
  }

  function paintCalc() {
    var model = document.getElementById("calc-model");
    var pays = document.getElementById("calc-pays");
    var opts = document.getElementById("calc-opts");
    var out = document.getElementById("calc-out");
    if (!model || !out) return;
    model.innerHTML = modelOptions(true);
    pays.innerHTML = PAYS.map(function (item) { return chip("calc-pay", item[0], item[1], item[0] === state.pay); }).join("");
    var row = calcRow();
    var view = row ? fullScene(row) : null;
    var retainOn = view && view.retainRate && stockOf(row).code !== "soldout";
    var conqOn = view && view.conqRate && stockOf(row).code !== "soldout";
    var soldPick = row && stockOf(row).code === "soldout";
    opts.innerHTML = soldPick
      ? '<p class="hp-note">추가 혜택은 새 연식에서 다시 고릅니다.</p>'
      :
      '<label class="hp-check' + (retainOn ? "" : " is-off") + '"><input type="checkbox" data-flag="retain"' + (state.retain && retainOn ? " checked" : "") + (retainOn ? "" : " disabled") + '><span>지금 타는 벤츠<small>' + (retainOn ? "재구매 혜택 " + view.retainRate + "%. 다른 브랜드 혜택과는 같이 쓰지 않습니다." : "이 연식에는 재구매 혜택이 없습니다.") + "</small></span></label>" +
      '<label class="hp-check' + (retainOn ? "" : " is-off") + '"><input type="checkbox" data-flag="trade"' + (state.trade && retainOn ? " checked" : "") + (retainOn ? "" : " disabled") + '><span>인증 중고로 매각<small>' + (retainOn ? "재구매를 켠 차에 1%가 더해집니다. 다른 브랜드 혜택과는 같이 쓰지 않습니다." : "재구매 혜택이 있는 차만 적용됩니다.") + "</small></span></label>" +
      '<label class="hp-check' + (conqOn ? "" : " is-off") + '"><input type="checkbox" data-flag="conquest"' + (state.conquest && conqOn ? " checked" : "") + (conqOn ? "" : " disabled") + '><span>다른 고급 브랜드<small>' + (conqOn ? "혜택 " + view.conqRate + "%. 지금 타는 벤츠 혜택과 같이 쓰지 않습니다." : "이 차종은 다른 브랜드 혜택 대상이 아닙니다.") + "</small></span></label>" +
      '<label class="hp-check"><input type="checkbox" data-flag="mou"' + (state.mou ? " checked" : "") + '><span>MOU 제휴<small>제휴 여부는 상담에서 확인합니다. 여기서는 기존 견적과 같은 2%만 더합니다.</small></span></label>';
    var shown = resultOf(row);
    var html = "";
    if (!row || shown.status === "need") {
      html = '<p class="hp-num">조건 확인 필요</p><p class="hp-note">이 연식과 구매 방식의 할인 데이터가 없습니다.</p>';
    } else if (shown.status === "list") {
      html = '<p class="hp-meta">정상가격 ' + esc(manText(shown.q && shown.q.basis)) + '</p><p class="hp-note">' + esc(shown.blocks[0] || "") + "</p>";
    } else if (shown.status === "sold") {
      html = '<p class="hp-num">재고 소진 · 종료된 프로모션</p><p class="hp-note">' + esc(shown.blocks[0] || "") + "</p>";
    } else {
      html =
        '<p class="hp-meta">차량가 ' + esc(manText(shown.q.basis)) + "</p>" +
        dealHtml(shown) +
        "<ul class=\"hp-note\">" + shown.lines.map(function (line) {
          return "<li>" + esc(line.label) + " " + esc(String(line.pct)) + "%</li>";
        }).join("") + "</ul>" +
        (financeBasis(state.pay) ? '<p class="hp-basis">대상 금융 이용 기준 · ' + esc(payName(state.pay)) + "</p>" : "") +
        '<p class="hp-num">' + esc(manText(shown.after)) + "</p>" +
        '<p class="hp-note">할인 적용 예상 차량가. 취득세, 등록비, 보험료, 금융 이자는 포함되지 않습니다.</p>';
      if (shown.month) {
        html += '<p class="hp-note">월 납입 지원 ' + shown.month + "만원 × 6개월. 월 납입금이 아니며, 차량가에 더하지 않았습니다.</p>";
      }
    }
    if (shown.blocks && shown.blocks.length && shown.status !== "sold") {
      html += '<p class="hp-note">확인이 필요한 조건</p><ul class="hp-note">' + shown.blocks.map(function (line) {
        return "<li>" + esc(line) + "</li>";
      }).join("") + "</ul>";
    }
    if (shown.status === "sold") {
      var nudge = window.BenzStock && window.BenzStock.suggest ? window.BenzStock.suggest(row) : { text: "새 연식 조건을 확인해 보세요." };
      html += '<p class="hp-note">이 숫자는 지난 프로모션입니다. ' + esc(nudge.text) + "</p>";
    } else {
      html += '<p class="hp-note"><a href="' + esc(quoteHref()) + '">통관, 전시, 수리 이력처럼 특정 재고만 해당하는 조건은 상세 견적에서 확인합니다.</a></p>';
    }
    out.innerHTML = html;
    document.querySelectorAll("#bp-quote, [data-bp-quote]").forEach(function (navQuote) {
      navQuote.setAttribute("href", quoteHref());
    });
    var go = document.getElementById("calc-quote");
    var talk = document.getElementById("calc-talk");
    var nudge = row && window.BenzStock && window.BenzStock.suggest ? window.BenzStock.suggest(row) : { name: "", my: "", text: "" };
    var nextHref = nudge.name ? ("quote.html?name=" + encodeURIComponent(nudge.name) + "&my=" + encodeURIComponent(nudge.my)) : quoteHref();
    if (go) {
      go.setAttribute("href", shown.status === "sold" || shown.status === "list" ? nextHref : quoteHref());
      go.textContent = shown.status === "sold" || shown.status === "list" ? "새 연식 확인하기" : "상세 견적 이어보기";
    }
    if (talk) {
      talk.setAttribute("href", "#consulting");
      talk.textContent = shown.status === "sold" || shown.status === "list" ? "새 연식으로 상담" : "이 조건으로 상담받기";
    }
    paintBrief(row, shown);
    paintFormCar();
  }

  function briefText(row, view) {
    if (view && view.status === "list") {
      return "정상가격. " + showName(row.name) + " · " + yearLabel(row.my) + ". " + manText(view.q && view.q.basis) + ". " + (view.blocks[0] || "");
    }
    if (view && view.status === "sold") {
      var nudge = window.BenzStock && window.BenzStock.suggest ? window.BenzStock.suggest(row) : { text: "새 연식 조건을 확인해 보세요." };
      return "지난 프로모션. " + showName(row.name) + " · " + yearLabel(row.my) + ". " + nudge.text + " " + (view.blocks[0] || "");
    }
    if (!row || !view || view.status !== "ok") {
      return showName(state.model) + " · " + yearLabel(state.modelYear || state.year) + " · " + payName(state.pay) + " · 할인 조건 확인 필요";
    }
    return [
      "선택 조건",
      showName(row.name),
      yearLabel(row.my),
      payName(state.pay),
      "차량가 " + manText(view.q.basis),
      "할인 합계 " + manText(view.saved),
      "할인 적용 차량가 " + manText(view.after),
      view.lines.map(function (line) { return line.label + " " + line.pct + "%"; }).join(", ")
    ].join(" · ");
  }

  function paintBrief(row, view) {
    var brief = document.getElementById("consult-brief");
    var box = document.getElementById("quote-detail");
    var ready = !!(state.engaged && row && view && view.status === "ok");
    var copyReady = ready || !!(state.engaged && row && view && view.status === "list");
    if (brief) brief.dataset.copy = copyReady ? briefText(row, view) : "";
    if (box) box.hidden = !ready;
    if (!brief) return;
    brief.textContent = "";
    if (!ready) return;
    [
      ["구매 방식", payName(state.pay)],
      ["차량가", manText(view.q.basis)],
      ["할인", view.lines.length ? view.lines.map(function (line) { return line.label + " " + line.pct + "%"; }).join(", ") : "선택한 할인 없음"],
      ["할인 합계", manText(view.saved)],
      ["할인 적용 차량가", manText(view.after)]
    ].forEach(function (pair) {
      var line = document.createElement("p");
      var name = document.createElement("b");
      name.textContent = pair[0];
      line.appendChild(name);
      line.appendChild(document.createTextNode(" " + pair[1]));
      brief.appendChild(line);
    });
    var basis = document.createElement("p");
    basis.textContent = "부가세가 포함된 권장소비자가에서 선택한 할인만 빼고, 만원 단위로 내림합니다. 취득세, 등록비, 보험료, 금융 이자, 월 납입 지원은 빠집니다.";
    brief.appendChild(basis);
  }

  function paintFormCar() {
    var select = document.getElementById("field-car");
    if (!select || select.value === "상담 후 결정") return;
    var keep = select.value;
    select.innerHTML = modelOptions(state.engaged);
    if (keep === "상담 후 결정") {
      select.value = "상담 후 결정";
      return;
    }
    if (!state.engaged) {
      select.value = "";
      return;
    }
    var wanted = state.model + "|" + (state.modelYear || state.year);
    Array.prototype.forEach.call(select.options, function (option) {
      if (option.value === wanted) option.selected = true;
    });
    var method = document.getElementById("field-method");
    if (method && !method.dataset.touched) {
      var map = { cash: "현금", install: "할부", care: "할부", lease: "운용리스" };
      method.value = map[state.pay] || "";
    }
    var owned = document.getElementById("field-owned");
    if (owned && !owned.dataset.touched) {
      if (state.retain || state.trade) owned.value = "벤츠 보유";
      else if (state.conquest) owned.value = "타 브랜드 보유";
    }
  }

  function paintCompare() {
    var host = document.getElementById("trim-table");
    var links = document.getElementById("trim-links");
    if (!host) return;
    var left = findRow(E_EX, state.year);
    var right = findRow(E_AMG, state.year);
    var lv = left ? plainScene(left) : null;
    var rv = right ? plainScene(right) : null;
    var leftPrice = left && stockOf(left).code !== "soldout" && lv.status === "ok" ? manText(lv.after) : "조건 확인 필요";
    var rightPrice = right && stockOf(right).code !== "soldout" && rv.status === "ok" ? manText(rv.after) : "조건 확인 필요";
    var gap = "가격 차이는 같은 조건이 모두 있을 때만 계산합니다.";
    if (leftPrice !== "조건 확인 필요" && rightPrice !== "조건 확인 필요") {
      gap = manText(rv.after - lv.after);
    }
    var specSource = SPEC[state.year] || (state.year === "MY27" ? SPEC.MY26 : null);
    var specRows = (specSource || [
      ["외관 스타일", "확인 전", "확인 전"],
      ["휠", "확인 전", "확인 전"],
      ["기본 사양", "확인 전", "확인 전"]
    ]).map(function (item) {
      return "<tr><th scope=\"row\">" + esc(item[0]) + "</th><td>" + esc(item[1]) + "</td><td>" + esc(item[2]) + "</td></tr>";
    }).join("");
    var source = state.year === "MY26"
      ? "외관, 휠, 하체는 26년식 E클래스 카탈로그와 기본 사양 자료에서 확인된 내용입니다."
      : "공통 사양은 2026년식 기준으로 정리했으며, 확인된 2027년식 변경 사항을 반영했습니다. 실제 적용 사양은 출고 차량 기준으로 확인해 주세요.";
    var delta = "";
    if (state.year === "MY27" && window.BenzStock && window.BenzStock.eEquip) {
      delta = '<h3 class="hp-delta">달라진 점</h3><ul class="hp-note">' + window.BenzStock.eEquip().map(function (item) {
        return "<li>" + esc(item.text) + "</li>";
      }).join("") + "</ul>";
    }
    host.innerHTML =
      "<table class=\"hp-table\"><caption class=\"hp-note\">" + esc(yearLabel(state.year)) + " · " + esc(payName(state.pay)) + " · 추가 혜택은 넣지 않은 비교</caption><thead><tr><th scope=\"col\">항목</th><th scope=\"col\">익스클루시브</th><th scope=\"col\">AMG 라인</th></tr></thead><tbody>" +
      specRows +
      "<tr><th scope=\"row\">할인 적용 차량가</th><td>" + esc(leftPrice) + "</td><td>" + esc(rightPrice) + "</td></tr>" +
      "<tr><th scope=\"row\">가격 차이</th><td colspan=\"2\">AMG 라인 − 익스클루시브 " + esc(gap) + "</td></tr>" +
      "</tbody></table><p class=\"hp-note\">" + esc(source) + "</p>" + delta;
    if (links) {
      var compare = "models.html?pick=" + encodeURIComponent(E_EX) + "&my=" + encodeURIComponent(state.year) + "&vs=" + encodeURIComponent(E_AMG) + "&vsmy=" + encodeURIComponent(state.year);
      links.innerHTML =
        '<a class="hp-btn" href="' + esc(quoteHref(E_EX, state.year)) + '">익스클루시브로 견적 보기</a>' +
        '<a class="hp-btn" href="' + esc(quoteHref(E_AMG, state.year)) + '">AMG 라인으로 견적 보기</a>' +
        '<a class="hp-btn-line" href="' + esc(compare) + '">전체 사양 비교하기</a>';
    }
  }

  function paintOthers() {
    var host = document.getElementById("other-models");
    if (!host) return;
    host.innerHTML = OTHERS.map(function (item) {
      var row = findRow(item.name, item.my);
      var stock = stockOf(row);
      var view = row ? window.BenzQuote.scene(row, { pay: state.pay }) : null;
      var price = "조건 확인 필요";
      var basis = payName(state.pay) + " 기준";
      if (row && stock.code === "soldout") price = "재고 소진";
      else if (view && view.status === "ok") price = manText(view.after);
      else if (view && view.q.basis != null) basis = "차량가 " + manText(view.q.basis);
      var href = row ? quoteHref(item.name, item.my) : "prices.html#highlights";
      return (
        '<article class="hp-link-card">' + photo(item.name, item.my, false) +
        '<p class="hp-note">' + esc(item.line) + "</p><strong>" + esc(showName(item.name)) + "</strong>" +
        "<p>" + esc(yearLabel(item.my)) + (basis ? " · " + esc(basis) : "") + "</p>" +
        (view && view.status === "ok" && stock.code !== "soldout" ? dealHtml(view) : "") +
        '<p class="hp-num" style="font-size:1.6rem">' + esc(price) + "</p>" +
        '<a class="hp-btn" href="' + esc(href) + '" data-model-quote="' + esc(item.name) + '">이 차로 견적 보기</a></article>'
      );
    }).join("");
  }

  function paintBar() {
    var primary = document.getElementById("bar-primary");
    var secondary = document.getElementById("bar-secondary");
    if (!primary) return;
    if (state.engaged) {
      primary.textContent = "내 견적 보기";
      primary.setAttribute("href", quoteHref());
      if (secondary) {
        secondary.hidden = false;
        secondary.textContent = "이 조건으로 상담";
        secondary.setAttribute("href", "#consulting");
      }
    } else {
      primary.textContent = "내 할인 계산";
      primary.setAttribute("href", "#calc");
      if (secondary) secondary.hidden = true;
    }
  }

  function draw() {
    paintE();
    paintCalc();
    paintCompare();
    paintOthers();
    paintBar();
    if (state.engaged) remember();
  }

  function engage() {
    state.engaged = true;
    paintBar();
    var row = calcRow();
    paintBrief(row, row ? resultOf(row) : null);
  }

  function boot() {
    var params = new URLSearchParams(location.search);
    var stored = (window.BenzPick && window.BenzPick.read()) || {};
    var years = eYears();
    state.year = years.indexOf("MY26") !== -1 ? "MY26" : (years[0] || "MY26");
    var askedName = params.get("name") || "";
    var askedMy = params.get("my") || "";
    var named = null;
    if (askedName && askedMy) named = findRow(askedName, askedMy);
    else if (askedName) {
      named = rows.filter(function (row) { return row.name === askedName; }).sort(function (a, b) {
        return a.my < b.my ? 1 : -1;
      })[0] || null;
    }
    if ((askedName || askedMy) && !named) {
      var note = document.getElementById("calc-missing");
      if (note) note.hidden = false;
    } else if (named) {
      state.model = named.name;
      state.modelYear = named.my;
      state.engaged = true;
    } else if (!askedName && stored.name && findRow(stored.name, stored.my)) {
      state.model = stored.name;
      state.modelYear = stored.my;
      state.engaged = true;
    }
    if (state.model === E_EX || state.model === E_AMG) state.year = state.modelYear || state.year;
    if (years.indexOf(state.year) === -1) state.year = years[0] || state.year;
    if (!state.modelYear) state.modelYear = state.year;
    if (PAY_OK[params.get("pay")]) state.pay = params.get("pay");
    else if (PAY_OK[stored.pay]) state.pay = stored.pay;
    else {
      var seed = calcRow();
      state.pay = seed ? window.BenzQuote.defaultPay(seed) : "install";
    }
    ["retain", "trade", "conquest", "mou"].forEach(function (key) {
      if (params.get(key) === "1" || (!params.has(key) && stored[key])) state[key] = true;
    });
    if (state.trade) state.retain = true;
    if ((state.retain || state.trade) && state.conquest) state.conquest = false;
    paintHero();
    draw();
    if (askedName || params.get("pay") || params.get("retain") || params.get("trade") || params.get("mou")) engage();
    var note = params.get("note");
    if (note) {
      var inquiry = document.getElementById("field-inquiry");
      if (inquiry && !inquiry.value) {
        inquiry.value = params.get("ended") === "1"
          ? "종료된 프로모션 안내 요청입니다. " + note + " 현재 출고 조건이 아닙니다."
          : note;
      }
      var details = inquiry && inquiry.closest("details");
      if (details) details.open = true;
    }
    paintFormCar();
  }

  var root = document.getElementById("buy");
  if (!root) return;
  boot();

  mountInsights();

  /* 측정: 사용자가 직접 바꾼 경우에만 호출합니다. 측정이 막히거나 실패해도 견적 기능에는 영향이 없습니다. */
  function track(fn) {
    try {
      if (window.BenzTrack) fn(window.BenzTrack);
    } catch (err) { /* 무시 */ }
  }
  track(function (T) {
    T.setContext(function () { return state.engaged ? { row: calcRow(), pay: state.pay } : null; });
  });
  function trackQuote() {
    track(function (T) {
      if (!state.engaged) return;
      var row = calcRow();
      var out = document.getElementById("calc-out");
      if (!row || !out || !out.offsetParent) return;
      var view = resultOf(row);
      if (!view || view.status !== "ok") return;
      var flags = [];
      if (state.retain && view.retainRate) flags.push("retain");
      if (state.trade && view.retainRate) flags.push("trade");
      if (state.conquest && view.conqRate) flags.push("conquest");
      if (state.mou) flags.push("mou");
      T.quoteView(row, state.pay, flags, view.after, "calculator", "change");
    });
  }

  root.addEventListener("click", function (event) {
    var chipBtn = event.target.closest("[data-group]");
    if (chipBtn) {
      var group = chipBtn.getAttribute("data-group");
      var value = chipBtn.getAttribute("data-value");
      var prevYear = state.year;
      var prevPay = state.pay;
      if (group === "year") {
        state.year = value;
        if (state.model === E_EX || state.model === E_AMG) state.modelYear = value;
      }
      if (group === "pay" || group === "calc-pay") state.pay = value;
      engage();
      draw();
      syncUrl();
      if (group === "year" && value !== prevYear) {
        track(function (T) { T.vehicleSelect(null, "hero", { vehicle_series: "e_class", model_year: value }); });
      }
      if ((group === "pay" || group === "calc-pay") && value !== prevPay) {
        track(function (T) { T.purchaseMethodSelect(value, group === "pay" ? "hero" : "calculator", group === "pay" ? null : calcRow()); });
      }
      trackQuote();
      return;
    }
    var open = event.target.closest("[data-open-calc]");
    if (open) {
      state.model = open.getAttribute("data-open-calc");
      state.modelYear = state.year;
      var carSelect = document.getElementById("field-car");
      if (carSelect && carSelect.value === "상담 후 결정") carSelect.value = "";
      engage();
      draw();
      syncUrl();
      track(function (T) { T.vehicleSelect(calcRow(), "hero"); });
      trackQuote();
      var calc = document.getElementById("calc");
      if (calc) calc.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  root.addEventListener("change", function (event) {
    var flag = event.target.closest("[data-flag]");
    if (flag) {
      var key = flag.getAttribute("data-flag");
      state[key] = flag.checked;
      if (key === "retain" && flag.checked) state.conquest = false;
      if (key === "retain" && !flag.checked) state.trade = false;
      if (key === "trade" && flag.checked) {
        state.retain = true;
        state.conquest = false;
      }
      if (key === "conquest" && flag.checked) {
        state.retain = false;
        state.trade = false;
      }
      engage();
      draw();
      syncUrl();
      track(function (T) {
        if (!T.isUser(event)) return;
        T.benefitSelect(key, flag.checked, "calculator", calcRow(), state.pay);
      });
      trackQuote();
      return;
    }
    if (event.target.id === "calc-model" || event.target.id === "field-car") {
      var value = event.target.value;
      if (value === "상담 후 결정") return;
      if (value && value.indexOf("|") !== -1) {
        var prevKey = state.model + "|" + (state.modelYear || state.year);
        state.model = value.slice(0, value.indexOf("|"));
        state.modelYear = value.slice(value.indexOf("|") + 1);
        if (state.model === E_EX || state.model === E_AMG) state.year = state.modelYear;
        engage();
        draw();
        syncUrl();
        if (value !== prevKey) {
          var where = event.target.id === "field-car" ? "contact_section" : "calculator";
          track(function (T) {
            if (T.isUser(event)) T.vehicleSelect(calcRow(), where);
          });
        }
        track(function (T) {
          if (T.isUser(event)) trackQuote();
        });
      }
    }
    if (event.target.id === "field-method") event.target.dataset.touched = "1";
    if (event.target.id === "field-owned") event.target.dataset.touched = "1";
  });

  var menuBtn = document.getElementById("menu-btn");
  var menu = document.getElementById("site-menu");
  var desktop = window.matchMedia("(min-width: 960px)");
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    if (desktop.matches) {
      menu.classList.add("is-open");
      menuBtn.setAttribute("aria-expanded", "true");
      return;
    }
    menu.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      var first = menu.querySelector("a, button");
      if (first) first.focus();
    }
  }
  if (menuBtn && menu) {
    setMenu(false);
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true" && !desktop.matches) {
        setMenu(false);
        menuBtn.focus();
      }
      if (event.key !== "Tab" || desktop.matches || menuBtn.getAttribute("aria-expanded") !== "true") return;
      var items = menu.querySelectorAll("a, button");
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (desktop.matches || menuBtn.getAttribute("aria-expanded") !== "true") return;
      if (menu.contains(event.target) || menuBtn.contains(event.target)) return;
      setMenu(false);
    });
    if (desktop.addEventListener) desktop.addEventListener("change", function () { setMenu(false); });
  }

  var bar = document.getElementById("cta");
  var zone = document.getElementById("consulting");
  function quietKakao(away) {
    var dock = document.querySelector(".bp-dock");
    if (dock) dock.classList.toggle("is-low", !!away);
  }
  if (bar && zone && window.IntersectionObserver) {
    var watcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var away = entry.isIntersecting && entry.intersectionRatio > 0.12;
        bar.classList.toggle("is-away", away);
        quietKakao(away || bar.classList.contains("is-away"));
      });
    }, { threshold: [0, 0.12, 0.4] });
    watcher.observe(zone);
  }
  document.addEventListener("focusin", function (event) {
    if (bar && event.target.closest && event.target.closest("#consult-form")) {
      bar.classList.add("is-away");
      quietKakao(true);
    }
  });
  document.addEventListener("focusout", function (event) {
    if (!bar || !event.target.closest || !event.target.closest("#consult-form")) return;
    setTimeout(function () {
      if (!document.activeElement || !document.activeElement.closest || !document.activeElement.closest("#consult-form")) {
        var zoneBox = zone ? zone.getBoundingClientRect() : null;
        var stillIn = zoneBox && zoneBox.top < window.innerHeight * 0.88 && zoneBox.bottom > window.innerHeight * 0.12;
        if (!stillIn) bar.classList.remove("is-away");
        quietKakao(stillIn);
      }
    }, 120);
  });
  if (window.visualViewport && bar) {
    window.visualViewport.addEventListener("resize", function () {
      var keyboard = window.innerHeight - window.visualViewport.height > 140;
      bar.classList.toggle("is-away", keyboard);
    });
  }

  var copyBtn = document.getElementById("copy-quote");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var note = document.getElementById("copy-note");
      var empty = document.getElementById("copy-empty");
      var fallback = document.getElementById("copy-fallback");
      var box = document.getElementById("copy-text");
      var row = calcRow();
      var view = row ? resultOf(row) : null;
      if (empty) empty.hidden = true;
      if (fallback) fallback.hidden = true;
      if (row && view && view.status === "list") {
        var listText = [
          "차종: " + showName(row.name),
          "연식: " + yearLabel(row.my),
          "정상가격: " + manText(view.q && view.q.basis),
          window.BenzStock.pendingNote()
        ].join("\n");
        function listOk() {
          if (note) note.textContent = "견적 요약을 복사했습니다";
          track(function (T) { T.quoteCopy(row, "", "contact_section"); });
        }
        function listFail() {
          if (note) note.textContent = "복사에 실패했습니다. 아래 글을 직접 선택해 복사해 주세요.";
          if (fallback) fallback.hidden = false;
          if (box) {
            box.value = listText;
            box.focus();
            box.select();
          }
        }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(listText).then(listOk, listFail);
        else listFail();
        return;
      }
      if (!row || !view || view.status !== "ok") {
        if (note) note.textContent = "";
        if (empty) {
          empty.hidden = false;
          var jump = document.getElementById("copy-empty-link");
          if (jump) jump.setAttribute("href", quoteHref());
        }
        return;
      }
      var text = [
        "차종: " + showName(row.name),
        "연식: " + yearLabel(row.my),
        "구매 방식: " + payName(state.pay),
        "할인 조건: " + (view.lines.length ? view.lines.map(function (line) { return line.label + " " + line.pct + "%"; }).join(", ") : "선택한 할인 없음"),
        "차량가: " + manText(view.q.basis),
        "할인 합계: " + manText(view.saved),
        "할인 적용 차량가: " + manText(view.after),
        "계산 기준: 부가세가 포함된 권장소비자가에서 선택한 할인만 빼고, 결과 금액은 만원 단위로 내림합니다.",
        "포함: 선택한 차량 할인",
        "제외: 취득세, 등록비, 보험료, 금융 이자, 월 납입 지원, 사은품"
      ].join("\n");
      function success() {
        if (note) note.textContent = "견적 요약을 복사했습니다";
        track(function (T) { T.quoteCopy(row, state.pay, "contact_section"); });
      }
      function fail() {
        if (note) note.textContent = "복사에 실패했습니다. 아래 글을 직접 선택해 복사해 주세요.";
        if (fallback) fallback.hidden = false;
        if (box) {
          box.value = text;
          box.focus();
          box.select();
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(success, fail);
      else fail();
    });
  }
  var addrBtn = document.getElementById("copy-addr");
  if (addrBtn) {
    addrBtn.addEventListener("click", function () {
      var line = "경기도 고양시 덕양구 의장로 110 (도내동)";
      var note = document.getElementById("addr-note");
      function ok() {
        if (note) note.textContent = "주소를 복사했습니다";
        track(function (T) { T.showroomAction("address_copy"); });
      }
      function bad() { if (note) note.textContent = line; }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(line).then(ok, bad);
      else bad();
    });
  }

  var form = document.getElementById("consult-form");
  if (!form) return;
  var modal = document.getElementById("consult-modal");
  var modalClose = document.getElementById("consult-modal-close");
  function openModal(local) {
    var line = document.getElementById("consult-modal-text");
    if (line) {
      line.textContent = local
        ? "테스트 화면이라 문의는 전송하지 않았습니다."
        : "접수되었습니다. 김민구 차장이 선택하신 차종과 출고 가능 여부를 확인한 뒤 연락드립니다.";
    }
    if (modal) {
      modal.hidden = false;
      modal.removeAttribute("aria-hidden");
      modal.removeAttribute("inert");
      modal.classList.add("is-on");
    }
    if (modalClose) modalClose.focus();
  }
  function closeModal() {
    if (modal) {
      modal.classList.remove("is-on");
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      modal.setAttribute("inert", "");
    }
  }
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-on")) closeModal();
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (window.BenzSubmit && window.BenzSubmit.isBusy(form)) return;
    form.querySelectorAll(".hp-error").forEach(function (item) {
      item.classList.remove("is-on");
      if (item.id === "consult-network-error") item.hidden = true;
    });
    var car = form.querySelector("#field-car");
    var name = form.querySelector("#field-name");
    var phone = form.querySelector("#field-phone");
    var agree = form.querySelector("#privacy-agree");
    var bad = false;
    var missing = [];
    function mark(field, kind) {
      bad = true;
      missing.push(kind);
      var box = field && field.closest("[data-required], [data-question]");
      var message = box && box.querySelector(".hp-error");
      if (message) message.classList.add("is-on");
    }
    if (!car || !car.value) mark(car, "vehicle");
    if (!name || !name.value.trim()) mark(name, "name");
    if (!phone || !phone.value.trim()) mark(phone, "phone");
    if (!agree || !agree.checked) mark(agree, "consent");
    if (bad) {
      track(function (T) { T.formError("home_consult", "validation", missing); });
      var first = form.querySelector(".hp-error.is-on");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    var typed = (form.querySelector("[name='inquiry']").value || "").trim();
    var inquiry;
    if (car.value === "상담 후 결정") {
      inquiry = ["차종 미정", typed].filter(Boolean).join("\n");
    } else {
      var row = calcRow();
      var view = row ? resultOf(row) : null;
      inquiry = [briefText(row, view), typed].filter(Boolean).join("\n");
    }
    var method = form.querySelector("#field-method").value;
    if (!method) {
      method = { cash: "현금", install: "할부", care: "할부", lease: "운용리스" }[state.pay] || "";
    }
    var owned = form.querySelector("#field-owned").value;
    var body = new URLSearchParams();
    body.append("carModel", car.value === "상담 후 결정" ? "상담 후 결정" : car.options[car.selectedIndex].text);
    body.append("purchaseTiming", form.querySelector("#field-when").value || "");
    body.append("purchaseMethod", method);
    body.append("currentCar", owned);
    body.append("region", form.querySelector("#field-region").value || "");
    body.append("name", name.value.trim());
    body.append("phone", phone.value.trim());
    body.append("inquiry", inquiry);
    body.append("privacyAgree", "동의");
    var button = document.getElementById("consult-submit");
    if (!window.BenzSubmit && (location.hostname === "127.0.0.1" || location.hostname === "localhost")) {
      openModal(true);
      return;
    }
    var finish = window.BenzSubmit ? window.BenzSubmit.start(form, button, "상담 신청 중…") : null;
    if (window.BenzSubmit && !finish) return;
    var HOOK = "https://script.google.com/macros/s/AKfycbxxmpBDdwXA5mqTpXznNTpMoOBah2nRgHc69cIe4yQ1iww-U79CXGcxFGdh-o96J7Qd/exec";
    var request = window.BenzSubmit
      ? window.BenzSubmit.post(HOOK, body.toString())
      : fetch(HOOK, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
          body: body.toString()
        });
    var leadRow = car.value === "상담 후 결정" ? null : calcRow();
    var leadPay = leadRow ? state.pay : "";
    track(function (T) { T.formSubmit("home_consult", T.vehicleParams(leadRow, leadPay), button); });
    request.then(function (res) {
      track(function (T) { T.formResult("home_consult", res, T.vehicleParams(leadRow, leadPay)); });
      form.reset();
      if (agree) agree.checked = false;
      openModal(!!(window.BenzSubmit && window.BenzSubmit.isTest));
    }).catch(function (err) {
      track(function (T) { T.formError("home_consult", window.BenzSubmit ? window.BenzSubmit.errorType(err) : "network"); });
      var fail = document.getElementById("consult-network-error");
      if (fail) {
        fail.hidden = false;
        fail.classList.add("is-on");
      }
    }).then(function () {
      if (finish) finish();
    });
  });

  function mountInsights() {
    var track = document.getElementById("insight-list");
    var view = document.getElementById("insight-view");
    var box = document.getElementById("insight-marquee");
    var pauseBtn = document.getElementById("insight-pause");
    var fallback = document.getElementById("insight-fallback");
    if (!track || !view || !box) return;
    var CACHE = "benzpro-insights-v1";
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var userPaused = reduce;
    var dragMoved = false;

    function card(post, clone) {
      var link = document.createElement("a");
      link.className = "bp-card";
      link.href = "https://mercedes.benzpro.co.kr/posts/" + encodeURIComponent(post.slug);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", post.title + " (새 창)");
      if (clone) {
        link.setAttribute("aria-hidden", "true");
        link.tabIndex = -1;
        if ("inert" in link) link.inert = true;
      }
      var img = document.createElement("img");
      img.alt = "";
      img.width = 240;
      img.height = 135;
      img.loading = "lazy";
      img.decoding = "async";
      img.src = post.thumbnail || "images/brand/og.png";
      img.addEventListener("error", function () {
        if (img.getAttribute("src") !== "images/brand/og.png") img.src = "images/brand/og.png";
      });
      var title = document.createElement("strong");
      title.textContent = post.title;
      link.appendChild(img);
      link.appendChild(title);
      return link;
    }
    function setMotion() {
      var half = track.scrollWidth / 2;
      var seconds = Math.max(half / 25, 8);
      track.style.animationDuration = seconds + "s";
      var paused = userPaused || reduce;
      box.classList.toggle("is-paused", paused);
      box.classList.toggle("is-manual", paused);
      if (pauseBtn) {
        pauseBtn.hidden = reduce;
        pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
        pauseBtn.textContent = paused ? "재생" : "일시정지";
      }
    }
    function render(posts) {
      track.textContent = "";
      if (!posts.length) {
        if (fallback) fallback.hidden = false;
        if (pauseBtn) pauseBtn.hidden = true;
        return;
      }
      if (fallback) fallback.hidden = true;
      posts.forEach(function (post) { track.appendChild(card(post, false)); });
      if (!reduce) {
        posts.forEach(function (post) { track.appendChild(card(post, true)); });
      }
      setMotion();
    }
    function normalize(list) {
      var seen = {};
      return (list || []).filter(function (post) {
        if (!post || post.status !== "published" || !post.slug || !post.title) return false;
        if (seen[post.slug]) return false;
        seen[post.slug] = true;
        return true;
      }).sort(function (a, b) {
        return String(b.publish_at || b.created_at || "").localeCompare(String(a.publish_at || a.created_at || ""));
      }).slice(0, 10).map(function (post) {
        return {
          title: String(post.title),
          slug: String(post.slug),
          thumbnail: post.thumbnail ? String(post.thumbnail) : "",
          publish_at: String(post.publish_at || post.created_at || ""),
          status: "published"
        };
      });
    }
    function readCache() {
      try { return normalize(JSON.parse(localStorage.getItem(CACHE) || "[]")); }
      catch (err) { return []; }
    }
    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        userPaused = pauseBtn.getAttribute("aria-pressed") !== "true";
        setMotion();
      });
    }
    view.addEventListener("pointerdown", function (event) {
      view.dataset.x = String(event.clientX);
      dragMoved = false;
    });
    view.addEventListener("pointermove", function (event) {
      if (!view.dataset.x) return;
      if (Math.abs(event.clientX - Number(view.dataset.x)) > 8) {
        dragMoved = true;
        userPaused = true;
        setMotion();
      }
    });
    view.addEventListener("pointerup", function () { delete view.dataset.x; });
    view.addEventListener("pointercancel", function () { delete view.dataset.x; });
    view.addEventListener("click", function (event) {
      if (!dragMoved) return;
      event.preventDefault();
      event.stopPropagation();
      dragMoved = false;
    }, true);
    window.addEventListener("resize", setMotion);

    var cached = readCache();
    if (cached.length) render(cached);
    if (!window.fetch) {
      if (!cached.length && fallback) fallback.hidden = false;
      return;
    }
    fetch("https://mercedes.benzpro.co.kr/api/posts?limit=30")
      .then(function (res) { if (!res.ok) throw new Error("posts"); return res.json(); })
      .then(function (payload) {
        var posts = normalize(payload.posts || []);
        if (!posts.length) throw new Error("empty");
        try { localStorage.setItem(CACHE, JSON.stringify(posts)); } catch (err) {}
        render(posts);
      })
      .catch(function () {
        if (!cached.length && fallback) fallback.hidden = false;
      });
  }
})();
