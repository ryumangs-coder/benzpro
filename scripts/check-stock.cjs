const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const c = {window: {}, URLSearchParams};
vm.createContext(c);
for (const name of ['ready-stock-data.js', 'ready-stock.js', 'stock.js', 'october-2026.js']) vm.runInContext(fs.readFileSync(path.join(root, name), 'utf8'), c);
const api = c.window.BenzReadyStock, data = c.window.BENZ_READY_STOCK;
assert.match(data.asOf, /^\d{4}-\d{2}-\d{2}$/);
for (const r of data.combinations) {
  assert.equal(Object.keys(r).sort().join(','), 'accent,count,exterior,interior,my,name');
  assert.ok(Number.isInteger(r.accent) && r.accent >= 0 && r.accent <= 15);
  assert.ok(r.count > 0 && Number.isInteger(r.count));
  assert.ok(!/[a-z]{3,}/.test(r.exterior + ' ' + r.interior));
  assert.ok(!/MEMO|VIN|전시장|위탁|배정|W1[K-N][A-Z0-9]{14}/.test(JSON.stringify(r)));
  assert.equal(c.window.BenzStock.of(r).code, 'live');
  assert.match(api.card(r), /상담 예약/);
  const notes = [...api.card(r).matchAll(/href="([^"]+)"/g)].map(m => new URL(m[1].replace(/&amp;/g, '&'), 'https://benzpro.co.kr/').searchParams.get('note'));
  assert.ok(notes.some(note => note.includes(r.exterior) && note.includes(r.interior)));
}
for (const row of c.window.OCTOBER_2026.models) assert.doesNotMatch(api.card(row), /undefined|NaN/);
// A separate model year, edition and engine configuration must never borrow stock.
assert.equal(api.matches({name:'GLB 250 4MATIC', my:'MY99'}).length, 0);
assert.equal(api.matches({name:'GLC 300 4MATIC AMG Line (140주년)', my:'MY27'}).length, 0);
assert.notEqual(api.key('GLC 300 4MATIC electric'), api.key('GLC 300 4MATIC'));
assert.match(api.swatch('베이지/블랙'), /linear-gradient/);
assert.doesNotMatch(api.swatch('아티코 가죽/다이나미카 블랙'), /색상 상담 확인/);
assert.match(api.swatch('색상 상담 확인'), /\?/);
const compact = {name:'GLB 250 4MATIC', my:'MY26', exterior:'폴라 화이트', interior:'블랙'};
for (const q of ['GLB250', 'glb 250', 'GLB　250', 'ＧＬＢ２５０', 'GLB\t250']) assert.ok(api.searchMatches(compact, q), q);
assert.ok(api.searchMatches(compact, '2026년식'));
assert.ok(!api.searchMatches(compact, 'GLB350'));
const model = name => ({...compact, name});
for (const [query, yes, no] of [
  ['E200', 'E 200 Exclusive', 'CLE 200 Coupe'],
  ['E 200', 'E 200 AMG Line', 'GLE 200'],
  ['C200', 'C 200 AMG Line', 'GLC 200'],
  ['E450', 'E 450 4MATIC', 'GLE 450 4MATIC'],
  ['A250', 'A 250', 'GLA 250'],
  ['AMG E53', 'AMG E 53 HYBRID 4MATIC+', 'AMG GLE 53 4MATIC+'],
  ['CLE200', 'CLE 200 Coupe AMG Line', 'E 200 Exclusive']
]) {
  assert.ok(api.searchMatches(model(yes), query), `${query} should find ${yes}`);
  assert.ok(!api.searchMatches(model(no), query), `${query} must not find ${no}`);
}
assert.ok(data.combinations.filter(r => api.searchMatches(r, 'E200')).every(r => /^E 200\b/.test(r.name)));
assert.equal(data.combinations.filter(r => api.searchMatches(r, 'GLB250')).length, data.combinations.filter(r => api.searchMatches(r, 'GLB 250')).length);
const marked = api.table([{...compact, accent:15}], 'fixture', false);
for (const bit of [1, 2, 4, 8]) assert.match(marked, new RegExp('ready-a' + bit));
assert.match(marked, /class="ready-rails" aria-hidden="true"/);
for (const bit of [1, 2, 4, 8]) assert.match(marked, new RegExp('ready-rail-' + bit + ' on'));
const css = fs.readFileSync(path.join(root, 'ready-stock.css'), 'utf8');
assert.doesNotMatch(css, /\.ready-a[1248]\s/);
assert.match(css, /\.ready-rails\{/);
assert.doesNotMatch(marked.replace(/href="[^"]*"/g, ''), /전시|위탁|핫카|1%/);
assert.match(marked, /<th scope="col">차 밖 색상/);
assert.match(marked, /<th scope="col">실내 색상/);
assert.doesNotMatch(api.card(data.combinations[0]), /<details|<li/);
// Cross-year display must not turn another year's stock into the selected year's availability.
const fixture = [
  {...compact, my:'MY26', count:1, accent:0},
  {...compact, my:'MY27', exterior:'옵시디안 블랙', count:1, accent:0},
  {...compact, name:'GLB 250 4MATIC (140주년)', my:'MY27', count:1, accent:0}
];
c.window.BENZ_READY_STOCK = {asOf:data.asOf, combinations:fixture};
const bothYears = api.card(compact);
assert.match(bothYears, /2026년식 · 1가지 조합/);
assert.match(bothYears, /2027년식 · 1가지 조합/);
assert.equal(api.matches(compact).length, 1);
assert.doesNotMatch(bothYears, /140주년/);
const yearLinks = [...bothYears.matchAll(/href="([^"]+)"/g)].map(m => new URL(m[1].replace(/&amp;/g, '&'), 'https://benzpro.co.kr/').searchParams.get('my'));
assert.deepEqual(yearLinks, ['MY26', 'MY27']);
c.window.BENZ_READY_STOCK = {asOf:data.asOf, combinations:[fixture[0]]};
assert.doesNotMatch(api.card(compact), /2027년식/);
assert.doesNotMatch(api.card(compact), /0가지 조합/);
assert.equal(api.matches({...compact,my:'MY27'}).length, 0);
c.window.BENZ_READY_STOCK = data;
for (const [bit, color] of [[1,'#3b82f6'],[2,'#c99a36'],[4,'#ef4444'],[8,'#fff000']]) assert.ok(css.includes(`.ready-rail-${bit}.on{background:${color}}`));
for (const file of ['prices.html', 'quote.html', 'models.html', 'promotion.html', 'index.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!/ld\+json/.test(match[1])) new vm.Script(match[2], {filename:file});
  }
}
console.log(`Stock checks passed: ${data.combinations.length} combinations, public field allowlist, Korean colors, exact model/year/edition isolation, consultation context, HTML syntax.`);
