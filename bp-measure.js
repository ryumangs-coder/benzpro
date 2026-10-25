/* 벤츠프로 메인 사이트 측정(GA4) 공통 모듈
 *
 * - 측정 ID와 환경 설정은 아래 CONFIG 한 곳에서만 관리합니다.
 * - 모든 공개 페이지 <head>에서 이 파일 하나만 불러옵니다. gtag.js는 비동기로 불러와 화면 표시를 막지 않습니다.
 * - 운영 도메인(benzpro.co.kr)에서만 실제로 전송합니다. 로컬·테스트 주소는 아래 "테스트 모드"를 직접 켠 경우에만 동작합니다.
 * - 자동 page_view는 끄고(send_page_view:false), 정리된 주소로 page_view를 직접 한 번만 보냅니다.
 * - 모든 이벤트 값은 허용 목록(PARAM_RULES)의 짧은 코드값만 통과합니다. 자유 입력, 이름, 전화번호, 이메일은 구조상 들어갈 수 없습니다.
 * - 이 파일이 막히거나 실패해도 사이트 기능은 그대로 동작하도록, 페이지 쪽은 항상 window.BenzTrack 존재를 확인하고 호출합니다.
 *
 * 테스트 모드(브라우저 콘솔에서 직접 설정, 운영 방문자에게는 영향 없음)
 *   localStorage.setItem("benzpro-ga-test", "dry")    // 전송 없이 window.dataLayer·window.__bpEvents에만 기록
 *   localStorage.setItem("benzpro-ga-test", "debug")  // 실제 GA4로 debug_mode 전송(DebugView 확인용)
 *   localStorage.removeItem("benzpro-ga-test")        // 해제
 *
 * 이벤트 값의 의미
 *   quote_price_man : 견적 화면에 표시된 "할인 적용 예상 차량가", 만원 단위 정수. 취득세·등록비·보험료·금융 이자 제외.
 *                     실제 계약 금액이나 매출이 아니므로 value/currency 파라미터로 보내지 않습니다.
 *   contact_click   : 카카오톡·전화 "버튼을 누른 것"입니다. 메시지 전송이나 통화 연결 완료가 아닙니다.
 *   generate_lead   : 접수 서버가 정상 접수를 확인해 준 응답을 받았을 때만 보냅니다(현재 접수 방식은 아래 formResult 참고).
 */
