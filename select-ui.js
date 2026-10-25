(function () {
  var CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 9l6 6 6-6H6z"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.2 16.6 4.6 12l1.4-1.4 3.2 3.2 7.8-7.8 1.4 1.4z"/></svg>';
  var openBox = null;
  var boxes = [];
  var pastOn = false;

  function labelFor(select) {
    if (!select.id) return null;
    return document.querySelector('label[for="' + select.id.replace(/"/g, "") + '"]');
  }

  function kickerText(select) {
    var given = select.getAttribute("data-pick-kicker");
    if (given) return given;
    var explicit = labelFor(select);
    if (explicit && !explicit.contains(select)) return explicit.textContent.replace(/\s+/g, " ").trim();
    var wrap = select.closest("label");
    if (wrap) {
      var span = wrap.querySelector("span");
      if (span) return span.textContent.replace(/\s+/g, " ").trim();
    }
    return select.getAttribute("aria-label") || "선택";
  }

  function faceParts(text) {
    var raw = String(text || "").replace(/\s+/g, " ").trim();
    var cut = raw.indexOf(" · ");
    if (cut < 0) return { name: raw || "선택해 주세요", year: "" };
    var year = raw.slice(cut + 3);
    var my = year.match(/^MY(\d+)$/);
    if (my) year = my[1] + "년식";
    return { name: raw.slice(0, cut), year: year };
  }

  function optionsOf(select) {
    var items = [];
    function walk(node, group) {
      Array.prototype.forEach.call(node.children, function (child) {
        if (child.tagName === "OPTGROUP") walk(child, child.label || "");
        else if (child.tagName === "OPTION") {
          items.push({
            option: child,
            value: child.value,
            text: child.textContent.replace(/\s+/g, " ").trim(),
            disabled: child.disabled,
            group: group,
            offer: child.getAttribute("data-offer") || "",
            status: child.getAttribute("data-status") || ""
          });
        }
      });
    }
    walk(select, "");
    return items;
  }

  function enhance(select) {
    if (!select || select.dataset.pickReady || select.multiple) return;
    if (select.closest(".q-pick-panel")) return;
    select.dataset.pickReady = "1";
    var kicker = kickerText(select);
    var action = select.getAttribute("data-pick-action") || "변경";
    var searchLabel = select.getAttribute("data-pick-search") || "검색";
    var placeholder = select.getAttribute("data-pick-placeholder") || "검색어를 입력해 주세요";
    var box = document.createElement("div");
    box.className = "bp-select";
    select.parentNode.insertBefore(box, select);
    box.appendChild(select);
    select.classList.add("bp-select-native");
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "q-pick-card";
    trigger.id = select.id ? select.id + "-open" : "";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    var kick = document.createElement("span");
    kick.className = "q-pick-k";
    kick.textContent = kicker;
    var name = document.createElement("span");
    name.className = "q-pick-name";
    var year = document.createElement("span");
    year.className = "q-pick-year";
    var change = document.createElement("span");
    change.className = "q-pick-change";
    change.innerHTML = action + " " + CHEVRON;
    trigger.appendChild(kick);
    trigger.appendChild(name);
    trigger.appendChild(year);
    trigger.appendChild(change);

    var panel = document.createElement("div");
    panel.className = "q-pick-panel";
    panel.id = select.id ? select.id + "-panel" : "";
    panel.hidden = true;
    var searchWrap = document.createElement("div");
    searchWrap.className = "bp-select-search";
    var searchId = (select.id || "pick") + "-search";
    var searchLab = document.createElement("label");
    searchLab.htmlFor = searchId;
    searchLab.textContent = searchLabel;
    var search = document.createElement("input");
    search.id = searchId;
    search.type = "search";
    search.autocomplete = "off";
    search.setAttribute("data-gtm-ignore", "1");
    search.setAttribute("data-gtag-ignore", "1");
    search.placeholder = placeholder;
    search.setAttribute("aria-label", searchLabel);
    searchWrap.appendChild(searchLab);
    searchWrap.appendChild(search);
    var pastBtn = document.createElement("button");
    pastBtn.type = "button";
    pastBtn.className = "bp-past-toggle";
    pastBtn.hidden = true;
    pastBtn.setAttribute("aria-pressed", "false");
    pastBtn.textContent = "지난 연식 보기";
    var countEl = document.createElement("p");
    countEl.className = "bp-select-count";
    countEl.setAttribute("aria-live", "polite");
    var list = document.createElement("div");
    list.className = "bp-select-list";
    list.id = select.id ? select.id + "-list" : "";
    list.setAttribute("role", "listbox");
    list.setAttribute("aria-label", kicker);
    var empty = document.createElement("p");
    empty.className = "bp-select-empty";
    empty.hidden = true;
    panel.appendChild(searchWrap);
    panel.appendChild(countEl);
    panel.appendChild(list);
    panel.appendChild(empty);
    box.insertBefore(trigger, select);
    box.insertBefore(pastBtn, select);
    box.appendChild(panel);
    trigger.setAttribute("aria-controls", list.id);

    var caption = labelFor(select);
    if (caption && !caption.contains(select)) caption.classList.add("bp-select-label");
    if (caption && !caption.id) caption.id = (select.id || "pick") + "-label";

    function syncError() {
      var scope = select.closest("[data-required], [data-question]") || box.parentElement;
      var message = scope && scope.querySelector(".hp-error.is-on");
      var invalid = select.getAttribute("aria-invalid") === "true" || !!message;
      trigger.classList.toggle("is-error", invalid);
      trigger.setAttribute("aria-invalid", invalid ? "true" : "false");
    }

    function refresh() {
      var items = optionsOf(select);
      var current = select.selectedIndex >= 0 ? select.options[select.selectedIndex] : null;
      var text = current ? current.textContent : "";
      var face = items.length ? faceParts(text) : { name: "선택할 항목이 없습니다", year: "" };
      name.textContent = face.name;
      year.textContent = face.year;
      year.hidden = !face.year;
      year.classList.remove("is-y26", "is-y27");
      if (/^27/.test(face.year)) year.classList.add("is-y27");
      else if (/^26/.test(face.year)) year.classList.add("is-y26");
      searchWrap.hidden = items.length <= 8;
      pastBtn.hidden = !items.some(function (item) { return item.offer === "ended"; });
      syncPastButtons();
      trigger.disabled = select.disabled;
      trigger.setAttribute("aria-disabled", select.disabled ? "true" : "false");
      if (select.required) trigger.setAttribute("aria-required", "true");
      trigger.removeAttribute("aria-labelledby");
      trigger.setAttribute("aria-label", kicker + " " + face.name + (face.year ? " " + face.year : "") + ". " + action);
      syncError();
    }

    function place() {
      box.classList.remove("is-up", "is-fixed");
      var anchor = pastBtn.hidden ? trigger : pastBtn;
      var rect = anchor.getBoundingClientRect();
      var below = window.innerHeight - rect.bottom;
      var above = rect.top;
      if (below < 280 && above > below) box.classList.add("is-up");
      var node = box.parentElement;
      var clipped = false;
      while (node && node !== document.body) {
        var style = window.getComputedStyle(node);
        if (/(auto|hidden|scroll|clip)/.test(style.overflowY + style.overflow)) {
          clipped = true;
          break;
        }
        node = node.parentElement;
      }
      if (clipped || rect.left < 8 || rect.right > window.innerWidth - 8) {
        box.classList.add("is-fixed");
        var left = Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8));
        panel.style.left = left + "px";
        panel.style.width = Math.min(rect.width, window.innerWidth - 16) + "px";
        if (box.classList.contains("is-up")) {
          panel.style.top = "auto";
          panel.style.bottom = (window.innerHeight - rect.top + 6) + "px";
        } else {
          panel.style.bottom = "auto";
          panel.style.top = (rect.bottom + 6) + "px";
        }
      } else {
        panel.style.left = "";
        panel.style.width = "";
        panel.style.top = "";
        panel.style.bottom = "";
      }
    }

    function close(restore) {
      if (panel.hidden) return;
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      box.classList.remove("is-open");
      if (openBox === box) openBox = null;
      if (restore) trigger.focus();
    }

    function includePast() {
      var host = document.getElementById("show-archive");
      if (select.getAttribute("data-pick-past") === "page" && host) return host.checked;
      return pastOn;
    }
    function syncPastButtons() {
      document.querySelectorAll(".bp-past-toggle").forEach(function (btn) {
        var on = pastOn;
        var owner = btn.closest(".bp-select");
        var native = owner && owner.querySelector("select");
        if (native && native.getAttribute("data-pick-past") === "page") {
          var host = document.getElementById("show-archive");
          if (host) on = host.checked;
        }
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.textContent = on ? "지난 연식 숨기기" : "지난 연식 보기";
      });
    }
    function paint(query) {
      var items = optionsOf(select);
      var q = String(query || "").trim().toLowerCase();
      var many = items.length > 8;
      var hasPast = items.some(function (item) { return item.offer === "ended"; });
      searchWrap.hidden = !many;
      pastBtn.hidden = !hasPast;
      syncPastButtons();
      list.textContent = "";
      if (!items.length) {
        countEl.hidden = true;
        empty.hidden = false;
        empty.textContent = "선택할 항목이 없습니다.";
        return;
      }
      function matches(item) {
        if (!q) return true;
        return (item.group + " " + item.text + " " + item.status).toLowerCase().indexOf(q) !== -1;
      }
      var matched = items.filter(matches);
      var visible = matched.filter(function (item) {
        return includePast() || item.offer !== "ended";
      });
      var pastOnly = !visible.length && matched.some(function (item) { return item.offer === "ended"; });
      countEl.hidden = !many && !hasPast;
      countEl.textContent = visible.length + "개";
      var count = 0;
      var lastGroup = null;
      visible.forEach(function (item) {
        count += 1;
        if (item.group && item.group !== lastGroup) {
          lastGroup = item.group;
          var title = document.createElement("p");
          title.className = "q-group";
          title.textContent = item.group;
          list.appendChild(title);
        }
        var chosen = select.selectedIndex >= 0 && select.options[select.selectedIndex] === item.option;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "q-option" + (item.offer === "ended" ? " is-past" : "");
        btn.setAttribute("role", "option");
        btn.setAttribute("aria-selected", chosen ? "true" : "false");
        btn.disabled = item.disabled;
        if (item.disabled) btn.setAttribute("aria-disabled", "true");
        var parts = faceParts(item.text);
        var tone = /MY27|27년식/.test(item.text) ? "is-y27" : (/MY26|26년식/.test(item.text) ? "is-y26" : "");
        if (tone) btn.classList.add(tone);
        var main = document.createElement("span");
        main.className = "q-option-main";
        var nameSpan = document.createElement("span");
        nameSpan.className = "q-option-name";
        nameSpan.textContent = item.text.indexOf(" · ") === -1 ? item.text : parts.name;
        main.appendChild(nameSpan);
        if (parts.year) {
          var yearSpan = document.createElement("span");
          yearSpan.className = "q-option-year" + (tone ? " " + tone : "");
          yearSpan.textContent = parts.year;
          main.appendChild(yearSpan);
        }
        if (item.offer === "ended") {
          var badge = document.createElement("span");
          badge.className = "q-past-badge";
          badge.textContent = item.status || "재고 소진 · 종료된 프로모션";
          main.appendChild(badge);
        }
        var meta = document.createElement("span");
        meta.className = "q-option-meta";
        if (chosen) meta.innerHTML = CHECK;
        var metaText = document.createElement("span");
        var bits = [];
        if (chosen) bits.push("선택됨");
        metaText.textContent = bits.join(" ");
        meta.appendChild(metaText);
        btn.appendChild(main);
        if (bits.length) btn.appendChild(meta);
        btn.addEventListener("mousedown", function (event) { event.preventDefault(); });
        btn.addEventListener("click", function () {
          if (item.disabled) return;
          select.value = item.value;
          /* 사용자가 직접 고른 변경임을 알립니다(측정과 기본값 설정을 구분). */
          select.__bpUser = true;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          select.__bpUser = false;
          refresh();
          close(true);
        });
        list.appendChild(btn);
      });
      empty.hidden = count !== 0;
      empty.textContent = pastOnly
        ? "지금 고를 수 있는 검색 결과가 없습니다. 지난 연식 보기를 누르면 이전 조건을 확인할 수 있습니다."
        : "검색 결과가 없습니다.";
    }

    function open() {
      if (trigger.disabled) return;
      if (openBox && openBox !== box) openBox._close(false);
      place();
      panel.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      box.classList.add("is-open");
      openBox = box;
      search.value = "";
      paint("");
      /* 터치 기기에서는 목록부터 보여 줍니다. 검색 칸은 사용자가 직접 눌러야 키보드가 열립니다. */
      var touchFirst = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      if (!searchWrap.hidden && !touchFirst) search.focus();
      else {
        var current = list.querySelector('[aria-selected="true"]:not(:disabled)') || list.querySelector(".q-option:not(:disabled)");
        if (current) {
          current.focus({ preventScroll: true });
          if (current.scrollIntoView) current.scrollIntoView({ block: "nearest" });
        } else {
          panel.tabIndex = -1;
          panel.focus({ preventScroll: true });
        }
      }
    }

    trigger.addEventListener("click", function () {
      if (trigger.getAttribute("aria-expanded") === "true") close(true);
      else open();
    });
    trigger.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        open();
      }
    });
    pastBtn.addEventListener("mousedown", function (event) { event.preventDefault(); });
    pastBtn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var next = !includePast();
      pastOn = next;
      var host = document.getElementById("show-archive");
      if (host) host.checked = next;
      syncPastButtons();
      boxes.forEach(function (other) {
        if (other._paint) other._paint(other._query ? other._query() : "");
      });
    });
    search.addEventListener("input", function () { paint(search.value); });
    search.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowDown") return;
      var first = list.querySelector(".q-option:not(:disabled)");
      if (!first) return;
      event.preventDefault();
      first.focus();
    });
    panel.addEventListener("keydown", function (event) {
      var options = list.querySelectorAll(".q-option:not(:disabled)");
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close(true);
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") return;
      if (!options.length) return;
      if (event.target === search && event.key !== "ArrowDown") return;
      event.preventDefault();
      var index = Array.prototype.indexOf.call(options, document.activeElement);
      if (event.key === "Home") index = 0;
      else if (event.key === "End") index = options.length - 1;
      else if (event.key === "ArrowDown") index = index < 0 ? 0 : Math.min(options.length - 1, index + 1);
      else index = index < 0 ? options.length - 1 : Math.max(0, index - 1);
      options[index].focus();
    });
    box.addEventListener("focusout", function (event) {
      if (panel.hidden) return;
      if (event.relatedTarget && box.contains(event.relatedTarget)) return;
      close(false);
    });

    var wrapLabel = select.closest("label");
    if (wrapLabel) {
      wrapLabel.addEventListener("click", function (event) {
        if (event.target.closest(".q-pick-panel, .bp-past-toggle")) return;
        event.preventDefault();
        if (event.target.closest(".q-pick-card") || trigger.disabled) return;
        trigger.focus();
        if (trigger.getAttribute("aria-expanded") !== "true") open();
      });
    }
    if (caption && !caption.contains(select)) {
      caption.addEventListener("click", function (event) {
        event.preventDefault();
        if (!trigger.disabled) {
          trigger.focus();
          open();
        }
      });
    }

    var scope = select.closest("[data-required], [data-question]") || box.parentElement;
    if (scope) {
      scope.querySelectorAll(".hp-error").forEach(function (message) {
        new MutationObserver(syncError).observe(message, { attributes: true, attributeFilter: ["class"] });
      });
    }
    new MutationObserver(refresh).observe(select, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled", "aria-invalid"] });
    select.addEventListener("change", refresh);
    box._close = close;
    box._place = place;
    box._refresh = refresh;
    box._paint = paint;
    box._query = function () { return search.value; };
    boxes.push(box);
    refresh();
  }

  function scan(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll("select"), enhance);
  }

  document.addEventListener("change", function (event) {
    if (!event.target || event.target.id !== "show-archive") return;
    pastOn = event.target.checked;
    boxes.forEach(function (box) {
      if (box._paint) box._paint(box._query ? box._query() : "");
    });
  });
  document.addEventListener("pointerdown", function (event) {
    if (!openBox || openBox.contains(event.target)) return;
    openBox._close(false);
  }, true);
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || !openBox) return;
    event.preventDefault();
    openBox._close(true);
  });
  window.addEventListener("resize", function () {
    if (openBox) openBox._place();
  });
  window.addEventListener("scroll", function () {
    if (openBox) openBox._place();
  }, true);
  document.addEventListener("click", function () {
    window.requestAnimationFrame(function () {
      boxes.forEach(function (box) { box._refresh(); });
    });
  }, true);

  function boot() { scan(document); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.BenzSelect = { scan: scan };
})();
