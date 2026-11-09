const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c={window:{},document:{addEventListener(){}}};vm.createContext(c);for(const f of ['vehicle-catalogue.js','november-finance.js','october-2026.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c);
const cat=c.window.BenzCatalogue,fin=c.window.BenzFinance;
for(const [name,my,zero] of [
['C 200 Avantgarde','MY26',true],['C 200 AMG Line Special Edition','MY26',true],['C 200 AMG Line Special Edition','MY27',false],['E 200 Exclusive','MY27',true],['E 300 4MATIC Exclusive','MY27',false],
['GLB 250 4MATIC','MY26',true],['GLB 250+ electric','MY27',false],['GLC 300 4MATIC','MY27',false],['GLC 300 4MATIC Coupé AMG Line','MY27',true],
['AMG G 63 MANUFAKTUR','MY27',true],['AMG GLS 63 4MATIC+','MY27',false],['GLS 580 4MATIC','MY26',true],['EQE 350+ SUV','MY26',true],['EQA 250 AMG Line','MY27',false]])assert.equal(fin.of({name,my}).zero24,zero,`${my} ${name}`);
assert.equal(cat.family({name:'AMG GLC 43 4MATIC'}),'GLC');assert.equal(cat.family({name:'CLE 200 Coupé'}),'CLE');assert.equal(cat.model({name:'GLE 450 d 4MATIC Coupé'}),'GLE 450d');assert.equal(cat.model({name:'GLB 250+ electric'}),'GLB 250+');
for(const r of c.window.OCTOBER_2026.models){const state={family:cat.family(r),model:cat.model(r),year:r[1],kind:cat.kind(r),body:cat.body(r)};assert.ok(cat.matches(r,state));assert.doesNotMatch(cat.filters([r],state,true),/undefined|NaN/);assert.equal(fin.of(r).monthlySupport,0);}
assert.ok(!cat.matches({name:'CLE 200 Coupé',my:'MY27'},{family:'E'}));
const pre = fs.readFileSync('index.html','utf8').split('data-preorder-carousel')[1].split('</section>')[0];
assert.deepEqual([...pre.matchAll(/<a class="preorder-slide"[^>]* href="([^"]+)"/g)].map(x => x[1]),
  ['/gle-my27', '/gls-my27', 'preorder.html#vclass', 'preorder.html#glb', 'preorder.html#glc', 'preorder.html#cla']);
assert.deepEqual([...pre.matchAll(/data-pre-index="(\d+)"[^>]*>([^<]+)/g)].map(x => [Number(x[1]), x[2]]),
  [[0,'GLE'], [1,'GLS'], [2,'V클래스'], [3,'GLB'], [4,'GLC'], [5,'CLA']]);
assert.match(pre,/data-pre-pause/);
const promo=fs.readFileSync('promo-tabs.js','utf8');assert.match(promo,/#offer-/);assert.match(promo,/params.set\("my",bestRow\[1\]\)/);assert.match(promo,/prices\\.html\\\?/);
const golden=fs.readFileSync('golden.html','utf8');assert.match(golden,/선물은 차량 출고 후 다음 달 중순/);assert.doesNotMatch(golden,/선물은 판매 완료 다음 달/);
console.log('Vehicle navigation: model/year/line/body isolation for 153 trims; exact finance badge eligibility incl. negatives; no monthly subsidy; carousel order/progress/pause; offer deep links; gift wording.');
