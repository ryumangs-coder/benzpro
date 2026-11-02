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
assert.equal(data.combinations.filter(r => api.searchMatches(r, 'GLB250')).length, data.combinations.filter(r => api.searchMatches(r, 'GLB 250')).length);
const marked = api.table([{...compact, accent:15}], 'fixture', false);
for (const bit of [1, 2, 4, 8]) assert.match(marked, new RegExp('ready-a' + bit));
assert.doesNotMatch(marked.replace(/href="[^"]*"/g, ''), /전시|위탁|핫카|1%/);
assert.match(marked, /<th scope="col">차 밖 색상/);
assert.match(marked, /<th scope="col">실내 색상/);
assert.doesNotMatch(api.card(data.combinations[0]), /<details|<li/);
for (const file of ['prices.html', 'quote.html', 'models.html', 'promotion.html', 'index.html']) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of html.matchAll(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!/ld\+json/.test(match[1])) new vm.Script(match[2], {filename:file});
  }
}
console.log(`Stock checks passed: ${data.combinations.length} combinations, public field allowlist, Korean colors, exact model/year/edition isolation, consultation context, HTML syntax.`);
