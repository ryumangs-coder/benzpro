(function () {
  var YT = "https://www.youtube.com/@benzpro.official";
  var TEL = "tel:01091649639";
  var KAKAO = "https://open.kakao.com/o/skdA6cZc";
  var PRICES = "https://benzpro.co.kr/prices.html";

  function ico(path) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="' + path + '"/></svg>';
  }
  var I = {
    star: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#0A0A0A" stroke="#F5F5F5" stroke-width="1.75"/><path fill="#F5F5F5" d="M32 7 36.8 29.2 53.7 44.5 32 37.5 10.3 44.5 27.2 29.2Z"/></svg>',
    tag: ico("M13.5 3 4 12.5V20h7.5L21 10.5 13.5 3zM8.8 16.2a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8z"),
    calc: ico("M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm1 4h8v3H8V7zm0 5h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM8 15h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"),
    car: ico("M5 16l1.5-4.5A2 2 0 0 1 8.4 10h7.2a2 2 0 0 1 1.9 1.5L19 16v4h-2v-2H7v2H5v-4zm2.2-1h9.6l-1-3H8.2l-1 3zM7.5 16.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm9 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"),
    cal: ico("M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm11 8H6v10h12V10z"),
    yt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="yt-body" fill="#FF0000" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z"/><path class="yt-play" fill="#ffffff" d="M9.8 15.5v-7L16 12l-6.2 3.5z"/></svg>',
    phone: ico("M6.6 3.2h2.4l1.3 3.2-1.8 1.1a12.5 12.5 0 0 0 5.9 5.9l1.1-1.8 3.2 1.3v2.4a1.6 1.6 0 0 1-1.7 1.6A16.2 16.2 0 0 1 5 4.9a1.6 1.6 0 0 1 1.6-1.7z"),
    menu: ico("M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"),
    close: ico("M6.2 5 12 10.8 17.8 5 19 6.2 13.2 12 19 17.8 17.8 19 12 13.2 6.2 19 5 17.8 10.8 12 5 6.2z"),
    shield: ico("M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3zm-1.2 13.6-3.4-3.4 1.4-1.4 2 2 4.6-4.6 1.4 1.4-6 6z"),
    doc: ico("M5 4h10l4 4v12H5V4zm2 2v12h10V9h-3V6H7zm2 6h6v2H9v-2zm0 3h6v2H9v-2z"),
    talk: ico("M12 3.5C6.7 3.5 2.5 6.8 2.5 10.8c0 2.6 1.7 4.9 4.3 6.2l-.8 3 3.4-1.8c.8.1 1.6.2 2.6.2 5.3 0 9.5-3.3 9.5-7.3S17.3 3.5 12 3.5z")
  };

  function pageFile() {
    var path = location.pathname.replace(/\\/g, "/");
    var file = path.split("/").pop() || "";
    if (!file || file === "/") return "index";
    return file.replace(/\.html$/, "");
  }
  function currentNav() {
    var file = pageFile();
    if (file === "prices") return "prices";
    if (file === "quote") return "quote";
    if (file === "models") return "models";
    if (file === "preorder") return "preorder";
    return "";
  }
  function item(href, key, icon, label, extra) {
    var current = currentNav() === key ? ' aria-current="page"' : "";
    return '<a href="' + href + '"' + current + (extra || "") + ">" + icon + "<span>" + label + "</span></a>";
  }

  if (!document.querySelector('link[href^="chrome.css"]')) {
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "chrome.css?v=20261023l";
    document.head.appendChild(css);
  }

  var head = document.createElement("header");
  head.id = "bp-head";
  head.innerHTML =
    '<a class="bp-logo" href="index.html" aria-label="벤츠프로 홈. 메르세데스-벤츠 공식 파트너 김민구 차장">' + I.star +
    '<span class="bp-brand"><span class="bp-word">BENZ <em>PRO</em></span><span class="bp-ko">벤츠<em>프로</em></span><span class="bp-logo-sub">메르세데스-벤츠 공식 파트너 김민구 차장</span></span></a>' +
    '<nav class="bp-nav" aria-label="주요 메뉴">' +
    item(PRICES, "prices", I.tag, "할인·가격") +
    item("quote.html", "quote", I.calc, "내 견적", ' id="bp-quote"') +
    item("models.html", "models", I.car, "차종 비교") +
    item("preorder.html", "preorder", I.cal, "사전예약") +
    "</nav>" +
    '<div class="bp-tools">' +
    '<a class="bp-icon bp-yt" href="' + YT + '" target="_blank" rel="noopener noreferrer" aria-label="벤츠프로 유튜브 채널" title="벤츠프로 유튜브 채널">' + I.yt + "</a>" +
    '<a class="bp-icon" href="' + TEL + '" aria-label="벤츠프로 전화 문의" title="벤츠프로 전화 문의">' + I.phone + "</a>" +
    '<button type="button" class="bp-icon bp-burger" id="bp-menu" aria-expanded="false" aria-controls="bp-drawer" aria-label="메뉴">' + I.menu + "</button>" +
    "</div>";

  var drawer = document.createElement("div");
  drawer.id = "bp-drawer";
  drawer.className = "bp-drawer";
  drawer.hidden = true;
  drawer.innerHTML =
    '<div class="bp-backdrop" data-bp-close></div>' +
    '<div class="bp-panel" role="dialog" aria-modal="true" aria-label="메뉴">' +
    '<div class="bp-panel-top"><button type="button" class="bp-icon" data-bp-close aria-label="메뉴 닫기">' + I.close + "</button></div>" +
    item(PRICES, "prices", I.tag, "할인·가격") +
    item("quote.html", "quote", I.calc, "내 견적", ' data-bp-quote') +
    item("models.html", "models", I.car, "차종 비교") +
    item("preorder.html", "preorder", I.cal, "사전예약") +
    '<div class="bp-sub">' +
    item("warranty.html", "", I.shield, "보증 연장") +
    item("https://mercedes.benzpro.co.kr", "", I.doc, "인사이트", ' target="_blank" rel="noopener noreferrer"') +
    "</div></div>";

  var kakao = document.createElement("a");
  kakao.className = "bp-kakao";
  kakao.href = KAKAO;
  kakao.target = "_blank";
  kakao.rel = "noopener noreferrer";
  kakao.setAttribute("aria-label", "카톡 문의");
  kakao.innerHTML = I.talk + "<span>카톡 문의</span>";

  var parent = document.body || document.documentElement;
  parent.insertBefore(kakao, parent.firstChild);
  parent.insertBefore(drawer, parent.firstChild);
  parent.insertBefore(head, parent.firstChild);

  var logoSub = head.querySelector(".bp-logo-sub");
  function fitLogoSub() {
    if (!logoSub) return;
    logoSub.hidden = true;
    if (!desktop.matches) return;
    logoSub.hidden = false;
    var links = head.querySelectorAll(".bp-nav a");
    var wrapped = links.length > 1 && links[0].offsetTop !== links[links.length - 1].offsetTop;
    if (wrapped || head.scrollWidth > head.clientWidth + 1) logoSub.hidden = true;
  }

  var menuBtn = head.querySelector("#bp-menu");
  var panel = drawer.querySelector(".bp-panel");
  var desktop = window.matchMedia("(min-width: 1100px)");
  var lastFocus = null;

  function lock(on) {
    document.body.classList.toggle("bp-lock", on);
  }
  function closeMenu(back) {
    if (drawer.hidden) return;
    drawer.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    lock(false);
    if (back) menuBtn.focus();
  }
  function openMenu() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
    lock(true);
    var closeBtn = drawer.querySelector("[aria-label='메뉴 닫기']");
    if (closeBtn) closeBtn.focus();
  }
  menuBtn.addEventListener("click", function () {
    if (menuBtn.getAttribute("aria-expanded") === "true") closeMenu(true);
    else openMenu();
  });
  drawer.addEventListener("click", function (event) {
    if (event.target.closest("[data-bp-close]")) closeMenu(true);
  });
  document.addEventListener("keydown", function (event) {
    if (drawer.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key !== "Tab") return;
    var items = panel.querySelectorAll("a, button");
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
  function onDesktop(event) {
    if (event.matches) closeMenu(false);
  }
  if (desktop.addEventListener) desktop.addEventListener("change", onDesktop);
  else if (desktop.addListener) desktop.addListener(onDesktop);
  window.addEventListener("pagehide", function () { lock(false); });

  function tidyBars() {
    var bars = document.querySelectorAll("#cta, .fixed.bottom-0, [class*='bottom-0']");
    var lift = 0;
    Array.prototype.forEach.call(bars, function (bar) {
      if (bar === kakao || bar.id === "bp-drawer" || bar.id === "bp-head") return;
      var style = window.getComputedStyle(bar);
      if (style.position !== "fixed") return;
      Array.prototype.forEach.call(bar.querySelectorAll('a[href*="open.kakao.com"]'), function (link) {
        link.remove();
      });
      var links = bar.querySelectorAll("a, button");
      var onlyPhone = links.length && Array.prototype.every.call(links, function (link) {
        return (link.getAttribute("href") || "").indexOf("tel:") === 0;
      });
      if (!links.length || onlyPhone) {
        bar.remove();
        return;
      }
      if (style.display !== "none" && bar.offsetHeight > lift) lift = bar.offsetHeight;
    });
    document.documentElement.style.setProperty("--bp-kakao-lift", lift ? lift + "px" : "0px");
  }

  function decorateQuote() {
    if (!window.BenzPick) return;
    [document.getElementById("bp-quote"), drawer.querySelector("[data-bp-quote]")].forEach(function (link) {
      if (!link) return;
      link.setAttribute("href", window.BenzPick.decorate(link.getAttribute("href")));
    });
  }

  function ready() {
    Array.prototype.forEach.call(document.querySelectorAll("header"), function (old) {
      if (old.id !== "bp-head") old.remove();
    });
    document.body.classList.add("bp-has-kakao");
    tidyBars();
    decorateQuote();
    fitLogoSub();
    window.addEventListener("resize", function () {
      tidyBars();
      fitLogoSub();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();

  if (!document.querySelector('script[src^="select-ui.js"]')) {
    var pickUi = document.createElement("script");
    pickUi.src = "select-ui.js?v=20261023j";
    document.head.appendChild(pickUi);
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", function () {
      var keyboard = window.innerHeight - window.visualViewport.height > 140;
      document.body.classList.toggle("bp-keyboard", keyboard);
    });
  }
})();
