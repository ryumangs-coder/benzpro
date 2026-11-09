(function () {
  var bar = document.querySelector(".my27-bottom");
  var inner = bar && bar.querySelector(".my27-bottom-inner");
  var dock = document.querySelector("body > .bp-dock");
  if (inner && dock) inner.appendChild(dock);
  if (bar) {
    var setBarSize = function () {
      document.documentElement.style.setProperty(
        "--my27-bar-size", Math.ceil(bar.getBoundingClientRect().height) + "px"
      );
    };
    setBarSize();
    if ("ResizeObserver" in window) new ResizeObserver(setBarSize).observe(bar, { box: "border-box" });
    else window.addEventListener("resize", setBarSize);
  }

  document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
    var stage = gallery.querySelector("[data-gallery-stage]");
    var caption = gallery.querySelector("[data-gallery-caption]");
    var choices = Array.from(gallery.querySelectorAll("[data-gallery-choice]"));
    choices.forEach(function (choice, index) {
      choice.addEventListener("click", function () {
        stage.src = choice.dataset.src;
        stage.alt = choice.dataset.alt || choice.dataset.label;
        caption.textContent = choice.dataset.label;
        choices.forEach(function (item) {
          item.setAttribute("aria-pressed", String(item === choice));
        });
        stage.parentElement.dataset.activeIndex = String(index + 1);
      });
    });
  });
})();
