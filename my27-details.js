(function () {
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
