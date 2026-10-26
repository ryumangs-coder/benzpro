/* 벤츠프로 메인 사이트 측정(GA4) 공통 모듈
 *
 * - 측정 ID와 환경 설정은 아래 CONFIG 한 곳에서만 관리합니다.
 * - 모든 공개 페이지 <head>에서 이 파일 하나만 불러옵니다. gtag.js는 비동기로 불러와 화면 표시를 막지 않습니다.
 * - 운영 도메인(benzpro.co.kr)에서만 실제로 전송합니다. 로컬·테스트 주소는 아래 "테스트 모드"를 직접 켠 경우에만 동작합니다.
 * - 자동 page_view는 끄고(send_page_view:false), 정리된 주소로 page_view를 직접 한 번만 보냅니다.
 * - 모든 이벤트 값은 허용 목록(PARAM_RULES)의 짧은 코드값만 통과합니다. 자유 입력, 이름, 전화번호, 이메일은 구조상 들어갈 수 없습니다.
 * - 이 파일이 막히거나 실패해도 사이트 기능은 그대로 동작하도록, 페이지 쪽은 항상 window.BenzTrack 존재를 확인하고 호출합니다.
 *
 * 테스트 모드(브라우저 콘솔에서 직접 설정, 다른 방문자에게는 영향 없음)
 *   localStorage.setItem("benzpro-ga-test", "dry")      // 전송 없이 window.__bpEvents에만 기록(로컬·운영 모두)
 *   localStorage.setItem("benzpro-ga-test", "debug")    // 실제 GA4로 debug_mode 전송(DebugView 확인용). 내부 트래픽으로도 표시됩니다.
 *   localStorage.setItem("benzpro-ga-internal", "1")    // 운영자·개발자 브라우저 표시(traffic_type=internal). 내부 트래픽 필터용
 *   localStorage.removeItem(...)                        // 해제
 *
 * 이벤트 값의 의미
 *   quote_price_man : 견적 화면에 표시된 "할인 적용 예상 차량가", 만원 단위 정수. 취득세·등록비·보험료·금융 이자 제외.
 *                     실제 계약 금액이나 매출이 아니므로 value/currency 파라미터로 보내지 않습니다.
 *   contact_click   : 카카오톡·전화 "버튼을 누른 것"입니다. 메시지 전송이나 통화 연결 완료가 아닙니다.
 *   consultation_submit : 필수 입력 검사를 통과하고 접수 요청을 "시작"한 것입니다. 접수 성공이 아닙니다.
 *   generate_lead   : 접수 서버가 응답 본문 {"ok":true}로 접수를 확인해 준 경우에만 보냅니다.
 *                     지금 접수 주소(Apps Script)는 no-cors로 호출해 응답을 읽을 수 없으므로, 현재는 보내지지 않습니다(미측정).
 */
