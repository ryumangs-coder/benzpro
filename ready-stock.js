/* Consumer stock views share one dated, sanitized snapshot. */
(function () {
  function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function key(s) {
    s = String(s || '').toLowerCase().replace('mercedes-', '').replace(/coupé/g, 'coupe').replace(/with eq hybrid technology/g, '').replace(/with eq technology/g, '').replace(/\s+/g, ' ').trim();
    var aliases = {
      'c 200 final edition': 'c 200 amg line special edition',
      'amg e 53 hybrid 4matic+': 'amg e 53 4matic+',
      'e 220 d 4matic exclusive': 'e 220 d 4matic',
      'e 220 d 4matic avantgarde': 'e 220 d 4matic',
      'cle 200 coupe amg line': 'cle 200 coupe',
      'cle 200 cabriolet amg line': 'cle 200 cabriolet',
      'cle 450 4matic coupe amg line': 'cle 450 coupe',
      'cle 450 4matic coupe': 'cle 450 coupe',
      'gle 450 4matic coupe amg line': 'gle 450 4matic coupe',
      'gle 450 4matic amg line coupe': 'gle 450 4matic coupe',
      'gle 450 d 4matic coupe amg line': 'gle 450 d 4matic coupe',
      'gls 450 d 4matic amg line': 'gls 450 d 4matic',
      'gls 580 4matic amg line': 'gls 580 4matic',
      'amg gt 55 4matic+ coupe': 'amg gt 55 4matic+',
      'maybach sl 680 monogram series': 'maybach sl 680'
    };
    return aliases[s] || s;
  }
  function snapshot() { return window.BENZ_READY_STOCK || {asOf:'', combinations:[]}; }
  function matches(row) {
    var name = row && (row.name || row[2]), my = row && (row.my || row[1]);
    return snapshot().combinations.filter(function (r) { return key(name) === key(r.name) && my === r.my; });
  }
  var tones = [
    ['라벤더', '연보라빛 은색', '#b9b4c6'], ['화이트', '흰색', '#f6f4ed'], ['베이지', '베이지색', '#d9c5a4'],
    ['블랙', '검정색', '#242629'], ['그레이', '회색', '#85888b'], ['실버', '은색', '#c4c9cc'],
    ['블루', '파란색', '#29486e'], ['레드', '빨간색', '#99343b'], ['그린', '초록색', '#376752'],
    ['브라운', '갈색', '#805b40'], ['자바', '갈색', '#8e6041'], ['토바코', '갈색', '#845c42'],
    ['헬리오스', '베이지색', '#d7c6a5']
  ];
  function tone(text) {
    for (var i = 0; i < tones.length; i++) if (text.indexOf(tones[i][0]) >= 0) return tones[i];
    return ['', '색상 상담 확인', '#dedede'];
  }
  function colorName(text) {
    var name = text.replace(/마누팍투어|마이바흐|익스클루시브|AMG 라인 플러스|AMG|아티코|인조 가죽|나파 가죽|마이크로컷 마이크로파이버|마이크로파이버|다이나미카|가죽|레더|투톤/g, '').replace(/\s+/g, ' ').replace(/^[\s,\/]+|[\s,\/]+$/g, '').replace(/\s*\/\s*/g, ' / ');
    return name || text;
  }
  function swatch(text) {
    var parts = text.split('/'), colors = parts.map(tone).filter(function (c) { return c[0]; });
    if (!colors.length) colors = [tone(text)];
    var label = colors.map(function (c) { return c[1]; }).join(' / ');
    var fill = colors.length > 1 ? 'linear-gradient(135deg,' + colors[0][2] + ' 50%,' + colors[1][2] + ' 50%)' : colors[0][2];
    return '<span class="ready-color" title="' + esc(text) + '"><i aria-hidden="true" style="background:' + fill + '">' + (text.indexOf('상담 확인') >= 0 ? '?' : '') + '</i><span><b>' + esc(label) + '</b><small>' + esc(colorName(text)) + '</small></span></span>';
  }
  function consult(r) {
    var note = r.name + ' ' + r.my + ' 재고·출고 상담 · 외장 ' + r.exterior + ' · 내장 ' + r.interior;
    return 'index.html?' + new URLSearchParams({name:r.name, my:r.my, note:note}).toString() + '#consulting';
  }
  function searchText(text) { return String(text || '').normalize('NFKC').toLowerCase().replace(/\s+/g, ''); }
  function modelSearchMatches(name, query) {
    var family = /(?:^|[^a-z])(cla|cle|gla|glb|glc|gle|gls|eqa|eqb|eqe|eqs|gt|sl|[acegs])(\d{2,3})/;
    var asked = searchText(query).replace(/^mercedes-?/, '').replace(/^amg|^maybach/, '').match(family);
    var actual = searchText(name).replace(/^amg|^maybach/, '').match(family);
    return !asked || !!(actual && asked[1] === actual[1] && asked[2] === actual[2]);
  }
  function searchMatches(r, query) {
    if (!modelSearchMatches(r.name, query)) return false;
    var text = r.name + ' ' + r.my + ' ' + r.my.replace('MY', '20') + '년식 ' + r.exterior + ' ' + r.interior + ' ' + tone(r.exterior)[1] + ' ' + tone(r.interior)[1];
    return searchText(text).indexOf(searchText(query)) >= 0;
  }
  function combo(r) {
    var accent = Number(r.accent) || 0, classes = '', rails = '';
    [1, 2, 4, 8].forEach(function (bit) {
      if (accent & bit) classes += ' ready-a' + bit;
      rails += '<i class="ready-rail-' + bit + (accent & bit ? ' on' : '') + '"></i>';
    });
    var label = r.name + ' ' + r.my + ', 외장 ' + r.exterior + ', 실내 ' + r.interior + ' 조합으로 상담 예약';
    return '<tr class="ready-combo' + classes + '"><td><span class="ready-rails" aria-hidden="true">' + rails + '</span>' + swatch(r.exterior) + '</td><td>' + swatch(r.interior) + '</td><td><a class="ready-ask" aria-label="' + esc(label) + '" href="' + esc(consult(r)) + '">상담<span>예약</span></a></td></tr>';
  }
  function table(rows, label, grouped, years) {
    var previous = '';
    var body = years ? years.map(function (year) {
      var available = rows.filter(function (r) { return r.my === year; });
      if (!available.length) return '';
      return '<tr class="ready-group ready-year"><th colspan="3" scope="rowgroup">' + esc(year.replace('MY', '20')) + '년식</th></tr>' + available.map(combo).join('');
    }).join('') : rows.map(function (r) {
      var heading = '', name = r.name + ' · ' + r.my.replace('MY', '20') + '년식';
      if (grouped && previous !== name) { heading = '<tr class="ready-group"><th colspan="3" scope="rowgroup">' + esc(name) + '</th></tr>'; previous = name; }
      return heading + combo(r);
    }).join('');
    return '<div class="ready-table-block"><div class="ready-table-scroll' + (grouped ? ' ready-table-all' : '') + '" tabindex="0" role="region" aria-label="' + esc(label) + '"><table class="ready-table"><caption class="ready-sr">' + esc(label) + '</caption><thead><tr><th scope="col">차 밖 색상</th><th scope="col">실내 색상</th><th scope="col">상담</th></tr></thead><tbody>' + body + '</tbody></table></div><div class="ready-scroll-actions"><button type="button" class="ready-scroll-next"><span aria-hidden="true">↓</span> 아래 조합 더 보기</button><span class="ready-scroll-end" hidden>마지막 조합입니다</span><button type="button" class="ready-scroll-top" hidden>↑ 처음으로</button></div></div>';
  }
  function card(row) {
    if (!snapshot().asOf) return '';
    var model = row.name || row[2], selectedYear = row.my || row[1];
    var years = /^(MY26|MY27)$/.test(selectedYear) ? ['MY26', 'MY27'] : [selectedYear];
    var rows = snapshot().combinations.filter(function (r) { return key(model) === key(r.name) && years.indexOf(r.my) >= 0; });
    var date = snapshot().asOf.replace(/-/g, '.');
    if (!rows.length) return '<section class="ready-stock ready-empty"><b>표시할 색상 조합이 없습니다</b><p class="ready-model">' + esc(model) + ' · ' + esc(selectedYear) + '</p><p>' + esc(date) + ' 재고표 기준</p></section>';
    return '<section class="ready-stock"><div class="ready-heading"><b>외장·실내 색상 조합</b></div><p class="ready-model">' + esc(model) + '</p><p class="ready-date">' + esc(date) + ' 재고표 기준 · 연식별로 확인하세요</p>' + (matches(row).length ? '' : '<p class="ready-date">' + esc(selectedYear) + ' · 표시할 색상 조합이 없습니다</p>') + table(rows, model + ' 연식별 외장·실내 색상 조합', false, years) + '<p class="ready-disclaimer">배정 가능 여부와 출고 일정은 상담에서 확인해 주세요.</p></section>';
  }
  function family(rows) {
    var available = rows.filter(function (r) { return matches(r).length; });
    return available.length ? '<div class="ready-family"><b>외장·실내 색상 조합 확인</b><a href="prices.html#ready-stock-catalogue">차종별 색상 찾아보기 →</a></div>' : '';
  }
  window.BenzReadyStock = {matches:matches, card:card, family:family, key:key, swatch:swatch, searchMatches:searchMatches, modelSearchMatches:modelSearchMatches, table:table};
  function mountScrollControls() {
    var observers = new Map(), scheduled = false;
    function update(block, pane) {
      var overflow = pane.scrollHeight > pane.clientHeight + 3;
      var more = overflow && pane.scrollTop + pane.clientHeight < pane.scrollHeight - 3;
      block.querySelector('.ready-scroll-actions').hidden = !overflow;
      block.querySelector('.ready-scroll-next').hidden = !more;
      block.querySelector('.ready-scroll-end').hidden = more;
      block.querySelector('.ready-scroll-top').hidden = pane.scrollTop < 5;
      block.classList.toggle('ready-has-more', more);
    }
    function scan() {
      scheduled = false;
      observers.forEach(function (observer, pane) { if (!pane.isConnected) { if (observer) observer.disconnect(); observers.delete(pane); } });
      document.querySelectorAll('.ready-table-block').forEach(function (block) {
        var pane = block.querySelector('.ready-table-scroll');
        if (!observers.has(pane)) {
          var callback = function () { update(block, pane); };
          pane.addEventListener('scroll', callback, {passive:true});
          var observer = typeof ResizeObserver === 'function' ? new ResizeObserver(callback) : null;
          if (observer) observer.observe(pane);
          observers.set(pane, observer);
        }
        update(block, pane);
      });
    }
    document.addEventListener('click', function (event) {
      var button = event.target.closest('.ready-scroll-next, .ready-scroll-top');
      if (!button) return;
      var pane = button.closest('.ready-table-block').querySelector('.ready-table-scroll');
      var top = button.classList.contains('ready-scroll-top') ? 0 : pane.scrollTop + Math.max(100, pane.clientHeight - 60);
      pane.scrollTo({top:top, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    });
    new MutationObserver(function () { if (!scheduled) { scheduled = true; requestAnimationFrame(scan); } }).observe(document.body, {childList:true, subtree:true});
    scan();
  }
  function mount() {
    var host = document.getElementById('ready-stock-catalogue');
    if (!host) return;
    host.innerHTML = '<details class="ready-catalogue"><summary>외장·실내 색상표 보기</summary><p class="ready-note">' + esc(snapshot().asOf) + ' 재고표 기준. 한 줄은 차 밖·실내 색상 조합입니다. 배정 가능 여부와 출고 일정은 상담에서 확인해 주세요.</p><label>차종·색상 검색<input type="search" placeholder="예: GLB250, E200, 베이지" aria-label="차종별 색상 검색"></label><p class="ready-results" aria-live="polite"></p><div class="ready-catalogue-grid"></div><p class="ready-scroll-hint">표 안을 아래로 내려 더 보세요. 원하는 색상 줄에서 상담 예약을 누르시면 됩니다.</p></details>';
    var details = host.querySelector('details'), input = host.querySelector('input'), grid = host.querySelector('.ready-catalogue-grid');
    function render() {
      var rows = snapshot().combinations.filter(function (r) { return searchMatches(r, input.value); });
      host.querySelector('.ready-results').textContent = rows.length ? '색상 조합을 찾았습니다.' : '검색 조건에 맞는 색상 조합이 없습니다.';
      grid.innerHTML = rows.length ? table(rows, '전체 차종 외장·실내 색상 조합', true) : '';
    }
    input.addEventListener('input', render);
    details.addEventListener('toggle', function () { if (details.open) render(); });
  }
  if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', function () { mount(); mountScrollControls(); });
})();
