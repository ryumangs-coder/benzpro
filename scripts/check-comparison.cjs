/* Run with Node: regression checks for actual comparison data and renderer helpers. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = { window: {}, document: { addEventListener() {}, getElementById() { return null; }, readyState: 'loading' } };
vm.createContext(context);
for (const file of ['october-2026.js', 'november-2026.js', 'guide-data.js', 'approach-specs.js', 'preorder-guides.js', 'spec-fill.js', 'spec-updates.js', 'compare-specs.js', 'tech-data.js', 'compare-visual.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const html = fs.readFileSync(path.join(root, 'models.html'), 'utf8');
const functions = html.slice(html.indexOf('        function normName('), html.indexOf('        function hasPair(')) +
  html.slice(html.indexOf('        function usefulOptions('), html.indexOf('        function gearState('));
vm.runInContext(functions, context);
const models = context.window.OCTOBER_2026.models.map(r => ({my: r[1], name: r[2], seg: r[0]}));
function result(row) {
  const guide = context.featureRecord(row).spec;
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
assert.equal(specs('CLE 450 4MATIC Cabriolet')['트렁크'], '295–385L');
assert.equal(specs('CLE 450 4MATIC Cabriolet')['공차중량'], '2,025kg');
assert.ok(specs('AMG E 53 4MATIC+', 'MY27')['공차중량']);
assert.equal(specs('CLE 450 4MATIC Cabriolet', 'MY27')['트렁크'], '295–385L');
const fuelFallback = context.mergedSpecs([['연료', '확인 필요']], {my:'MY26',name:'C 200 Avantgarde'}).rows;
assert.equal(fuelFallback.find(p => p[0] === '연료')[1], '가솔린');
const glb = result(models.find(r => r.name === 'GLB 250+ electric'));
assert.match(glb.find(p => p[0] === '배터리')[2].url, /media\.mercedes-benz\.com/);
const glbImage = context.window.BenzVisual.modelInfo({name:'GLB 250+ electric',my:'MY27',seg:'Compact'});
assert.match(glbImage.trim.front, /^https:\/\/api\.media\.mercedes-benz\.com\//);
const cs = context.window.BenzSpecs;
const reference = {by:'제조사 해외 참고', reference:true};
assert.equal(cs.row('0-100km/h','4.2초','5초',reference,null,{my:'MY27',pt:'gas'},{my:'MY27',pt:'gas'},false).judge.type, 'plain');
assert.equal(cs.row('변속기','9G-TRONIC','자동 9단',null,null,{my:'MY27',pt:'gas'},{my:'MY27',pt:'gas'},false).judge.type, 'same');
const hiddenSource = cs.row('변속기','9G-TRONIC','9G-TRONIC',{by:'HS효성 더클래스 송파 어프로치북 · 8쪽'},{by:'출처 없음'}, {my:'MY27',pt:'gas'},{my:'MY27',pt:'gas'},false).html;
assert.doesNotMatch(hiddenSource, /송파|어프로치북|출처 기록 없음/);
assert.doesNotMatch(html, /어프로치북/);
assert.equal(context.tidyGearbox('AMG SPEEDSHIFT DCT 7G'), 'AMG SPEEDSHIFT DCT 7G');
console.log(`Comparison checks passed: ${models.length} trims, ${ordinary} ordinary C/E/CLE variants, AMG gearboxes, EV isolation, year scoping, fallback and source metadata.`);

// All marketed pairs: both cells must render, preserve values and reject unsupported comparisons.
const datasets = models.map((r, i) => {
  const pairs = result(r);
  const map = Object.fromEntries(pairs.map(p => [p[0], {text:p[1], src:p[2]}]));
  assert.ok(map['최고출력'], `Missing power: ${r.my} ${r.name}`);
  return {row:r, pairs, map, ctx:cs.ctx(r, map)};
});
let comparisons = 0, cells = 0;
for (let a = 0; a < datasets.length; a++) {
  for (let b = a; b < datasets.length; b++) {
    const x = datasets[a], y = datasets[b];
    for (const label of new Set([...Object.keys(x.map), ...Object.keys(y.map)])) {
      const left = x.map[label], right = y.map[label];
      const view = context.harmonize(label, left?.text, right?.text);
      const va = cs.displayValue(label, view.a, x.ctx);
      const vb = cs.displayValue(label, view.b, y.ctx);
      const rendered = cs.row(label, va, vb, left?.src, right?.src, x.ctx, y.ctx, a === b);
      assert.equal((rendered.html.match(/class="sp-v /g) || []).length, 2);
      assert.doesNotMatch(rendered.html, /<b>\s*<\/b>|undefined|NaN/);
      if (/확인 필요|해당 없음|미공개/.test(va + vb)) assert.notEqual(rendered.judge.type, 'win');
      if (left) assert.equal(view.a, context.tidySpec(label, left.text));
      if (right) assert.equal(view.b, context.tidySpec(label, right.text));
      cells += 2;
    }
    comparisons++;
  }
}
assert.equal(context.canonSpec('승차정원'), '승차 정원');
assert.equal(context.canonSpec('연료 탱크'), '연료탱크');
assert.equal(context.harmonize('트렁크','540L','540–1715L').a, '540L');
assert.equal(context.harmonize('트렁크','540L','540–1715L').b, '540–1,715L');
assert.equal(specs('E 200 Exclusive')['연료탱크'], '66L');
assert.equal(specs('E 200 AMG Line')['승차 정원'], '5인승');
assert.equal(specs('GLB 250+ electric', 'MY27')['최고출력'], '271.9ps (모터 출력 환산)');
assert.equal(specs('GLE 450 4MATIC')['최고출력'], '381ps');
assert.equal(specs('GLE 450 4MATIC Coupé')['공차중량'], '2,325kg');
assert.equal(specs('GLE 450 d 4MATIC Coupé')['공차중량'], '2,390kg');
console.log(`All-pair rendering checks: ${comparisons} combinations including self, ${cells} non-empty cells. Unknown data remains explicitly identified.`);
if (process.argv.includes('--audit')) {
  const labels = [...new Set(datasets.flatMap(d => Object.keys(d.map)))].sort();
  const escape = v => '"' + String(v).replace(/"/g, '""') + '"';
  const records = [['연식','차량',...labels], ...datasets.map(d => [d.row.my,d.row.name,...labels.map(l => d.map[l]?.text || cs.displayValue(l, '', d.ctx))])];
  fs.writeFileSync(path.join(root,'docs/spec-audit.csv'), '\ufeff' + records.map(r=>r.map(escape).join(',')).join('\n') + '\n');
}

assert.equal(cs.row('트렁크','540L','540–1715L',null,null,{my:'MY26',pt:'gas'},{my:'MY26',pt:'gas'},false).judge.type, 'ref');

// MY27 must preserve every resolved MY26 field, including supplemental rules.
for (const row of models.filter(r => r.my === 'MY27' && !/^(CLA\b|GLB\b.*electric|GLC\b.*electric)/i.test(r.name))) {
  const prior = models.find(r => r.my === 'MY26' && r.name === row.name);
  if (!prior) continue;
  const latest = specs(row.name, 'MY27');
  for (const pair of result(prior)) assert.ok(latest[pair[0]], `MY26 field lost: ${row.name}: ${pair[0]}`);
}
for (const name of ['E 200 Exclusive', 'E 300 4MATIC AMG Line', 'CLE 450 Coupé']) {
  const values = specs(name, 'MY27');
  for (const label of ['공차중량','연료탱크','승차 정원']) assert.ok(values[label], `${name}: ${label}`);
}
console.log('MY27 fully resolved MY26 carryover regression checks passed.');

const coreLabels=['길이','너비','높이','휠베이스','배기량','연료','변속기','구동','최고출력','최대토크','복합연비','연료탱크','트렁크','공차중량','승차 정원','타이어'];
let carriedTrims=0;
for(const row of models.filter(r=>r.my==='MY27'&&!/^(CLA\b|GLB\b.*electric|GLC\b.*electric)/i.test(r.name))){
 const map=specs(row.name,'MY27');
 for(const label of coreLabels){
  if(map['연료']==='전기' && ['배기량','연료탱크'].includes(label))continue;
  assert.ok(map[label]&&!/확인 필요|정보가 아직/.test(map[label]), `MY27 core missing: ${row.name} ${label}`);
 }
 carriedTrims++;
}
console.log(`${carriedTrims} carryover MY27 trims: all 16 core fields populated or inapplicable.`);