(function () {
  "use strict";
  if (window.BenzTrack) return;

  var CONFIG = {
    measurementId: "G-89BETKX5NY",
    productionHosts: ["benzpro.co.kr", "www.benzpro.co.kr"],
    cookieDomain: "benzpro.co.kr",
    siteType: "main",
    /* 화면·문구·버튼을 바꿔 배포할 때 사람이 직접 올립니다(예: 2026-11-03a). 방문마다 바뀌는 값이 아닙니다. */
    uiVersion: "2026-10-27a",
    testFlagKey: "benzpro-ga-test",
    internalFlagKey: "benzpro-ga-internal",
    /* 방문 동의 배너가 생기면 true로 바꾸고 BenzTrack.setConsent(true|false)를 연결합니다. 지금은 사이트에 분석 동의 화면이 없습니다. */
    requireAnalyticsConsent: false
  };

  /* ---------- 환경 판단 ---------- */
  var PLACEHOLDER = /^G-(X+|0+|1234567890|XXXXXXXXXX)$/i;
  var idOk = /^G-[A-Z0-9]{8,12}$/.test(CONFIG.measurementId) && !PLACEHOLDER.test(CONFIG.measurementId);
  var host = String(location.hostname || "").toLowerCase();
  var isProd = CONFIG.productionHosts.indexOf(host) !== -1;
  var testFlag = "";
  var internalFlag = false;
  try {
    testFlag = window.localStorage.getItem(CONFIG.testFlagKey) || "";
    internalFlag = window.localStorage.getItem(CONFIG.internalFlagKey) === "1";
  } catch (err) { testFlag = ""; }
  var mode = "off";
  if (idOk) {
    if (testFlag === "dry" || testFlag === "debug") mode = testFlag;
    else if (isProd) mode = "live";
  }
  var internal = internalFlag || mode === "debug";

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
  /* 유입 분석에 필요한 UTM·광고 클릭 값만 남기고, 선택 차종·혜택·검색어 같은 모든 쿼리와 해시는 지웁니다. */
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
    site_type: "code", page_type: "code", placement: "code", cta_id: "code", ui_version: "code",
    vehicle_series: "code", model_id: "code", model_year: "code", purchase_method: "code",
    benefit_type: "code", action: "code", contact_method: "code", form_id: "code",
    reservation_target: "code", view_trigger: "code",
    compare_model_id: "code", compare_model_year: "code", compare_series: "code",
    error_type: "code", error_fields: "code",
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

  /* ---------- 차량·구매 방식·혜택 값 매핑(기존 데이터 기준) ---------- */
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
  /* 견적에서 켜고 끄는 혜택 */
  var BENEFITS = {
    retain: "retain", trade: "trade_in", conquest: "conquest", mou: "mou",
    repair: "repair_history", mile: "arrival_mileage", showcar: "showcar", early: "early_customs"
  };
  /* 혜택 안내 콘텐츠. 단독 페이지와 할인·가격 페이지 안의 같은 내용에 같은 값을 씁니다. */
  var BENEFIT_PAGES = {
    benefit: "benefit_overview", mou: "mou", cards: "card", golden: "golden_time", welcome: "welcome_gift",
    fleet: "corporate", rental: "rental", care: "new_car_exchange", tire: "tire_care", warranty: "warranty_extension"
  };
  var PRICE_PANELS = {
    owned: "retain", "benefit-slot": "benefit_overview", company: "mou", "fleet-slot": "corporate",
    "rental-slot": "rental", support: "finance_support", "care-slot": "new_car_exchange", "tire-slot": "tire_care",
    warranty: "warranty_extension", welcome: "welcome_gift", "golden-slot": "golden_time", paycard: "card"
  };
  var PRICE_HASH = {
    owned: "retain", company: "mou", support: "finance_support", "care-card": "new_car_exchange",
    "tire-card": "tire_care", warranty: "warranty_extension", welcome: "welcome_gift", paycard: "card"
  };
  var PREORDER_TARGETS = {
    "V클래스": "v_class", "일렉트릭 GLC": "glc_electric", "신형 CLA": "cla_new",
    "신형 GLB": "glb_new", "신형 GLE": "gle_new", "신형 GLS": "gls_new", "S클래스": "s_class",
    vclass: "v_class", glc: "glc_electric", sclass: "s_class"
  };
  var FORMS = { "consult-form": "home_consult", lead: "quote_consult", "preorder-form": "preorder_request" };
  var ERROR_TYPES = { validation: 1, network: 1, server: 1, timeout: 1 };
  var ERROR_FIELDS = { vehicle: 1, name: 1, phone: 1, email: 1, consent: 1 };

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
      clean.ui_version = CONFIG.uiVersion;
      if (mode === "dry") {
        window.__bpEvents.push({ name: name, params: clean });
        return;
      }
      if (mode === "debug" && window.console && console.debug) console.debug("[benzpro-ga]", name, clean);
      var payload = {};
      Object.keys(clean).forEach(function (k) { payload[k] = clean[k]; });
      if (opts && opts.beacon) payload.transport_type = "beacon";
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
      if (internal) base.traffic_type = "internal";
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
      if (internal) config.traffic_type = "internal";
      if (mode === "debug") config.debug_mode = true;
      if (mode !== "dry") gtag("config", CONFIG.measurementId, config);
      if (!window.__bpPageViewSent) {
        window.__bpPageViewSent = true;
        var pv = { page_location: loc, page_path: path, page_title: title, page_type: pageType, site_type: CONFIG.siteType, ui_version: CONFIG.uiVersion };
        if (ref) pv.page_referrer = ref;
        if (internal) pv.traffic_type = "internal";
        if (mode === "dry") window.__bpEvents.push({ name: "page_view", params: pv });
        else gtag("event", "page_view", pv);
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
      if (el.closest("aside")) return "side_menu";
      var section = el.closest("section[id]");
      if (section && SECTION_PLACEMENT[section.id]) return SECTION_PLACEMENT[section.id];
    } catch (err) { /* 무시 */ }
    return "content";
  }
  /* 버튼 ID: 노출(cta_view)과 클릭(contact_click·consultation_submit)이 같은 값을 씁니다.
     data-cta가 있으면 그 값을, 없으면 "위치_목적"으로 만듭니다. 화면 문구가 바뀌어도 값은 그대로입니다. */
  var CTA_FIXED = [
    ["#consult-submit", "home_consult_submit"],
    ["#lead #send", "quote_consult_submit"],
    ["#preorder-form [type=submit]", "preorder_submit"]
  ];
  function ctaIdOf(el, placement, purpose) {
    try {
      var own = el.getAttribute("data-cta");
      if (own && CODE.test(own)) return own;
      for (var i = 0; i < CTA_FIXED.length; i++) {
        if (el.matches(CTA_FIXED[i][0])) return CTA_FIXED[i][1];
      }
    } catch (err) { /* 무시 */ }
    return (placement || "content") + "_" + purpose;
  }

  /* ---------- 링크 클릭: 문의·사전예약·혜택 상세 ---------- */
  function benefitTypeOf(slugName, hash) {
    var h = String(hash || "").replace("#", "");
    if (slugName === "prices" && PRICE_HASH[h]) return PRICE_HASH[h];
    return BENEFIT_PAGES[slugName] || "";
  }
  /* 카카오톡 상담: 내부 /chat(호스팅 302)과 예전 오픈채팅 주소를 같은 클릭으로 봅니다.
     /chat은 HTML 없이 바로 넘어가므로 그쪽에서 page_view나 이벤트가 따로 생기지 않습니다. */
  function isKakaoConsult(href) {
    if (!href) return false;
    if (/^https?:\/\/(open|pf)\.kakao\.com\//i.test(href)) return true;
    try {
      var u = new URL(href, location.href);
      var path = (u.pathname || "").replace(/\/+$/, "") || "/";
      if (path !== "/chat") return false;
      return u.hostname === location.hostname || sameSite(u.hostname);
    } catch (err) {
      return /(?:^|\/)chat\/?$/.test(href);
    }
  }
  function contactMethodOf(el) {
    var href = el.getAttribute("href") || "";
    if (/^tel:/i.test(href)) return "phone";
    if (isKakaoConsult(href)) return "kakao";
    return "";
  }
  /* 지금 화면에서 고른 차종·구매 방식. 견적 화면 등 한 대가 분명할 때만 페이지가 등록합니다. */
  var contextFn = null;
  function currentContext() {
    try {
      var c = contextFn ? contextFn() : null;
      if (!c || !c.row) return {};
      var p = vehicleOf(c.row);
      if (PAYS[c.pay]) p.purchase_method = PAYS[c.pay];
      return p;
    } catch (err) { return {}; }
  }
  var lastClick = { key: "", at: 0 };
  function onLinkClick(event) {
    try {
      var el = event.target && event.target.closest ? event.target.closest("a[href], [data-pick]") : null;
      if (!el) return;
      var place = placementOf(el);
      var now = Date.now();
      var name = "";
      var params = { placement: place };
      var method = el.hasAttribute("href") ? contactMethodOf(el) : "";
      var pickOnly = !el.hasAttribute("href");

      if (pickOnly) {
        var target0 = PREORDER_TARGETS[el.getAttribute("data-pick")];
        if (target0) {
          name = "reservation_click";
          params.reservation_target = target0;
          params.cta_id = ctaIdOf(el, place, "reservation");
        }
      } else if (method) {
        name = "contact_click";
        params.contact_method = method;
        params.cta_id = ctaIdOf(el, place, method);
        var ctx = currentContext();
        Object.keys(ctx).forEach(function (k) { params[k] = ctx[k]; });
      } else {
        var u = new URL(el.href, location.href);
        var internalLink = u.hostname === location.hostname || sameSite(u.hostname);
        var target = internalLink ? slugOf(u.pathname) : "";
        var pick = el.getAttribute("data-pick");
        if (pick && PREORDER_TARGETS[pick]) {
          name = "reservation_click";
          params.reservation_target = PREORDER_TARGETS[pick];
          params.cta_id = ctaIdOf(el, place, "reservation");
        } else if (internalLink && target === "preorder" && pageSlug !== "preorder" && !el.hasAttribute("data-pick")) {
          name = "reservation_click";
          var hashKey = String(u.hash || "").replace("#", "");
          if (PREORDER_TARGETS[hashKey]) params.reservation_target = PREORDER_TARGETS[hashKey];
          params.cta_id = ctaIdOf(el, place, "reservation");
        } else if (internalLink) {
          var type = benefitTypeOf(target, u.hash);
          if (type) {
            name = "benefit_detail_click";
            params.benefit_type = type;
          }
        }
      }
      if (!name) return;
      var key = name + "|" + (params.cta_id || params.benefit_type || "") + "|" + (params.reservation_target || "");
      if (lastClick.key === key && now - lastClick.at < 800) return;
      lastClick.key = key;
      lastClick.at = now;
      /* 1초가 되기 전에 눌러도 "본 사람" 안에 들어가도록, 노출을 먼저 기록합니다. */
      if (name === "contact_click") ctaView(params.cta_id, place, { beacon: true });
      send(name, params, { beacon: true });
    } catch (err) { /* 링크 이동은 항상 그대로 진행합니다. */ }
  }

  /* ---------- 상담 폼 시작 ---------- */
  function formIdOf(form) {
    return form && form.id ? FORMS[form.id] || "" : "";
  }
  var started = {};
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
      formView(id, placementOf(form));
      send("consultation_start", { form_id: id, placement: placementOf(form) });
    } catch (err) { /* 무시 */ }
  }

  document.addEventListener("click", onLinkClick, true);
  document.addEventListener("input", onFormInput, true);
  document.addEventListener("change", onFormInput, true);

  /* ---------- 화면 노출 측정(일정 시간 이상 보였을 때 한 번) ---------- */
  var watched = [];
  var io = null;
  function enoughShown(entry, item) {
    if (!entry.isIntersecting) return false;
    if (item.rule === "half") return entry.intersectionRatio >= 0.5;
    if (item.rule === "any") return entry.intersectionRect.height > 0;
    var h = entry.boundingClientRect.height || 1;
    var vh = window.innerHeight || document.documentElement.clientHeight || 600;
    return entry.intersectionRect.height >= Math.min(h * 0.5, vh * 0.35);
  }
  function clearTimer(item) {
    if (item.timer) {
      window.clearTimeout(item.timer);
      item.timer = 0;
    }
  }
  function arm(item) {
    if (item.done || item.timer || !item.visible || document.visibilityState === "hidden") return;
    item.timer = window.setTimeout(function () {
      item.timer = 0;
      if (item.done || !item.visible || document.visibilityState === "hidden") return;
      item.done = true;
      if (io) io.unobserve(item.el);
      item.fire();
    }, item.ms);
  }
  function itemOf(el) {
    for (var i = 0; i < watched.length; i++) if (watched[i].el === el) return watched[i];
    return null;
  }
  function watch(el, ms, rule, fire) {
    if (!io || !el || itemOf(el)) return;
    var item = { el: el, ms: ms, rule: rule, fire: fire, visible: false, timer: 0, done: false };
    watched.push(item);
    io.observe(el);
  }
  if (window.IntersectionObserver) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var item = itemOf(entry.target);
        if (!item || item.done) return;
        item.visible = enoughShown(entry, item);
        if (item.visible) arm(item);
        else clearTimer(item);
      });
    }, { threshold: [0, 0.1, 0.25, 0.35, 0.5, 0.75, 1] });
    document.addEventListener("visibilitychange", function () {
      watched.forEach(function (item) {
        if (document.visibilityState === "hidden") clearTimer(item);
        else arm(item);
      });
    });
  }

  var seenCta = {};
  var seenForm = {};
  var seenBenefit = {};
  var seenShowroom = false;
  function ctaView(id, place, opts) {
    if (!id || seenCta[id]) return;
    seenCta[id] = true;
    send("cta_view", { cta_id: id, placement: place }, opts);
  }
  function formView(formId, place) {
    if (seenForm[formId]) return;
    seenForm[formId] = true;
    send("consultation_form_view", { form_id: formId, placement: place });
  }
  function benefitView(type, place) {
    if (seenBenefit[type]) return;
    seenBenefit[type] = true;
    send("benefit_detail_view", { benefit_type: type, placement: place });
  }
  /* 대상: 상담 행동 버튼만(카카오톡·전화 링크, 상담 폼 제출 버튼). 일반 링크는 노출 측정을 하지 않습니다. */
  function scan() {
    if (!io || mode === "off") return;
    try {
      Array.prototype.forEach.call(document.querySelectorAll('a[href^="tel:"], a[href*="/chat"], a[href*="kakao.com"]'), function (el) {
        var method = contactMethodOf(el);
        if (!method) return;
        var place = placementOf(el);
        var id = ctaIdOf(el, place, method);
        if (seenCta[id]) return;
        watch(el, 1000, "half", function () { ctaView(id, place); });
      });
      CTA_FIXED.forEach(function (pair) {
        var el = document.querySelector(pair[0]);
        if (!el || seenCta[pair[1]]) return;
        watch(el, 1000, "half", function () { ctaView(pair[1], placementOf(el)); });
      });
      Object.keys(FORMS).forEach(function (domId) {
        var form = document.getElementById(domId);
        var formId = FORMS[domId];
        if (!form || seenForm[formId]) return;
        watch(form, 1000, "part", function () { formView(formId, placementOf(form)); });
      });
      var place = document.querySelector(".hp-place");
      if (place && !seenShowroom) {
        watch(place, 1500, "part", function () {
          if (seenShowroom) return;
          seenShowroom = true;
          send("showroom_view", { placement: "showroom" });
        });
      }
      if (pageSlug === "prices") {
        Object.keys(PRICE_PANELS).forEach(function (domId) {
          var el = document.getElementById(domId);
          if (!el || seenBenefit[PRICE_PANELS[domId]]) return;
          watch(el, 1500, "part", function () { benefitView(PRICE_PANELS[domId], "price_tab"); });
        });
      } else if (BENEFIT_PAGES[pageSlug]) {
        var main = document.querySelector("main");
        if (main) watch(main, 3000, "any", function () { benefitView(BENEFIT_PAGES[pageSlug], "detail_page"); });
      }
    } catch (err) { /* 무시 */ }
  }
  var scanTimer = 0;
  function scanSoon() {
    if (scanTimer) return;
    scanTimer = window.setTimeout(function () {
      scanTimer = 0;
      scan();
    }, 400);
  }
  function startWatching() {
    scan();
    if (window.MutationObserver && document.body) {
      new MutationObserver(scanSoon).observe(document.body, { childList: true, subtree: true });
    }
  }

  /* ---------- 견적 결과: 조건이 멈춘 뒤 마지막 결과만 보냅니다 ---------- */
  var quotePending = null;
  var quoteTimer = 0;
  function flushQuote() {
    if (quoteTimer) {
      window.clearTimeout(quoteTimer);
      quoteTimer = 0;
    }
    var q = quotePending;
    quotePending = null;
    if (!q) return;
    sendOnce("quote|" + q.slot, q.key, "quote_view", q.params, q.beacon ? { beacon: true } : null);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden" && quotePending) {
      quotePending.beacon = true;
      flushQuote();
    }
  });

  /* ---------- 상담 접수 단계 ---------- */
  var submitAt = {};
  var submitToken = {};
  var leadSent = {};
  var errorSeen = {};
  function fieldList(fields) {
    return (fields || []).filter(function (f) { return ERROR_FIELDS[f]; }).sort().join(".");
  }

  /* ---------- 페이지에서 쓰는 공개 함수 ---------- */
  window.BenzTrack = {
    mode: mode,
    pageType: pageType,
    uiVersion: CONFIG.uiVersion,
    isUser: isUserEvent,
    setConsent: function (granted) {
      try { gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" }); } catch (err) { /* 무시 */ }
    },
    /* 문의 클릭에 붙일 현재 차종·구매 방식. fn은 {row, pay}를 돌려줍니다. */
    setContext: function (fn) {
      contextFn = typeof fn === "function" ? fn : null;
    },
    seriesOf: function (seg) {
      return SERIES[seg] || "";
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
    /* 유효한 견적 결과가 실제로 표시됐을 때. flags: 적용 중인 혜택 키 배열.
       조건을 빠르게 여러 번 바꾸면 마지막 결과 하나만 보내고(0.7초), 같은 결과의 다시 그리기는 보내지 않습니다. */
    quoteView: function (row, pay, flags, afterWon, placement, trigger) {
      if (!row || !row.name || !isFinite(afterWon) || afterWon <= 0) return;
      var on = (flags || []).filter(function (k) { return BENEFITS[k]; }).sort();
      var p = vehicleOf(row);
      if (PAYS[pay]) p.purchase_method = PAYS[pay];
      p.placement = placement;
      p.quote_price_man = Math.round(afterWon / 10000);
      p.benefit_count = on.length;
      if (trigger) p.view_trigger = trigger;
      var key = [row.my, row.name, pay, on.join(","), p.quote_price_man].join("|");
      if (lastKey["quote|" + placement] === key) {
        if (quotePending && quotePending.slot === placement) quotePending = null;
        return;
      }
      if (quotePending && quotePending.slot !== placement) flushQuote();
      quotePending = { slot: placement, key: key, params: p };
      if (quoteTimer) window.clearTimeout(quoteTimer);
      quoteTimer = window.setTimeout(flushQuote, 700);
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
    /* 견적 요약 복사에 성공했을 때. 복사한 글은 보내지 않습니다. */
    quoteCopy: function (row, pay, placement) {
      var p = vehicleOf(row);
      if (PAYS[pay]) p.purchase_method = PAYS[pay];
      p.placement = placement;
      send("quote_copy", p);
    },
    /* 전시장·시승 안내에서 한 행동. action: address_copy(주소 복사에 성공했을 때) */
    showroomAction: function (action) {
      if (action !== "address_copy") return;
      send("showroom_action", { action: action, placement: "showroom" });
    },
    vehicleParams: function (row, pay) {
      var p = vehicleOf(row);
      if (PAYS[pay]) p.purchase_method = PAYS[pay];
      return p;
    },
    reservationTarget: function (label) {
      return PREORDER_TARGETS[label] || "";
    },
    /* 필수 입력 검사를 통과하고 접수 요청을 보내기 직전에 부릅니다. 두 번 눌러도 3초 안에는 한 번만 보냅니다. */
    formSubmit: function (formId, ctx, button) {
      try {
        var now = Date.now();
        if (submitAt[formId] && now - submitAt[formId] < 3000) return;
        submitAt[formId] = now;
        submitToken[formId] = (submitToken[formId] || 0) + 1;
        var p = {};
        if (ctx) Object.keys(ctx).forEach(function (k) { p[k] = ctx[k]; });
        p.form_id = formId;
        var form = button && button.closest ? button.closest("form") : null;
        if (form) formView(formId, placementOf(form));
        if (button) {
          p.cta_id = ctaIdOf(button, placementOf(button), "consult_submit");
          ctaView(p.cta_id, placementOf(button));
        }
        send("consultation_submit", p);
      } catch (err) { /* 무시 */ }
    },
    /* 접수 요청이 끝났을 때(res: fetch 응답). 응답 본문이 {"ok":true}일 때만 generate_lead를 보냅니다.
       no-cors 응답(opaque)은 내용을 읽을 수 없으므로 성공으로 보지 않습니다. 한 번의 제출에 한 번만 보냅니다. */
    formResult: function (formId, res, ctx) {
      try {
        started[formId] = false;
        var token = formId + "#" + (submitToken[formId] || 0);
        if (leadSent[token]) return;
        if (!res || res.type === "opaque" || res.type === "opaqueredirect" || res.ok !== true || typeof res.clone !== "function") return;
        res.clone().json().then(function (body) {
          if (!body || body.ok !== true || leadSent[token]) return;
          leadSent[token] = true;
          var p = {};
          if (ctx) Object.keys(ctx).forEach(function (k) { p[k] = ctx[k]; });
          p.form_id = formId;
          send("generate_lead", p);
        }, function () { /* 본문을 읽지 못하면 성공으로 보지 않습니다. */ });
      } catch (err) { /* 무시 */ }
    },
    /* 접수 오류. type: validation / network / server / timeout. fields: 빠진 항목 종류만(vehicle, name, phone, email, consent).
       같은 폼에서 같은 오류는 이 페이지에서 한 번만 보냅니다. */
    formError: function (formId, type, fields) {
      try {
        if (!ERROR_TYPES[type]) return;
        var list = type === "validation" ? fieldList(fields) : "";
        var key = formId + "|" + type + "|" + list;
        if (errorSeen[key]) return;
        errorSeen[key] = true;
        var p = { form_id: formId, error_type: type };
        if (list) p.error_fields = list;
        send("consultation_error", p);
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
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startWatching);
  else startWatching();
})();
