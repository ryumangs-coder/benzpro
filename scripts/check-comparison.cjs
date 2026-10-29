/* Run with Node: regression checks for actual comparison data and renderer helpers. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = { window: {}, document: { addEventListener() {}, getElementById() { return null; }, readyState: 'loading' } };
vm.createContext(context);
for (const file of ['october-2026.js', 'guide-data.js', 'approach-specs.js', 'preorder-guides.js', 'spec-fill.js', 'spec-updates.js', 'compare-specs.js', 'tech-data.js', 'compare-visual.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const html = fs.readFileSync(path.join(root, 'models.html'), 'utf8');
const functions = html.slice(html.indexOf('        function normName('), html.indexOf('        function hasPair(')) +
  html.slice(html.indexOf('        function nameHas('), html.indexOf('        function gearState('));
vm.runInContext(functions, context);
const models = context.window.OCTOBER_2026.models.map(r => ({my: r[1], name: r[2], seg: r[0]}));
function result(row) {
  const guide = context.guideOf(row);
  return context.mergedSpecs(guide && guide.specs, row).rows;
}
function specs(name, my = 'MY26') {
  const row = models.find(r => r.name === name && r.my === my);
  assert.ok(row, `${my} ${name} must exist`);
  return Object.fromEntries(result(row).map(p => [p[0], p[1]]));
}
let ordinary = 0;
for (const row of models) {
  const pairs = result(row);
  assert.equal(new Set(pairs.map(p => p[0])).size, pairs.length, `Duplicate labels: ${row.name}`);
  if (/^(C 200|E (200|220|300|350|450)|CLE (200|450))\b/.test(row.name)) {
    assert.equal(Object.fromEntries(pairs)['변속기'], '9G-TRONIC', `${row.my} ${row.name}`);
    ordinary++;
  }
}
assert.ok(ordinary > 30);
assert.equal(specs('AMG A 45 S 4MATIC+')['변속기'], 'AMG SPEEDSHIFT DCT 8G');
assert.equal(specs('AMG GLC 43 4MATIC Coupé')['변속기'], 'AMG SPEEDSHIFT MCT 9G');
assert.equal(specs('AMG CLE 53 4MATIC+ Coupé')['변속기'], 'AMG SPEEDSHIFT TCT 9G');
assert.equal(specs('AMG GT 43')['변속기'], 'AMG SPEEDSHIFT MCT 9G');
assert.equal(specs('AMG GT 43 4MATIC+')['변속기'], 'AMG SPEEDSHIFT TCT 9G');
assert.equal(specs('A 220 Sedan')['길이'], '4,560mm');
assert.equal(specs('A 220 Hatch')['길이'], '4,430mm');
const ev = specs('CLA 200 electric Essential', 'MY27');
assert.equal(ev['길이'], '4,723mm');
assert.equal(ev['변속기'], '2단 변속기');
assert.equal(ev['연료'], '전기');
assert.equal(ev['연료탱크'], undefined);
const electricGLC = specs('GLC 300 4MATIC electric', 'MY27');
assert.equal(electricGLC['길이'], '4,845mm');
assert.equal(electricGLC['휠베이스'], '2,972mm');
assert.equal(electricGLC['모터 최고출력'], '310kW');
assert.equal(electricGLC['최대토크'], '81.6kg·m');
assert.equal(electricGLC['1회 충전 주행거리'], '448km');
assert.equal(electricGLC['WLTP 주행거리'], '523–616km');
assert.equal(electricGLC['트렁크'], '570–1,740L');
assert.equal(electricGLC['전면 트렁크'], '128L');
assert.equal(specs('AMG GLC 53 4MATIC+', 'MY27')['배기량'], '2,999cc');
assert.equal(specs('AMG GLC 53 4MATIC+', 'MY27')['변속기'], 'AMG SPEEDSHIFT TCT 9G');
// MY27 PDF numbers must not silently fill different years.
assert.equal(specs('CLE 450 4MATIC Cabriolet')['트렁크'], undefined);
assert.equal(specs('CLE 450 4MATIC Cabriolet', 'MY27')['트렁크'], '295–385L');
const fuelFallback = context.mergedSpecs([['연료', '확인 필요']], {my:'MY26',name:'C 200 Avantgarde'}).rows;
assert.equal(fuelFallback.find(p => p[0] === '연료')[1], '가솔린');
const glb = result(models.find(r => r.name === 'GLB 250+ electric'));
assert.match(glb.find(p => p[0] === '배터리')[2].url, /media\.mercedes-benz\.com/);
const glbImage = context.window.BenzVisual.modelInfo({name:'GLB 250+ electric',my:'MY27',seg:'Compact'});
assert.match(glbImage.trim.front, /^https:\/\/api\.media\.mercedes-benz\.com\//);
const cs = context.window.BenzSpecs;
const reference = {by:'제조사 해외 참고', reference:true};
assert.equal(cs.row('0-100km/h','4.2초','5초',reference,null,{my:'MY27',pt:'gas'},{my:'MY27',pt:'gas'},false).judge.type, 'stop');
assert.equal(cs.row('변속기','9G-TRONIC','자동 9단',null,null,{my:'MY27',pt:'gas'},{my:'MY27',pt:'gas'},false).judge.type, 'same');
const hiddenSource = cs.row('변속기','9G-TRONIC','9G-TRONIC',{by:'HS효성 더클래스 송파 어프로치북 · 8쪽'},{by:'출처 없음'}, {my:'MY27',pt:'gas'},{my:'MY27',pt:'gas'},false).html;
assert.doesNotMatch(hiddenSource, /송파|어프로치북|출처 기록 없음/);
assert.doesNotMatch(html, /어프로치북/);
assert.equal(context.tidyGearbox('AMG SPEEDSHIFT DCT 7G'), 'AMG SPEEDSHIFT DCT 7G');
console.log(`Comparison checks passed: ${models.length} trims, ${ordinary} ordinary C/E/CLE variants, AMG gearboxes, EV isolation, year scoping, fallback and source metadata.`);
