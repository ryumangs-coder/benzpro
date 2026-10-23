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
    css.href = "chrome.css?v=20261023z4";
    document.head.appendChild(css);
  }

  var head = document.createElement("header");
  head.id = "bp-head";
  head.innerHTML =
    '<a class="bp-logo" href="index.html" aria-label="벤츠프로 홈. 메르세데스-벤츠 공식 파트너 김민구 차장">' + I.star +
    '<span class="bp-brand"><span class="bp-markline"><span class="bp-word">BENZ <em>PRO</em></span><span class="bp-ko">벤츠<em>프로</em></span></span><span class="bp-logo-sub"><span class="bp-sub-line">메르세데스-벤츠</span><span class="bp-sub-line">공식 파트너 김민구 차장</span></span></span></a>' +
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
    '<div class="bp-panel-brand">' +
    '<a class="bp-panel-logo" href="index.html">' +
    '<span class="bp-panel-marks"><b class="bp-mark-benz">BENZ</b> <b class="bp-mark-pro">PRO</b> <span class="bp-ko-lock"><b class="bp-mark-benz">벤츠</b><b class="bp-mark-pro">프로</b></span></span>' +
    '<span class="bp-panel-partner">메르세데스-벤츠 공식 파트너 김민구 차장</span></a>' +
    '<button type="button" class="bp-icon" data-bp-close aria-label="메뉴 닫기">' + I.close + "</button></div>" +
    item(PRICES, "prices", I.tag, "할인·가격") +
    item("quote.html", "quote", I.calc, "내 견적", ' data-bp-quote') +
    item("models.html", "models", I.car, "차종 비교") +
    item("preorder.html", "preorder", I.cal, "사전예약") +
    '<div class="bp-sub">' +
    item("warranty.html", "", I.shield, "보증 연장") +
    item("https://mercedes.benzpro.co.kr", "", I.doc, "인사이트", ' target="_blank" rel="noopener noreferrer"') +
    "</div>" +
    '<div class="bp-extra">' +
    '<p>혜택 더 보기</p>' +
    item("benefit.html", "", I.tag, "추가혜택") +
    item("mou.html", "", I.calc, "MOU할인") +
    item("fleet.html", "", I.car, "법인할인") +
    item("rental.html", "", I.cal, "렌터카") +
    item("golden.html", "", I.cal, "골든타임") +
    item("welcome.html", "", I.doc, "구매 기프트") +
    item("care.html", "", I.shield, "신차교환") +
    item("tire.html", "", I.doc, "타이어") +
    item("cards.html", "", I.tag, "카드혜택") +
    "</div></div>";

  var dock = document.createElement("nav");
  dock.className = "bp-dock";
  dock.setAttribute("aria-label", "문의");
  dock.innerHTML =
    '<a class="bp-dock-yt" href="' + YT + '" target="_blank" rel="noopener noreferrer" aria-label="유튜브">' + I.yt + "</a>" +
    '<a class="bp-dock-kakao" href="' + KAKAO + '" target="_blank" rel="noopener noreferrer" aria-label="카카오톡 문의">' + I.talk + "</a>" +
    '<a class="bp-dock-tel" href="' + TEL + '" aria-label="전화 문의">' + I.phone + "</a>";

  var parent = document.body || document.documentElement;
  parent.insertBefore(dock, parent.firstChild);
  parent.insertBefore(drawer, parent.firstChild);
  parent.insertBefore(head, parent.firstChild);

  var logoSub = head.querySelector(".bp-logo-sub");
  function fitLogoSub() {
    if (!logoSub) return;
    logoSub.hidden = false;
    if (!desktop.matches) return;
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
      if (bar === dock || bar.id === "bp-drawer" || bar.id === "bp-head") return;
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
    Array.prototype.forEach.call(document.querySelectorAll("a[href]"), function (link) {
      var href = link.getAttribute("href");
      var next = window.BenzPick.decorate(href);
      if (next !== href) link.setAttribute("href", next);
    });
  }

  function mountToc() {
    var file = pageFile();
    if (file !== "models" && file !== "prices" && file !== "quote") return;
    if (document.querySelector(".bp-toc-open")) return;
    var links = {
      prices: [
        ["#highlights", "이번 달 차값"],
        ["#how", "할인 계산"],
        ["#raised", "할인이 오른 차"],
        ["#support", "6개월 지원"],
        ["#programs", "금융 보장"],
        ["#care-card", "신차교환"],
        ["#tire-card", "타이어"],
        ["#examples", "세 대 비교"],
        ["#owned", "보유 차량 혜택"],
        ["#company", "MOU 할인"],
        ["#paycard", "카드 결제"],
        ["#finder", "차종별 가격"]
      ],
      quote: [
        ["#q-car", "차 고르기"],
        ["#q-pay", "구매 방식"],
        ["#q-benefit", "해당하는 혜택"],
        ["#lead", "상담 남기기"],
        ["#sheet", "견적 요약"]
      ]
    }[file] || [];
    var live = links.filter(function (item) { return !!document.querySelector(item[0]); });
    if (file !== "models" && !live.length) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "bp-toc-open";
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "bp-toc");
    button.setAttribute("aria-label", "이 페이지에서 이동");
    button.textContent = "페이지 목차";
    var panel = document.createElement("nav");
    panel.id = "bp-toc";
    panel.className = "bp-toc";
    panel.hidden = true;
    panel.setAttribute("aria-label", "이 페이지에서 이동");
    panel.innerHTML = '<p>이 페이지에서 이동</p><div class="bp-toc-row"></div>';
    panel.querySelector(".bp-toc-row").innerHTML = live.map(function (item) {
      return '<a href="' + item[0] + '">' + item[1] + "</a>";
    }).join("");
    function setOpen(open) {
      panel.hidden = !open;
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.textContent = open ? "닫기" : "페이지 목차";
    }
    button.addEventListener("click", function () { setOpen(panel.hidden); });
    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("click", function (event) {
      if (panel.hidden) return;
      if (event.target.closest("#bp-toc, .bp-toc-open")) return;
      setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) setOpen(false);
    });
    document.body.classList.add("bp-has-toc");
    document.body.appendChild(button);
    document.body.appendChild(panel);
  }

  function ready() {
    Array.prototype.forEach.call(document.querySelectorAll("header"), function (old) {
      if (old.id !== "bp-head") old.remove();
    });
    document.body.classList.add("bp-has-kakao");
    tidyBars();
    decorateQuote();
    mountToc();
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
    pickUi.src = "select-ui.js?v=20261023w";
    document.head.appendChild(pickUi);
  }
  if (!document.querySelector('script[src^="pick.js"]')) {
    var pickSrc = document.createElement("script");
    pickSrc.src = "pick.js?v=20261023c";
    pickSrc.async = false;
    pickSrc.onload = function () { decorateQuote(); };
    document.head.appendChild(pickSrc);
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", function () {
      var keyboard = window.innerHeight - window.visualViewport.height > 140;
      document.body.classList.toggle("bp-keyboard", keyboard);
    });
  }
})();
