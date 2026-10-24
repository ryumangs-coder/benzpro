/* 공통 모션: 핵심 가격 카운트업, 섹션 등장 효과.
   - 모두 opacity·transform만 사용하고, 한 번만 실행합니다.
   - prefers-reduced-motion, IntersectionObserver 없음, 스크립트 오류 시에는 최종 내용이 그대로 보입니다.
   - 카운트업은 화면 위에 덮는 보조 표시일 뿐이고, 원래 글자(최종 값)는 바꾸지 않습니다. */
(function () {
  if (window.BenzMotion) return;
  var reduceQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var hasIO = "IntersectionObserver" in window;
  var started = Date.now();

  function pageName() {
    var file = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "");
    return file || "index";
  }

  /* ---------- 카운트업 ---------- */
  var DURATION = 800;
  var played = {};
  var countIO = null;

  function parseValue(text) {
    var m = /^\s*(\d{1,3}(?:,\d{3})+|\d+)\s*(만원|원|%)\s*$/.exec(text || "");
    if (!m) return null;
    return { n: parseInt(m[1].replace(/,/g, ""), 10), unit: m[2] };
  }
  function format(n, unit) {
    return Math.round(n).toLocaleString("ko-KR") + unit;
  }
  function ease(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function runCount(el) {
    var key = el.getAttribute("data-count-key") || "";
    if (key && played[key]) return;
    if (key) played[key] = true;
    if (reduceQuery.matches || !el.isConnected) return;
    var finalText = el.textContent;
    var parsed = parseValue(finalText);
    /* 최종 글자와 같은 형식으로 만들 수 없으면 움직이지 않습니다. */
    if (!parsed || format(parsed.n, parsed.unit) !== finalText.trim() || parsed.n < 10) return;

    var ghost = document.createElement("span");
    ghost.className = "bp-count-ghost";
    ghost.setAttribute("aria-hidden", "true");
    ghost.style.color = window.getComputedStyle(el).color;
    ghost.textContent = format(0, parsed.unit);
    var prevPosition = el.style.position;
    if (window.getComputedStyle(el).position === "static") el.style.position = "relative";
    el.classList.add("bp-counting");
    el.appendChild(ghost);

    var begin = null;
    var frame = 0;
    function cleanup() {
      window.cancelAnimationFrame(frame);
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
      el.classList.remove("bp-counting");
      el.style.position = prevPosition;
    }
    function tick(now) {
      if (!el.isConnected || !ghost.parentNode) {
        cleanup();
        return;
      }
      if (begin === null) begin = now;
      var t = Math.min(1, (now - begin) / DURATION);
      ghost.textContent = format(parsed.n * ease(t), parsed.unit);
      if (t < 1) frame = window.requestAnimationFrame(tick);
      else cleanup();
    }
    frame = window.requestAnimationFrame(tick);
  }

  /* 카드가 아직 나타나는 중이면 잠깐 기다렸다가 시작합니다. */
  function startCount(el, tries) {
    if (el.closest && el.closest(".bp-reveal") && tries < 12) {
      window.setTimeout(function () { startCount(el, tries + 1); }, 100);
      return;
    }
    runCount(el);
  }

  function scanCounts(root) {
    if (!hasIO || reduceQuery.matches) return;
    var scope = root && root.querySelectorAll ? root : document;
    var list = Array.prototype.slice.call(scope.querySelectorAll("[data-count]:not([data-count-seen])"));
    if (scope !== document && scope.matches && scope.matches("[data-count]:not([data-count-seen])")) list.push(scope);
    if (!list.length) return;
    if (!countIO) {
      countIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countIO.unobserve(entry.target);
          startCount(entry.target, 0);
        });
      }, { threshold: 0.6 });
    }
    list.forEach(function (el) {
      el.setAttribute("data-count-seen", "1");
      var key = el.getAttribute("data-count-key") || "";
      if (key && played[key]) return;
      countIO.observe(el);
    });
  }

  /* ---------- 섹션 등장 ---------- */
  var FX_PAGES = {
    index: [
      ".hp-section > .hp-wrap > h2",
      ".hp-section > .hp-wrap > .hp-lead",
      ".hp-after-head",
      ".hp-link-card",
      "#e-cards > *",
      "#other-models > *",
      ".hp-place > h3",
      ".hp-facilities li",
      ".hp-drive"
    ],
    benefit: ["main h2", "main article"],
    fleet: ["main h2", "main article"],
    rental: ["main h2", "main article"],
    care: ["main h2", "main article"],
    tire: ["main h2", "main article"],
    golden: ["main h2", "main article"],
    warranty: ["main h2", "main article"],
    welcome: ["main h2", "main article"],
    cards: ["main h2", "main article"],
    mou: ["main h2"],
    preorder: ["main h2"]
  };
  var SKIP_INSIDE = "form, table, aside, details, dialog, [data-no-fx], #bp-head, .bp-dock, .bp-toc, .q-pick-panel, .hp-modal, .sheet, [aria-live]";
  var revealIO = null;
  var pending = [];
  var flushQueued = false;

  function show(el, instant) {
    if (!el.classList.contains("bp-reveal")) return;
    if (instant) el.style.transition = "none";
    el.classList.add("is-in");
    window.setTimeout(function () {
      el.classList.remove("bp-reveal", "is-in");
      el.style.removeProperty("--bp-d");
      el.style.removeProperty("transition");
    }, instant ? 30 : 620);
  }

  function flush() {
    flushQueued = false;
    var batch = pending.splice(0, pending.length).filter(function (el) {
      return el.isConnected;
    });
    batch.sort(function (a, b) {
      return a.compareDocumentPosition(b) & 4 ? -1 : 1;
    });
    batch.forEach(function (el, i) {
      /* 스태거: 최대 4번째까지만 간격을 두고, 긴 목록은 끝까지 기다리지 않습니다. */
      el.style.setProperty("--bp-d", Math.min(i, 4) * 50 + "ms");
      show(el, false);
    });
  }

  function markFx(root) {
    var selectors = FX_PAGES[pageName()];
    if (!selectors || !hasIO || reduceQuery.matches) return;
    if (!revealIO) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            /* 빠르게 지나쳤거나 위로 건너뛴 내용은 움직임 없이 바로 보입니다. */
            if (entry.rootBounds && entry.boundingClientRect.bottom <= entry.rootBounds.top) {
              revealIO.unobserve(entry.target);
              show(entry.target, true);
            }
            return;
          }
          revealIO.unobserve(entry.target);
          pending.push(entry.target);
        });
        if (pending.length && !flushQueued) {
          flushQueued = true;
          window.requestAnimationFrame(flush);
        }
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
      document.documentElement.classList.add("bp-fx");
    }
    var scope = root && root.querySelectorAll ? root : document;
    selectors.forEach(function (selector) {
      Array.prototype.forEach.call(scope.querySelectorAll(selector), function (el) {
        if (el.hasAttribute("data-fx-seen")) return;
        el.setAttribute("data-fx-seen", "1");
        if (el.closest(SKIP_INSIDE)) return;
        var rect = el.getBoundingClientRect();
        /* 첫 화면과 이미 지나온 위치는 그대로 둡니다. */
        if (rect.top < window.innerHeight * 0.95) return;
        el.classList.add("bp-reveal");
        revealIO.observe(el);
      });
    });
  }

  /* 앵커 이동이나 빠른 스크롤로 건너뛴 내용은 움직임 없이 바로 보입니다. */
  var sweepQueued = false;
  window.addEventListener("scroll", function () {
    if (sweepQueued) return;
    sweepQueued = true;
    window.requestAnimationFrame(function () {
      sweepQueued = false;
      Array.prototype.forEach.call(document.querySelectorAll(".bp-reveal:not(.is-in)"), function (el) {
        if (el.getBoundingClientRect().bottom < 0) {
          if (revealIO) revealIO.unobserve(el);
          show(el, true);
        }
      });
    });
  }, { passive: true });

  function revealAll() {
    Array.prototype.forEach.call(document.querySelectorAll(".bp-reveal"), function (el) {
      show(el, true);
    });
  }
  /* 키보드로 들어온 내용, 인쇄는 기다리지 않고 바로 보입니다. */
  document.addEventListener("focusin", function (event) {
    var el = event.target && event.target.closest ? event.target.closest(".bp-reveal") : null;
    if (el) show(el, true);
  });
  window.addEventListener("beforeprint", revealAll);

  function scanAll(root) {
    try {
      scanCounts(root);
      markFx(root);
    } catch (err) {
      revealAll();
    }
  }

  function boot() {
    scanAll(document);
    /* 첫 몇 초 동안 새로 그려지는 카드만 처리합니다. 이후 조건 변경으로 다시 그려질 때는 효과를 반복하지 않습니다. */
    if (window.MutationObserver) {
      var queued = false;
      var observer = new MutationObserver(function () {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(function () {
          queued = false;
          scanCounts(document);
          if (Date.now() - started < 4000) markFx(document);
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
    window.addEventListener("load", function () { scanAll(document); });
  }

  window.BenzMotion = { scan: scanAll, played: played };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
