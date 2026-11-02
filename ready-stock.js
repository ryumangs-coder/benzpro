/* Consumer stock views share one dated, sanitized snapshot. */
(function () {
  function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function key(s) {
    s = String(s || '').toLowerCase().replace('mercedes-', '').replace(/coupé/g, 'coupe').replace(/with eq hybrid technology/g, '').replace(/with eq technology/g, '').replace(/\s+/g, ' ').trim();
    var aliases = {
      'c 200 amg line special edition': 'c 200 final edition',
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
  function swatch(text) {
    var parts = text.split('/'), colors = parts.map(tone).filter(function (c) { return c[0]; });
    if (!colors.length) colors = [tone(text)];
    var label = colors.map(function (c) { return c[1]; }).join(' / ');
    var fill = colors.length > 1 ? 'linear-gradient(135deg,' + colors[0][2] + ' 50%,' + colors[1][2] + ' 50%)' : colors[0][2];
    return '<span class="ready-color"><i aria-hidden="true" style="background:' + fill + '">' + (text.indexOf('상담 확인') >= 0 ? '?' : '') + '</i><span><b>' + esc(label) + '</b><small>' + esc(text) + '</small></span></span>';
  }
  function consult(r) {
    var note = r.name + ' ' + r.my + ' 즉시 출고 상담 · 외장 ' + r.exterior + ' · 내장 ' + r.interior;
    return 'index.html?' + new URLSearchParams({name:r.name, my:r.my, note:note}).toString() + '#consulting';
  }
  function combo(r) {
    return '<li class="ready-combo"><div><span class="ready-label">외장</span>' + swatch(r.exterior) + '</div><div><span class="ready-label">내장</span>' + swatch(r.interior) + '</div><a class="ready-ask" href="' + esc(consult(r)) + '">이 색상 조합으로 상담 예약 <span aria-hidden="true">→</span></a></li>';
  }
  function card(row) {
    if (!snapshot().asOf) return '';
    var rows = matches(row), date = snapshot().asOf.replace(/-/g, '.');
    if (!rows.length) return '<section class="ready-stock ready-empty"><b>출고 가능 조합을 상담으로 확인해 보세요</b><p>' + esc(date) + ' 재고표에서 즉시 출고 가능한 조합이 확인되지 않았습니다.</p></section>';
    var model = row.name || row[2], year = String(row.my || row[1]).replace(/MY(\d+)/, '20$1년식');
    return '<section class="ready-stock"><div class="ready-heading"><b>즉시 출고 가능 조합</b><span>' + rows.length + '가지 조합</span></div><p class="ready-model">' + esc(model) + ' · ' + esc(year) + '</p><p class="ready-date">' + esc(date) + ' 재고표 기준</p><p class="ready-lead">마음에 드는 내외장으로, 기다림을 줄여 보세요.</p><ul>' + rows.slice(0, 2).map(combo).join('') + '</ul>' + (rows.length > 2 ? '<details><summary>나머지 ' + (rows.length - 2) + '가지 색상 조합 보기</summary><ul>' + rows.slice(2).map(combo).join('') + '</ul></details>' : '') + '<p class="ready-note">계약 상황에 따라 달라질 수 있습니다. 상담 예약 시 재고와 실제 출고일을 최종 확인해 드립니다. 색상 아이콘은 이해를 돕는 참고색입니다.</p></section>';
  }
  function family(rows) {
    var available = rows.filter(function (r) { return matches(r).length; });
    return available.length ? '<div class="ready-family"><b>즉시 출고 가능 내외장 조합 확인</b><p>' + available.length + '개 트림의 색상 조합이 있습니다.</p><a href="prices.html#ready-stock-catalogue">출고 가능 차량과 색상 찾아보기 →</a></div>' : '';
  }
  window.BenzReadyStock = {matches:matches, card:card, family:family, key:key, swatch:swatch};
  function mount() {
    var host = document.getElementById('ready-stock-catalogue');
    if (!host) return;
    host.innerHTML = '<details class="ready-catalogue"><summary>즉시 출고 가능한 차량 · 내외장 조합 전체 보기</summary><p class="ready-note">' + esc(snapshot().asOf) + ' 재고표 기준. 원하는 차종이나 색상으로 찾아보세요.</p><label>차종·색상 검색<input type="search" placeholder="예: E 200, 베이지, 화이트" aria-label="출고 가능 차량과 색상 검색"></label><p class="ready-results" aria-live="polite"></p><div class="ready-catalogue-grid"></div></details>';
    var details = host.querySelector('details'), input = host.querySelector('input'), grid = host.querySelector('.ready-catalogue-grid');
    function render() {
      var query = input.value.toLowerCase().trim();
      var rows = snapshot().combinations.filter(function (r) { return (r.name + ' ' + r.my + ' ' + r.exterior + ' ' + r.interior + ' ' + tone(r.exterior)[1] + ' ' + tone(r.interior)[1]).toLowerCase().indexOf(query) >= 0; });
      var groups = {};
      rows.forEach(function (r) { var k = r.name + ' ' + r.my; if (!groups[k]) groups[k] = []; groups[k].push(r); });
      host.querySelector('.ready-results').textContent = rows.length ? rows.length + '가지 색상 조합' : '해당 조합이 없습니다. 차종이나 색상 이름을 바꿔 보세요.';
      grid.innerHTML = Object.keys(groups).map(function (k) { return '<section class="ready-stock"><h3>' + esc(k.replace(/MY(\d+)/, '20$1년식')) + '</h3><ul>' + groups[k].map(combo).join('') + '</ul></section>'; }).join('');
    }
    input.addEventListener('input', render);
    details.addEventListener('toggle', function () { if (details.open) render(); });
  }
  if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', mount);
})();
