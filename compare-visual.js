/*
 * 벤츠비교 화면용 시각 비교 + 기술 이야기 모듈
 * - models.html 의 비교 스크립트가 아래 함수를 불러 씁니다.
 * - 데이터는 tech-data.js (window.BENZ_TECH)
 */
(function () {
  var T = window.BENZ_TECH;
  if (!T) return;
  var VER = "?v=20261017d";

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  /* 배포 용량을 맞추려고 고화질(-lg)은 넣지 않습니다. 카드·모달 모두 -sm 한 장만 씁니다. */
  function src(id, size) {
    return T.base + id + "-sm.webp" + VER;
  }

  var byId = {};
  var groupById = {};
  T.groups.forEach(function (g) { groupById[g.id] = g; });
  T.topics.forEach(function (t) {
    byId[t.id] = t;
    t._m = (t.match || []).map(function (x) { return new RegExp(x); });
    t._n = t.nameMatch ? new RegExp(t.nameMatch) : null;
  });

  function topicOfLabel(label) {
    var text = String(label || "");
    for (var i = 0; i < T.topics.length; i++) {
      var t = T.topics[i];
      for (var k = 0; k < t._m.length; k++) if (t._m[k].test(text)) return t;
    }
    return null;
  }

  /* ---------- 차 이름으로 알 수 있는 파워트레인 태그 ---------- */
  var TAG_LABEL = { "4matic": "4MATIC 사륜구동", phev: "플러그인 하이브리드", diesel: "디젤", amg: "AMG 고성능", maybach: "마이바흐", ev: "전기차" };
  function tagsFor(row) {
    var name = String(row.name || "");
    var out = [];
    T.topics.forEach(function (t) {
      if (!t._n || !TAG_LABEL[t.id]) return;
      var hit = t._n.test(name);
      if (t.id === "ev" && row.seg === "EQ") hit = true;
      if (hit) out.push(t.id);
    });
    return out;
  }

  /* ---------- 차종별 트림 사진 / 휠 / 실내 장식 (카탈로그 기준) ---------- */
  var MODELS = T.models || [];
  MODELS.forEach(function (m) {
    m._t = new RegExp(m.test);
    m.trims.forEach(function (t) { t._t = t.test ? new RegExp(t.test) : null; });
  });
  function cleanName(row) { return String(row.name || "").trim(); }
  function modelOf(row) {
    var name = cleanName(row);
    var ev = /electric/i.test(name);
    for (var i = 0; i < MODELS.length; i++) {
      if (ev && !/electric/i.test(MODELS[i].test || "")) continue;
      if (MODELS[i]._t.test(name)) return MODELS[i];
    }
    return null;
  }
  function trimOf(model, row) {
    var name = cleanName(row);
    for (var i = 0; i < model.trims.length; i++) {
      var t = model.trims[i];
      if (t._t && t._t.test(name)) return t;
    }
    return null;
  }
  function isMine(item, row, trim) {
    var name = cleanName(row);
    if (item.names && item.names.indexOf(name) !== -1) return true;
    if (item.rows && item.rows.some(function (r) { return new RegExp(r).test(name); })) return true;
    if (trim && item.std && item.std.indexOf(trim.key) !== -1) return true;
    return false;
  }
  function modelInfo(row) {
    var model = modelOf(row);
    if (!model) return null;
    var trim = trimOf(model, row);
    var wheel = null;
    model.wheels.forEach(function (w) { if (!wheel && isMine(w, row, trim)) wheel = w; });
    var mat = null;
    model.mats.forEach(function (m) { if (!mat && isMine(m, row, trim)) mat = m; });
    return { model: model, trim: trim, wheel: wheel, mat: mat, row: row };
  }
  function eInfo(row) { return modelInfo(row); }

  /* ---------- 상태 표시 ---------- */
  function pill(side, text) {
    var t = String(text || "");
    var cls = "off";
    var shown = "없음";
    if (t === "●") { cls = "on"; shown = "기본"; }
    else if (t === "선택") { cls = "opt"; shown = "유료 선택"; }
    else if (t === "기본 아님") { cls = "na"; shown = "기본 아님"; }
    else if (t && t !== "—") { cls = "on"; shown = t; }
    return '<span class="vs-pill ' + side + " " + cls + '"><i>' + (side === "L" ? "왼쪽" : "오른쪽") + "</i>" + esc(shown) + "</span>";
  }

  function viewButtons(hasRear, hasInt) {
    return '<div class="vs-view" role="group" aria-label="보는 방향"><button type="button" class="on" data-view="front">앞</button>' +
      (hasRear ? '<button type="button" data-view="rear">뒤</button>' : "") +
      (hasInt ? '<button type="button" data-view="int">실내</button>' : "") + "</div>";
  }

  /* ---------- 상단: 두 차 한눈에 ---------- */
  function carHtml(car, side) {
    var multi = (car.rear ? 1 : 0) + (car.int ? 1 : 0) > 0;
    var photo = car.photo
      ? '<img class="vs-photo-img" src="' + esc(car.photo) + '" alt="' + esc(car.name) + '"' +
        (multi ? ' data-front="' + esc(car.photo) + '"' + (car.rear ? ' data-rear="' + esc(car.rear) + '"' : "") + (car.int ? ' data-int="' + esc(car.int) + '"' : "") : "") + ' decoding="async">'
      : '<div class="vs-photo-empty">' + esc(car.name) + "</div>";
    var view = multi ? viewButtons(!!car.rear, !!car.int) : "";
    var tags = (car.tags || []).map(function (id) {
      return '<button type="button" class="vs-tag" data-tech="' + id + '">' + esc(TAG_LABEL[id] || byId[id].name) + " ▸</button>";
    }).join("");
    var wheel = car.wheel
      ? '<button type="button" class="vs-wheel color-shot" data-src="' + esc(src(car.wheel.id, "lg")) + '" data-name="' + esc(car.wheel.label + " (" + car.name + " 기본 휠)") + '">' +
        '<img src="' + esc(src(car.wheel.id, "sm")) + '" alt="' + esc(car.wheel.label) + '" loading="lazy" decoding="async"><span><em>기본 휠</em>' + esc(car.wheel.label) + "</span></button>"
      : "";
    return '<article class="vs-car ' + (side === "L" ? "left" : "right") + '">' +
      '<div class="vs-photo">' + photo + '<span class="vs-side">' + (side === "L" ? "왼쪽" : "오른쪽") + "</span>" + view + "</div>" +
      '<div class="vs-info"><h2>' + esc(car.name) + '</h2><p class="vs-sub">' + esc(car.sub) + "</p>" +
      '<dl class="vs-price"><div><dt>정상가격</dt><dd>' + esc(car.normal) + "</dd></div><div><dt>실구매가</dt><dd class=\"strong\">" + esc(car.buy) + "</dd></div></dl>" +
      (tags ? '<div class="vs-tags">' + tags + "</div>" : "") + wheel + "</div></article>";
  }
  function hero(cars) {
    return '<div class="vs-hero" id="vs-hero">' +
      '<div class="vs-hero-grid">' + carHtml(cars[0], "L") + '<div class="vs-vs" aria-hidden="true"><span>VS</span></div>' + carHtml(cars[1], "R") + "</div>" +
      '<p class="vs-foot">사진은 메르세데스-벤츠 공식 카탈로그와 색상 사진입니다. 화면의 색과 구성은 실제 차량과 다를 수 있습니다. 앞·뒤·실내 버튼과 휠 사진은 눌러서 크게 볼 수 있습니다.</p></div>';
  }

  /* ---------- 눈으로 보는 차이 ---------- */
  function diffSection(diffs, a, b) {
    var groups = [];
    var map = {};
    var rest = 0;
    (diffs || []).forEach(function (item) {
      if (!item.differ) return;
      var t = topicOfLabel(item.label);
      if (!t) { rest += 1; return; }
      if (!map[t.id]) { map[t.id] = { topic: t, items: [], score: 0 }; groups.push(map[t.id]); }
      map[t.id].items.push(item);
      var l = item.left === "●" ? 1 : 0;
      var r = item.right === "●" ? 1 : 0;
      if (l !== r) map[t.id].score += 2;
      else map[t.id].score += 1;
    });
    groups.sort(function (x, y) { return y.score - x.score || T.topics.indexOf(x.topic) - T.topics.indexOf(y.topic); });
    var shownGroups = groups.slice(0, 12);
    var matchedCount = 0;
    groups.forEach(function (g) { matchedCount += g.items.length; });
    var head = '<div class="vs-sec" id="vs-diff"><h3>눈으로 보는 차이</h3>';
    if (!shownGroups.length) {
      return head + '<p class="vs-lead">그림으로 풀어 볼 큰 사양 차이는 없습니다. 가격과 제원, 아래 옵션 표를 같이 보세요.</p></div>';
    }
    var cards = shownGroups.map(function (g) {
      var t = g.topic;
      var rows = g.items.slice(0, 4).map(function (it) {
        return '<div class="vs-row"><span class="vs-lbl">' + esc(it.label) + "</span>" + pill("L", it.left) + pill("R", it.right) + "</div>";
      }).join("");
      var more = g.items.length > 4 ? '<p class="vs-more-n">그 밖에 ' + (g.items.length - 4) + "개 항목이 더 다릅니다</p>" : "";
      return '<article class="vs-card"><button type="button" class="vs-card-img" data-tech="' + t.id + '" aria-label="' + esc(t.name) + ' 자세히 보기">' +
        '<img src="' + esc(src(t.imgs[0][0], "sm")) + '" alt="' + esc(t.imgs[0][1]) + '" loading="lazy" decoding="async"><span class="vs-zoom">눌러서 보기</span></button>' +
        '<div class="vs-card-body"><p class="vs-card-cat">' + esc(groupById[t.group].name) + "</p>" +
        '<h4>' + esc(t.name) + "</h4><p class=\"vs-card-line\">" + esc(t.line) + "</p>" +
        '<div class="vs-rows">' + rows + more + "</div>" +
        '<button type="button" class="vs-open" data-tech="' + t.id + '">벤츠의 기술 이야기 보기 ▸</button></div></article>';
    }).join("");
    var tail = rest
      ? '<p class="vs-tail">그림으로 풀지 않은 ' + rest + "개 항목은 아래 옵션 비교표에 있습니다.</p>"
      : "";
    return head +
      '<p class="vs-lead">두 차의 사양이 다른 부분 중, 그림으로 설명할 수 있는 것만 모았습니다. 카드를 누르면 쉬운 설명과 벤츠의 역사를 볼 수 있습니다. <b>기본 아님</b>은 어프로치북 기본 사양표에 적혀 있지 않다는 뜻이며, 없다는 확정이 아닙니다. 선택 옵션이나 다른 이름으로 들어갈 수 있어 상담에서 확인합니다.</p>' +
      '<div class="vs-grid">' + cards + "</div>" + tail + "</div>";
  }

  /* ---------- 차종별 트림 얼굴 · 실내 · 휠 · 실내 장식 ---------- */
  function modelSection(rows) {
    var list = rows || [];
    var infos = list.map(modelInfo);
    var models = [];
    infos.forEach(function (info) { if (info && models.indexOf(info.model) === -1) models.push(info.model); });
    if (!models.length) return "";
    return models.map(function (model, mi) {
      var mine = infos.filter(function (info) { return info && info.model === model; });
      var chosen = {};
      mine.forEach(function (info) { if (info.trim) chosen[info.trim.key] = true; });
      var ordered = model.trims.filter(function (t) { return chosen[t.key]; })
        .concat(model.trims.filter(function (t) { return !chosen[t.key]; }));
      var cards = ordered.map(function (t) {
        var views = t.front ? 1 : 0;
        return '<article class="vs-trim' + (chosen[t.key] ? " on" : "") + '">' +
          '<div class="vs-trim-photo"><img src="' + esc(src(t.front, "sm")) + '" data-front="' + esc(src(t.front, "sm")) + '"' +
          (t.rear ? ' data-rear="' + esc(src(t.rear, "sm")) + '"' : "") + (t.int ? ' data-int="' + esc(src(t.int, "sm")) + '"' : "") +
          ' alt="' + esc(model.label + " " + t.label) + '" loading="lazy" decoding="async">' +
          (views && (t.rear || t.int) ? viewButtons(!!t.rear, !!t.int) : "") +
          (chosen[t.key] ? '<span class="vs-here">지금 비교 중</span>' : "") + "</div>" +
          '<h4>' + esc(t.label) + "</h4><p>" + esc(t.note) + "</p></article>";
      }).join("");
      function gal(items) {
        return items.map(function (w) {
          var on = mine.some(function (info) { return isMine(w, info.row, info.trim); });
          return '<button type="button" class="vs-wheel-card color-shot' + (on ? " on" : "") + '" data-src="' + esc(src(w.id, "lg")) + '" data-name="' + esc(w.label + " · " + w.base) + '">' +
            '<img src="' + esc(src(w.id, "sm")) + '" alt="' + esc(w.label) + '" loading="lazy" decoding="async">' +
            (on ? '<i class="vs-mine">지금 비교 중인 차</i>' : "") +
            "<b>" + esc(w.label) + "</b><span>" + esc(w.base) + "</span></button>";
        }).join("");
      }
      var wheels = model.wheels.length
        ? '<h4 class="vs-sub-h">휠 한눈에 보기</h4><div class="vs-wheels">' + gal(model.wheels) + "</div>" : "";
      var mats = model.mats.length
        ? '<h4 class="vs-sub-h">실내 장식(트림) 한눈에 보기</h4><p class="vs-lead small">대시보드와 센터콘솔에 들어가는 우드·메탈 장식입니다. 사진을 누르면 크게 볼 수 있습니다.</p><div class="vs-wheels">' + gal(model.mats) + "</div>" : "";
      return '<div class="vs-sec" id="vs-trims' + (mi ? "-" + mi : "") + '"><h3>' + esc(model.label) + ' 트림별 얼굴 · 실내 · 휠</h3>' +
        '<p class="vs-lead">같은 ' + esc(model.label) + '도 트림마다 앞모습과 휠, 실내 장식이 다릅니다. 앞·뒤·실내 버튼으로 돌려 보고, 휠과 장식 사진을 누르면 크게 볼 수 있습니다.</p>' +
        '<div class="vs-trims n' + model.trims.length + '">' + cards + "</div>" + wheels + mats +
        '<p class="vs-tail">사진은 메르세데스-벤츠 코리아 공식 고객용 카탈로그(' + esc(model.source) + ') 기준입니다. 연식·생산 시점·옵션에 따라 실제 차량과 달라질 수 있어 계약 전에 확인합니다.</p></div>';
    }).join("");
  }
  function trimSection(rows) { return modelSection(rows); }

  /* ---------- 표 안의 작은 '이야기' 버튼 ---------- */
  function chip(label) {
    var t = topicOfLabel(label);
    if (!t) return "";
    return ' <button type="button" class="vs-chip" data-tech="' + t.id + '" aria-label="' + esc(label) + ' 기술 이야기">이야기 ▸</button>';
  }

  /* ---------- 하단: 기술 도서관 + 역사 ---------- */
  function history() {
    var cards = T.history.map(function (h, i) {
      return '<button type="button" class="vs-hist" data-hist="' + i + '"><span class="y">' + esc(h.year) + "</span><b>" + esc(h.title) + "</b><em>" + esc(h.line) + "</em></button>";
    }).join("");
    return '<p class="vs-kicker">벤츠의 자부심</p><h2>벤츠가 세상에 처음 보여준 것들</h2>' +
      '<p class="vs-lead">1886년 자동차가 태어난 때부터 지금까지, 벤츠는 안전과 편안함의 기준을 계속 앞서 만들어 왔습니다. 카드를 누르면 이야기가 열립니다.</p>' +
      '<div class="vs-time" tabindex="0" aria-label="벤츠 역사 연표">' + cards + "</div>";
  }
  function library() {
    var html = '<p class="vs-kicker">벤츠 기술 이야기</p><h2>눌러서 보는 벤츠의 기술</h2>' +
      '<p class="vs-lead">옵션 이름만 봐서는 무엇인지 알기 어렵습니다. 그림을 누르면 쉬운 설명과, 벤츠가 왜 이 기술에 자부심을 갖는지 볼 수 있습니다.</p>';
    T.groups.forEach(function (g) {
      var list = T.topics.filter(function (t) { return t.group === g.id; });
      if (!list.length) return;
      html += '<h3 class="vs-group">' + esc(g.name) + "</h3><p class=\"vs-group-sub\">" + esc(g.sub) + '</p><div class="vs-tgrid">' +
        list.map(function (t) {
          return '<button type="button" class="vs-tcard" data-tech="' + t.id + '"><span class="vs-timg"><img src="' + esc(src(t.imgs[0][0], "sm")) + '" alt="' + esc(t.imgs[0][1]) + '" loading="lazy" decoding="async"></span>' +
            '<span class="vs-tbody"><small>' + esc(t.en) + "</small><b>" + esc(t.name) + "</b><em>" + esc(t.line) + "</em></span></button>";
        }).join("") + "</div>";
    });
    return html;
  }

  /* ---------- 모달 ---------- */
  var modal, sheet, body, lastFocus = null;
  var current = { kind: "", key: "" };
  function ensureModal() {
    if (modal) return;
    modal = document.createElement("div");
    modal.className = "vs-modal";
    modal.id = "vs-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "vs-m-title");
    modal.innerHTML = '<div class="vs-sheet" tabindex="-1"><button type="button" class="vs-x" data-vs-close aria-label="닫기">닫기 ✕</button><div class="vs-body"></div></div>';
    document.body.appendChild(modal);
    sheet = modal.querySelector(".vs-sheet");
    body = modal.querySelector(".vs-body");
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-vs-close]")) close();
    });
  }
  function list(items, cls) {
    return '<ul class="' + cls + '">' + items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
  }
  function ask(name) {
    return "index.html?note=" + encodeURIComponent(name + " 상담") + "#consulting";
  }
  var ctxRows = [];
  function setRows(rows) { ctxRows = (rows || []).filter(Boolean); }
  function versusHtml(v) {
    if (!v) return "";
    var cols = v.cols.map(function (c) {
      var sides = [];
      ctxRows.forEach(function (row, i) {
        var name = cleanName(row);
        if ((c.tests || []).some(function (x) { return new RegExp(x).test(name); })) sides.push(i === 0 ? "왼쪽" : "오른쪽");
      });
      var badge = sides.length
        ? '<span class="vs-who">지금 비교 중 · ' + (sides.length > 1 ? "두 차 모두" : sides[0] + " 차") + "</span>"
        : "";
      var meter = "";
      if (c.meter) {
        var bar = function (label, band) {
          if (!c.meter.range) { var mid = (band[0] + band[1]) / 2; band = [mid - 3, mid + 3]; }
          return '<div class="vs-meter-row"><span>' + label + '</span><div class="vs-mtrack' + (c.meter.range ? " range" : "") + '"><i style="left:' + band[0] + "%;width:" + Math.max(band[1] - band[0], 4) + '%"></i></div></div>';
        };
        meter = '<div class="vs-meter"><div class="vs-mends"><em>부드러움</em><em>단단함</em></div>' +
          bar("잔잔한 노면", c.meter.small) + bar("큰 요철 · 빠른 주행", c.meter.big) + "</div>";
      }
      return '<article class="vs-vcol' + (sides.length ? " mine" : "") + '">' + badge +
        (c.img ? '<div class="vs-vimg"><img src="' + esc(src(c.img, "sm")) + '" alt="' + esc(c.cap || c.label) + '" loading="lazy" decoding="async">' + (c.cap ? "<small>" + esc(c.cap) + "</small>" : "") + "</div>" : "") +
        "<h4>" + esc(c.label) + '</h4><p class="vs-vsub">' + esc(c.sub) + "</p>" + meter +
        '<ul class="vs-vpoints">' + c.points.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></article>";
    }).join("");
    return '<section class="vs-versus"><p class="vs-k">차이점 한눈에 보기</p><h3>' + esc(v.title) + "</h3>" +
      (v.intro ? '<p class="vs-vintro">' + esc(v.intro) + "</p>" : "") +
      '<div class="vs-vcols n' + v.cols.length + '">' + cols + "</div>" +
      (v.meterNote ? '<p class="vs-vmeter-note">' + esc(v.meterNote) + "</p>" : "") +
      (v.summary ? '<p class="vs-vsum">' + esc(v.summary) + "</p>" : "") +
      (v.note ? '<p class="vs-note">' + esc(v.note) + "</p>" : "") + "</section>";
  }
  function topicBody(t) {
    var g = groupById[t.group];
    var idx = T.topics.indexOf(t);
    var prev = T.topics[(idx + T.topics.length - 1) % T.topics.length];
    var next = T.topics[(idx + 1) % T.topics.length];
    var gallery = '<div class="vs-gal"><div class="vs-gal-main"><img src="' + esc(src(t.imgs[0][0], "lg")) + '" alt="' + esc(t.imgs[0][1]) + '" decoding="async"></div>' +
      '<p class="vs-gal-cap">' + esc(t.imgs[0][1]) + "</p>" +
      (t.imgs.length > 1
        ? '<div class="vs-thumbs">' + t.imgs.map(function (im, i) {
            return '<button type="button" class="vs-thumb' + (i === 0 ? " on" : "") + '" data-img="' + esc(src(im[0], "lg")) + '" data-cap="' + esc(im[1]) + '" aria-label="' + esc(im[1]) + '"><img src="' + esc(src(im[0], "sm")) + '" alt="" loading="lazy"></button>';
          }).join("") + "</div>"
        : "") + "</div>";
    var related = T.history.map(function (h, i) { return { h: h, i: i }; }).filter(function (x) { return x.h.topic === t.id; });
    var relHtml = related.length
      ? '<div class="vs-rel"><span>관련 벤츠 역사</span>' + related.map(function (x) {
          return '<button type="button" data-hist="' + x.i + '">' + esc(x.h.year + " · " + x.h.title) + "</button>";
        }).join("") + "</div>"
      : "";
    var pride = t.pride
      ? '<section class="vs-pride">' + (t.pride.year ? '<span class="vs-year">' + esc(t.pride.year) + "</span>" : "") +
        '<p class="vs-pride-k">벤츠의 자부심</p><h3>' + esc(t.pride.head) + "</h3><p>" + esc(t.pride.body) + "</p></section>"
      : "";
    return gallery +
      '<div class="vs-text"><p class="vs-k">' + esc(g.name) + " · " + esc(t.en) + "</p>" +
      '<h2 id="vs-m-title">' + esc(t.name) + '</h2><p class="vs-m-lead">' + esc(t.line) + "</p>" +
      '<div class="vs-easy"><b>쉽게 말하면</b><p>' + esc(t.easy) + "</p></div>" +
      versusHtml(t.versus) +
      "<h3>무엇인가요</h3><p>" + esc(t.what) + "</p>" +
      "<h3>이렇게 좋습니다</h3>" + list(t.why, "vs-checks") +
      pride + relHtml +
      (t.facts && t.facts.length ? "<h3>공식 사양</h3>" + list(t.facts, "vs-facts") : "") +
      (t.where && t.where.length ? "<h3>어떤 차에 들어가나요</h3>" + list(t.where, "vs-facts") +
        '<p class="vs-note">공식 고객용 카탈로그(E-클래스 2026.04, S-클래스 2026.09 등) 기준입니다. 연식, 생산 시점, 옵션에 따라 달라질 수 있어 계약 전에 실제 차량으로 다시 확인합니다.</p>' : "") +
      (t.note ? '<p class="vs-note">' + esc(t.note) + "</p>" : "") +
      '<div class="vs-cta-row"><a class="vs-cta gold" href="' + ask(t.name) + '">이 기술, 전시장에서 직접 보기</a>' +
      '<a class="vs-cta kakao" href="https://open.kakao.com/o/skdA6cZc">카톡으로 물어보기</a></div>' +
      '<div class="vs-nav"><button type="button" data-tech="' + prev.id + '">◂ ' + esc(prev.name) + '</button><button type="button" data-tech="' + next.id + '">' + esc(next.name) + " ▸</button></div>" +
      "</div>";
  }
  function histBody(i) {
    var h = T.history[i];
    var prev = T.history[(i + T.history.length - 1) % T.history.length];
    var next = T.history[(i + 1) % T.history.length];
    var pi = (i + T.history.length - 1) % T.history.length;
    var ni = (i + 1) % T.history.length;
    var t = byId[h.topic];
    return '<div class="vs-text vs-hist-body"><p class="vs-k">벤츠가 처음 보여준 것들</p>' +
      '<p class="vs-bigyear">' + esc(h.year) + '</p><h2 id="vs-m-title">' + esc(h.title) + '</h2><p class="vs-m-lead">' + esc(h.line) + "</p>" +
      '<div class="vs-pride"><p class="vs-pride-k">이야기</p><p>' + esc(h.story) + "</p></div>" +
      (t ? '<div class="vs-cta-row"><button type="button" class="vs-cta gold" data-tech="' + t.id + '">관련 기술 자세히 보기 · ' + esc(t.name) + "</button></div>" : "") +
      '<div class="vs-nav"><button type="button" data-hist="' + pi + '">◂ ' + esc(prev.year + " " + prev.title) + '</button><button type="button" data-hist="' + ni + '">' + esc(next.year + " " + next.title) + " ▸</button></div></div>";
  }
  function open(kind, key) {
    ensureModal();
    if (modal.hidden) lastFocus = document.activeElement;
    current = { kind: kind, key: key };
    if (kind === "tech") {
      var t = byId[key];
      if (!t) return;
      body.innerHTML = topicBody(t);
    } else {
      body.innerHTML = histBody(Number(key));
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    sheet.scrollTop = 0;
    sheet.focus({ preventScroll: true });
  }
  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener("click", function (e) {
    var tech = e.target.closest("[data-tech]");
    if (tech) { e.preventDefault(); open("tech", tech.getAttribute("data-tech")); return; }
    var hist = e.target.closest("[data-hist]");
    if (hist) { e.preventDefault(); open("hist", hist.getAttribute("data-hist")); return; }
    var thumb = e.target.closest(".vs-thumb");
    if (thumb) {
      var main = modal.querySelector(".vs-gal-main img");
      main.src = thumb.getAttribute("data-img");
      modal.querySelector(".vs-gal-cap").textContent = thumb.getAttribute("data-cap");
      modal.querySelectorAll(".vs-thumb").forEach(function (b) { b.classList.toggle("on", b === thumb); });
      return;
    }
    var view = e.target.closest("[data-view]");
    if (view) {
      var box = view.closest(".vs-photo, .vs-trim-photo");
      var img = box && box.querySelector("img");
      if (!img) return;
      var want = view.getAttribute("data-view");
      var to = img.getAttribute("data-" + want);
      if (!to) return;
      img.src = to;
      box.querySelectorAll("[data-view]").forEach(function (b) { b.classList.toggle("on", b === view); });
    }
  });
  document.addEventListener("keydown", function (e) {
    if (!modal || modal.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      var step = e.key === "ArrowRight" ? 1 : -1;
      if (current.kind === "tech") {
        var idx = T.topics.findIndex(function (t) { return t.id === current.key; });
        open("tech", T.topics[(idx + step + T.topics.length) % T.topics.length].id);
      } else {
        open("hist", (Number(current.key) + step + T.history.length) % T.history.length);
      }
    }
  });

  function mount() {
    var h = document.getElementById("mb-history");
    var l = document.getElementById("tech-library");
    if (h) h.innerHTML = history();
    if (l) l.innerHTML = library();
  }

  window.BenzVisual = {
    hero: hero,
    diffSection: diffSection,
    trimSection: trimSection,
    modelSection: modelSection,
    modelInfo: modelInfo,
    setRows: setRows,
    chip: chip,
    tagsFor: tagsFor,
    eInfo: eInfo,
    src: src,
    open: open,
    close: close,
    mount: mount
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