(function () {
  "use strict";
  if (window.BenzTrack) return;

  var CONFIG = {
    measurementId: "G-89BETKX5NY",
    productionHosts: ["benzpro.co.kr", "www.benzpro.co.kr"],
    cookieDomain: "benzpro.co.kr",
    siteType: "main",
    testFlagKey: "benzpro-ga-test",
    /* 방문 동의 배너가 생기면 true로 바꾸고 BenzTrack.setConsent(true|false)를 연결합니다. 지금은 사이트에 분석 동의 화면이 없습니다. */
    requireAnalyticsConsent: false
  };

  /* ---------- 환경 판단 ---------- */
  var PLACEHOLDER = /^G-(X+|0+|1234567890|XXXXXXXXXX)$/i;
  var idOk = /^G-[A-Z0-9]{8,12}$/.test(CONFIG.measurementId) && !PLACEHOLDER.test(CONFIG.measurementId);
  var host = String(location.hostname || "").toLowerCase();
  var isProd = CONFIG.productionHosts.indexOf(host) !== -1;
  var testFlag = "";
  try { testFlag = window.localStorage.getItem(CONFIG.testFlagKey) || ""; } catch (err) { testFlag = ""; }
  var mode = "off";
  if (idOk) {
    if (isProd) mode = "live";
    else if (testFlag === "dry" || testFlag === "debug") mode = testFlag;
  }

  /* ---------- 주소·페이지 정리 ---------- */
  var KEEP_QUERY = {
    utm_source: 1, utm_medium: 1, utm_campaign: 1, utm_term: 1, utm_content: 1, utm_id: 1,
    utm_source_platform: 1, utm_creative_format: 1, utm_marketing_tactic: 1,
    gclid: 1, gbraid: 1, wbraid: 1, dclid: 1
  };
  var PERSONAL = /@|01[016789][-\s.]?\d{3,4}[-\s.]?\d{4}/;

  function cleanPath(path) {
    var p = String(path || "/").replace(/\/index(\.html)?$/i, "/").replace(/\.html$/i, "");
    return p || "/";
  }
  /* 유입 분석에 필요한 UTM·광고 클릭 값만 남기고, 선택 차종·혜택 같은 모든 쿼리와 해시는 지웁니다. */
  function cleanLocation(href) {
    try {
      var u = new URL(href || location.href, location.href);
      var keep = [];
      u.searchParams.forEach(function (value, key) {
        var k = key.toLowerCase();
        if (KEEP_QUERY[k] && value && value.length <= 120 && !PERSONAL.test(value)) keep.push(k + "=" + encodeURIComponent(value));
      });
      return u.origin + cleanPath(u.pathname) + (keep.length ? "?" + keep.join("&") : "");
    } catch (err) {
      return location.origin + "/";
    }
  }
  function sameSite(h) {
    h = String(h || "").toLowerCase();
    return h === "benzpro.co.kr" || /\.benzpro\.co\.kr$/.test(h);
  }
  /* 같은 사이트에서 왔으면 정리된 경로까지, 외부에서 왔으면 도메인까지만 보냅니다. */
  function cleanReferrer() {
    try {
      if (!document.referrer) return "";
      var u = new URL(document.referrer);
      if (sameSite(u.hostname)) return u.origin + cleanPath(u.pathname);
      return u.origin + "/";
    } catch (err) {
      return "";
    }
  }

  var PAGE_TYPES = {
    "": "home", index: "home", prices: "price", quote: "quote", models: "comparison",
    preorder: "reservation", benefit: "benefits", mou: "benefits", cards: "benefits",
    golden: "benefits", welcome: "benefits", promotion: "promotion", fleet: "corporate",
    rental: "rental", care: "service", tire: "service", warranty: "warranty"
  };
  function slugOf(pathname) {
    return cleanPath(pathname).replace(/^\//, "").replace(/\/$/, "");
  }
  var pageSlug = slugOf(location.pathname);
  var pageType = PAGE_TYPES[pageSlug] || "other";

  /* ---------- 값 정리(허용 목록) ---------- */
  var CODE = /^[a-z0-9][a-z0-9_.\-]{0,59}$/i;
  var PARAM_RULES = {
    site_type: "code", page_type: "code", placement: "code",
    vehicle_series: "code", model_id: "code", model_year: "code", purchase_method: "code",
    benefit_type: "code", action: "code", contact_method: "code", form_id: "code",
    target_page: "code", reservation_target: "code", delivery_status: "code", view_trigger: "code",
    compare_model_id: "code", compare_model_year: "code", compare_series: "code",
    compare_count: "int", quote_price_man: "int", benefit_count: "int"
  };
  function scrub(params) {
    var out = {};
    Object.keys(params || {}).forEach(function (key) {
      var rule = PARAM_RULES[key];
      var value = params[key];
      if (!rule || value === undefined || value === null || value === "") return;
      if (rule === "int") {
        value = Number(value);
        if (isFinite(value) && value >= 0 && value < 1e9) out[key] = Math.round(value);
      } else if (rule === "code") {
        value = String(value);
        if (CODE.test(value) && !PERSONAL.test(value)) out[key] = value;
      }
    });
    return out;
  }

  /* ---------- 차량·구매 방식 값 매핑(기존 데이터 기준) ---------- */
  var SERIES = { Compact: "compact", C: "c_class", E: "e_class", S: "s_class", Dream: "coupe_cabrio", SUV: "suv", EQ: "electric" };
  function slug(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/é/g, "e")
      .replace(/\+/g, "_plus")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }
  /* row: 가격 데이터 한 줄 {seg, my, name} */
  function vehicleOf(row) {
    if (!row || !row.name) return {};
    return { vehicle_series: SERIES[row.seg] || undefined, model_id: slug(row.name), model_year: row.my };
  }
  var PAYS = { cash: "cash", install: "install", care: "care", lease: "lease" };
  var BENEFITS = {
    retain: "retain", trade: "trade_in", conquest: "conquest", mou: "mou",
    repair: "repair_history", mile: "arrival_mileage", showcar: "showcar", early: "early_customs"
  };
  var PREORDER_TARGETS = {
    "V클래스": "v_class", "일렉트릭 GLC": "glc_electric", "신형 CLA": "cla_new",
    "신형 GLB": "glb_new", "신형 GLE": "gle_new", "신형 GLS": "gls_new", "S클래스": "s_class",
    vclass: "v_class", glc: "glc_electric", sclass: "s_class"
  };

  function cleanTitle(title) {
    title = String(title || "");
    if (!title || PERSONAL.test(title)) return "벤츠프로";
    return title.slice(0, 120);
  }

  /* ---------- 전송 ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  window.__bpEvents = window.__bpEvents || [];

  /* 설정(config)과 첫 page_view가 먼저 나간 뒤 이벤트가 이어지도록, 준비 전 이벤트는 잠시 줄 세웁니다. */
  var ready = false;
  var waiting = [];
  function send(name, params, opts) {
    if (mode === "off") return;
    if (!ready) {
      waiting.push([name, params, opts]);
      return;
    }
    deliver(name, params, opts);
  }
  function deliver(name, params, opts) {
    try {
      if (mode === "off") return;
      var clean = scrub(params);
      if (pageType) clean.page_type = pageType;
      clean.site_type = CONFIG.siteType;
      var extra = {};
      if (opts && opts.beacon) extra.transport_type = "beacon";
      if (mode === "dry") window.__bpEvents.push({ name: name, params: clean });
      if (mode === "debug" && window.console && console.debug) console.debug("[benzpro-ga]", name, clean);
      var payload = {};
      Object.keys(clean).forEach(function (k) { payload[k] = clean[k]; });
      Object.keys(extra).forEach(function (k) { payload[k] = extra[k]; });
      gtag("event", name, payload);
    } catch (err) { /* 측정 실패가 사이트 기능에 영향을 주지 않도록 무시합니다. */ }
  }

  /* 같은 값이 연달아 들어오면 한 번만 보냅니다. */
  var lastKey = {};
  function sendOnce(slot, key, name, params, opts) {
    if (lastKey[slot] === key) return false;
    lastKey[slot] = key;
    send(name, params, opts);
    return true;
  }

  function init() {
    if (mode === "off") return;
    try {
      var consent = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
      if (CONFIG.requireAnalyticsConsent) consent.analytics_storage = "denied";
      gtag("consent", "default", consent);
      gtag("js", new Date());
      var loc = cleanLocation(location.href);
      var ref = cleanReferrer();
      var title = cleanTitle(document.title);
      var path = cleanPath(location.pathname);
      /* set: 이후 모든 이벤트(자동 수집 포함)가 정리된 주소를 쓰도록 합니다. 전송 전에 적용되므로 원본 주소는 나가지 않습니다. */
      var base = { page_location: loc, page_title: title, page_path: path };
      if (ref) base.page_referrer = ref;
      gtag("set", base);
      var config = {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_domain: isProd ? CONFIG.cookieDomain : "auto",
        page_location: loc,
        page_path: path,
        page_title: title,
        site_type: CONFIG.siteType,
        page_type: pageType
      };
      if (ref) config.page_referrer = ref;
      if (mode === "debug") config.debug_mode = true;
      gtag("config", CONFIG.measurementId, config);
      if (!window.__bpPageViewSent) {
        window.__bpPageViewSent = true;
        var pv = { page_location: loc, page_path: path, page_title: title };
        if (ref) pv.page_referrer = ref;
        pv.page_type = pageType;
        pv.site_type = CONFIG.siteType;
        if (mode === "dry") window.__bpEvents.push({ name: "page_view", params: pv });
        gtag("event", "page_view", pv);
      }
      if (mode !== "dry") {
        var tag = document.createElement("script");
        tag.async = true;
        tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(CONFIG.measurementId);
        (document.head || document.documentElement).appendChild(tag);
      }
    } catch (err) { /* 무시 */ }
  }

  /* ---------- 위치 구분 ---------- */
  var SECTION_PLACEMENT = {
    e200: "e200_cards", calc: "calculator", trim: "trim_compare", models: "model_cards",
    benefits: "benefits_section", preorder: "preorder_section", after: "guides"
  };
  function placementOf(el) {
    try {
      if (el.closest(".bp-dock")) return "floating";
      if (el.closest("#bp-drawer")) return "menu";
      if (el.closest("#bp-head")) return "header";
      if (el.closest("#cta, .fixed.bottom-0")) return "bottom_bar";
      if (el.closest("footer, .site-legal, .bp-operator")) return "footer";
      if (el.closest("#consulting, .hp-consult, form")) return "contact_section";
      if (el.closest("#sheet")) return "quote_result";
      if (el.closest("#top.hp-hero")) return "hero";
      var section = el.closest("section[id]");
      if (section && SECTION_PLACEMENT[section.id]) return SECTION_PLACEMENT[section.id];
    } catch (err) { /* 무시 */ }
    return "content";
  }

  /* ---------- 링크 클릭: 문의·사전예약·혜택 상세 ---------- */
  function benefitTypeOf(slugName, hash) {
    if (slugName === "prices" && hash === "#paycard") return "card";
    return { benefit: "benefit_overview", mou: "mou", fleet: "corporate", cards: "card", golden: "golden_time", welcome: "welcome_gift" }[slugName] || "";
  }
  var lastClick = { key: "", at: 0 };
  function onLinkClick(event) {
    try {
      var el = event.target && event.target.closest ? event.target.closest("a[href]") : null;
      if (!el) return;
      var href = el.getAttribute("href") || "";
      var place = placementOf(el);
      var now = Date.now();
      var name = "";
      var params = { placement: place };
      var key = "";

      if (/^tel:/i.test(href)) {
        name = "contact_click";
        params.contact_method = "phone";
      } else if (/^https?:\/\/open\.kakao\.com\//i.test(href)) {
        name = "contact_click";
        params.contact_method = "kakao";
      } else {
        var u = new URL(el.href, location.href);
        var internal = u.hostname === location.hostname || sameSite(u.hostname);
        var target = internal ? slugOf(u.pathname) : "";
        var pick = el.getAttribute("data-pick");
        if (pick && PREORDER_TARGETS[pick]) {
          name = "reservation_click";
          params.reservation_target = PREORDER_TARGETS[pick];
        } else if (internal && target === "preorder" && pageSlug !== "preorder" && !el.hasAttribute("data-pick")) {
          name = "reservation_click";
          var hashKey = String(u.hash || "").replace("#", "");
          if (PREORDER_TARGETS[hashKey]) params.reservation_target = PREORDER_TARGETS[hashKey];
        } else if (internal) {
          var type = benefitTypeOf(target, u.hash);
          if (type) {
            name = "benefit_detail_click";
            params.benefit_type = type;
          }
        }
      }
      if (!name) return;
      key = name + "|" + (params.contact_method || params.reservation_target || params.benefit_type || "") + "|" + place;
      if (lastClick.key === key && now - lastClick.at < 600) return;
      lastClick.key = key;
      lastClick.at = now;
      send(name, params, { beacon: true });
    } catch (err) { /* 링크 이동은 항상 그대로 진행합니다. */ }
  }

  /* ---------- 상담 폼 시작 ---------- */
  function formIdOf(form) {
    if (!form) return "";
    if (form.querySelector("#consult-submit")) return "home_consult";
    if (form.id === "lead") return "quote_consult";
    if (form.id === "preorder-form") return "preorder_request";
    return "";
  }
  var started = {};
  var lastForm = {};
  function isUserEvent(event) {
    return !!(event && (event.isTrusted || (event.target && event.target.__bpUser)));
  }
  function onFormInput(event) {
    try {
      if (!isUserEvent(event)) return;
      var form = event.target && event.target.closest ? event.target.closest("form") : null;
      var id = formIdOf(form);
      if (!id || started[id]) return;
      started[id] = true;
      send("consultation_start", { form_id: id, placement: placementOf(form) });
    } catch (err) { /* 무시 */ }
  }

  document.addEventListener("click", onLinkClick, true);
  document.addEventListener("input", onFormInput, true);
  document.addEventListener("change", onFormInput, true);

  /* ---------- 페이지에서 쓰는 공개 함수 ---------- */
  window.BenzTrack = {
    mode: mode,
    pageType: pageType,
    isUser: isUserEvent,
    setConsent: function (granted) {
      try { gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" }); } catch (err) { /* 무시 */ }
    },
    /* 사용자가 관심 차종·연식을 실제로 바꿨을 때 */
    vehicleSelect: function (row, placement, extra) {
      var p = vehicleOf(row);
      if (extra) Object.keys(extra).forEach(function (k) { if (p[k] === undefined) p[k] = extra[k]; });
      p.placement = placement;
      sendOnce("vehicle|" + placement, (p.model_id || "") + "|" + (p.vehicle_series || "") + "|" + (p.model_year || ""), "vehicle_select", p);
    },
    purchaseMethodSelect: function (pay, placement, row) {
      if (!PAYS[pay]) return;
      var p = vehicleOf(row);
      p.purchase_method = PAYS[pay];
      p.placement = placement;
      sendOnce("pay|" + placement, pay + "|" + (p.model_id || ""), "purchase_method_select", p);
    },
    benefitSelect: function (key, applied, placement, row, pay) {
      if (!BENEFITS[key]) return;
      var p = vehicleOf(row);
      p.benefit_type = BENEFITS[key];
      p.action = applied ? "apply" : "remove";
      p.placement = placement;
      if (PAYS[pay]) p.purchase_method = PAYS[pay];
      send("benefit_select", p);
    },
    /* 유효한 견적 결과가 실제로 표시됐을 때. flags: 적용 중인 혜택 키 배열 */
    quoteView: function (row, pay, flags, afterWon, placement, trigger) {
      if (!row || !row.name || !isFinite(afterWon) || afterWon <= 0) return;
      var on = (flags || []).filter(function (k) { return BENEFITS[k]; }).sort();
      var p = vehicleOf(row);
      if (PAYS[pay]) p.purchase_method = PAYS[pay];
      p.placement = placement;
      p.quote_price_man = Math.round(afterWon / 10000);
      p.benefit_count = on.length;
      if (trigger) p.view_trigger = trigger;
      sendOnce("quote|" + placement, [row.my, row.name, pay, on.join(","), p.quote_price_man].join("|"), "quote_view", p);
    },
    comparisonView: function (a, b, placement, trigger) {
      if (!a || !b) return;
      var pa = vehicleOf(a);
      var pb = vehicleOf(b);
      var same = a.name === b.name && a.my === b.my;
      var ids = [pa.model_id + "|" + a.my, pb.model_id + "|" + b.my].sort();
      var p = {
        placement: placement,
        compare_count: same ? 1 : 2,
        vehicle_series: pa.vehicle_series,
        model_id: pa.model_id,
        model_year: pa.model_year,
        compare_series: pb.vehicle_series,
        compare_model_id: pb.model_id,
        compare_model_year: pb.model_year,
        view_trigger: trigger
      };
      sendOnce("compare|" + placement, ids.join("~"), "comparison_view", p);
    },
    vehicleParams: function (row, pay) {
      var p = vehicleOf(row);
      if (PAYS[pay]) p.purchase_method = PAYS[pay];
      return p;
    },
    reservationTarget: function (label) {
      return PREORDER_TARGETS[label] || "";
    },
    /* 상담 폼 요청 결과. res는 fetch 응답.
       generate_lead  : 서버가 정상 접수를 확인해 준 응답일 때만 보냅니다(응답을 읽을 수 있고 ok일 때).
       consultation_submit : 요청이 네트워크로는 전달됐지만 서버의 접수 확인은 받지 못한 경우입니다.
                             현재 접수 주소는 no-cors로 호출해 응답 내용을 읽을 수 없으므로 이 경우에 해당하며, 리드로 집계하지 않습니다. */
    formResult: function (formId, res, ctx) {
      try {
        var confirmed = !!(res && res.type !== "opaque" && res.type !== "opaqueredirect" && res.ok === true);
        var p = {};
        if (ctx) Object.keys(ctx).forEach(function (k) { p[k] = ctx[k]; });
        p.form_id = formId;
        var now = Date.now();
        if (lastForm[formId] && now - lastForm[formId] < 3000) return;
        lastForm[formId] = now;
        if (confirmed) send("generate_lead", p);
        else {
          p.delivery_status = "unconfirmed";
          send("consultation_submit", p);
        }
        started[formId] = false;
      } catch (err) { /* 무시 */ }
    }
  };

  /* <title>이 읽힌 뒤에 시작해야 page_title이 정확합니다. 제목이 이미 있으면 바로 시작합니다. */
  function start() {
    if (ready) return;
    init();
    ready = true;
    var queue = waiting.splice(0, waiting.length);
    queue.forEach(function (item) { deliver(item[0], item[1], item[2]); });
  }
  if (document.title || document.readyState !== "loading") start();
  else document.addEventListener("DOMContentLoaded", start);
})();
