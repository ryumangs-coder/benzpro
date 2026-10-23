/* 차종·연식·구매 방식·혜택만 기억합니다. 성함과 연락처는 넣지 않습니다. */
(function () {
  var KEY = "benzpro-pick";
  var PAYS = { cash: 1, install: 1, care: 1, lease: 1 };
  var FLAGS = ["retain", "trade", "conquest", "mou"];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function read() {
    try {
      var raw = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (!raw || typeof raw !== "object") return null;
      var out = {};
      if (typeof raw.name === "string" && raw.name) out.name = raw.name.slice(0, 80);
      if (typeof raw.my === "string" && /^MY\d{2}$/.test(raw.my)) out.my = raw.my;
      if (PAYS[raw.pay]) out.pay = raw.pay;
      FLAGS.forEach(function (key) {
        if (raw[key] === true) out[key] = true;
      });
      return out.name || out.my ? out : null;
    } catch (err) {
      return null;
    }
  }
  function write(pick) {
    pick = pick || {};
    var out = {};
    if (pick.name) out.name = String(pick.name).slice(0, 80);
    if (pick.my && /^MY\d{2}$/.test(pick.my)) out.my = pick.my;
    if (PAYS[pick.pay]) out.pay = pick.pay;
    FLAGS.forEach(function (key) {
      if (pick[key]) out[key] = true;
    });
    try {
      sessionStorage.setItem(KEY, JSON.stringify(out));
    } catch (err) {}
    return out;
  }
  function params(pick) {
    var query = new URLSearchParams();
    if (!pick) return query;
    if (pick.name) query.set("name", pick.name);
    if (pick.my) query.set("my", pick.my);
    if (pick.pay) query.set("pay", pick.pay);
    FLAGS.forEach(function (key) {
      if (pick[key]) query.set(key, "1");
    });
    return query;
  }
  function decorate(href) {
    var pick = read();
    if (!pick || href == null) return href;
    var hash = "";
    var bare = String(href);
    var hashAt = bare.indexOf("#");
    if (hashAt !== -1) {
      hash = bare.slice(hashAt);
      bare = bare.slice(0, hashAt);
    }
    var pathOnly = bare.split("?")[0];
    var isQuote = /(^|\/)quote\.html$/.test(pathOnly);
    var isHome = /(^|\/)index\.html$/.test(pathOnly) || pathOnly === "/" || pathOnly === "";
    var keep = hash === "#consulting" || hash === "#calc" || hash.indexOf("#consulting") === 0 || hash.indexOf("#calc") === 0;
    if (!isQuote && !(isHome && keep)) return href;
    var cut = bare.indexOf("?");
    var query = new URLSearchParams(cut === -1 ? "" : bare.slice(cut + 1));
    var path = cut === -1 ? bare : bare.slice(0, cut);
    if (!query.get("name") && pick.name) query.set("name", pick.name);
    if (!query.get("my") && pick.my) query.set("my", pick.my);
    if (!query.get("pay") && pick.pay) query.set("pay", pick.pay);
    FLAGS.forEach(function (key) {
      if (!query.has(key) && pick[key]) query.set(key, "1");
    });
    var q = query.toString();
    return path + (q ? "?" + q : "") + hash;
  }

  window.BenzPick = { read: read, write: write, params: params, decorate: decorate, flags: FLAGS };

  function mount() {
    var path = location.pathname;
    if (/quote\.html$/.test(path)) return;
    if (/\/$|index\.html$/.test(path)) return;
    var pick = read();
    if (!pick || !pick.name || document.getElementById("pick-return")) return;
    var query = params(pick).toString();
    var extra = "";
    if (/mou\.html$/.test(path)) {
      var mou = params(Object.assign({}, pick, { mou: true })).toString();
      extra = '<a href="index.html?' + mou + '#calc">MOU를 내 견적에 반영</a>';
    } else if (/benefit\.html$/.test(path)) {
      var owned = params(Object.assign({}, pick, { retain: true })).toString();
      extra = '<a href="index.html?' + owned + '#calc">지금 타는 차 혜택을 견적에 반영</a>';
    } else if (/fleet\.html$/.test(path)) {
      extra = '<a href="index.html?name=' + encodeURIComponent(pick.name) + "&my=" + encodeURIComponent(pick.my || "") + '#consulting">법인 구매로 상담받기</a>';
    }
    var bar = document.createElement("div");
    bar.id = "pick-return";
    bar.className = "benz-pick-back";
    bar.innerHTML =
      "<p><b>" + esc(pick.name) + "</b> · " + esc(pick.my || "") + " 선택을 유지하고 있습니다.</p>" +
      "<p><a href=\"quote.html?" + query + "\">상세 견적 이어보기</a>" +
      "<a href=\"index.html?" + query + "#calc\">메인 계산으로</a>" +
      extra +
      "</p>";
    var header = document.querySelector("header");
    if (header && header.parentNode) header.parentNode.insertBefore(bar, header.nextSibling);
    else document.body.insertBefore(bar, document.body.firstChild);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
