/* Decorative split-flap faces. The original heading stays available to AT. */
(function () {
  var heading = document.querySelector('#stock-board-title > span');
  if (!heading) return;

  var title = document.createElement('span');
  title.className = 'stock-flap-title';
  title.setAttribute('aria-hidden', 'true');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tiles = [];
  var previous = '0123456789';

  function face(side, letter, moving) {
    var panel = document.createElement('span');
    panel.className = 'stock-flap-half stock-flap-' + side + (moving ? ' stock-flap-' + moving : '');
    var ink = document.createElement('span');
    ink.textContent = letter;
    panel.append(ink);
    return panel;
  }

  heading.textContent.trim().split(/\s+/).forEach(function (word) {
    var group = document.createElement('span');
    group.className = 'stock-flap-word';
    Array.from(word).forEach(function (letter) {
      var tile = document.createElement('span');
      tile.className = 'stock-flap-tile';
      tile.style.setProperty('--flap-delay', tiles.length * 30 + 'ms');
      group.append(tile);
      tiles.push({ node: tile, letter: letter });
    });
    title.append(group);
  });

  function reveal(animate) {
    tiles.forEach(function (tile, index) {
      var old = animate ? previous[index % previous.length] : tile.letter;
      var lower = face('bottom', old);
      tile.node.replaceChildren(face('top', tile.letter), lower);
      if (!animate) return;

      var upperFlip = face('top', old, 'out');
      var lowerFlip = face('bottom', tile.letter, 'in');
      lowerFlip.addEventListener('animationend', function () {
        lower.replaceWith(face('bottom', tile.letter));
        upperFlip.remove();
        lowerFlip.remove();
      }, { once: true });
      tile.node.append(upperFlip, lowerFlip);
    });
  }

  heading.classList.add('ready-sr');
  heading.parentNode.append(title);
  reveal(!reducedMotion);
  var search = document.querySelector('#home-stock-list input');
  if (search && !reducedMotion) {
    var timer;
    search.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { reveal(true); }, 220);
    });
  }
})();
