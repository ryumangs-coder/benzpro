/* Roll the verified stock text once when the board comes into view. */
document.addEventListener('DOMContentLoaded', function () {
  var board = document.getElementById('stock-board');
  if (!board || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function roll() {
    board.querySelectorAll('.hp-featured-stock tbody tr').forEach(function (row, index) {
      row.querySelectorAll('th strong, th small, .ready-color small').forEach(function (field, column) {
        var clip = document.createElement('span');
        var face = document.createElement('span');
        clip.className = 'hp-stock-roll';
        clip.style.setProperty('--stock-delay', (index * 85 + column * 35) + 'ms');
        face.textContent = field.textContent;
        clip.append(face);
        field.replaceChildren(clip);
      });
    });
    board.classList.add('hp-stock-is-rolling');
  }

  if (!('IntersectionObserver' in window)) {
    roll();
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
    observer.disconnect();
    roll();
  }, { threshold: 0.2 });
  observer.observe(board);
});
