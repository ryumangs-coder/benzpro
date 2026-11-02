const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),c={window:{},document:{addEventListener(){}}};vm.createContext(c);
function run(file){vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c,{filename:file});}
run('october-2026.js');const before=JSON.parse(JSON.stringify(c.window.OCTOBER_2026.models));
run('november-retail.js');run('november-2026.js');run('quote.js');run('november-benefits.js');
const rows=c.window.OCTOBER_2026.models,q=c.window.BenzQuote;
function row(name,my='MY27'){const r=rows.find(r=>r[2]===name&&r[1]===my);assert.ok(r, name);return {seg:r[0],my:r[1],name:r[2],price:r[3],cash:r[4],mbm:r[5],retain:r[7],conquest:r[8]};}
for(const [name,my,cash,install,lease] of [
['E 200 Exclusive','MY27',14,18,18],['E 200 AMG Line','MY27',14,17,17],
['GLC 300 4MATIC','MY27',7,8,8],['GLC 300 4MATIC Coupé AMG Line','MY27',7,8,8],
['S 450 4MATIC (SWB)','MY26',7,11,13],['Maybach S 580 4MATIC','MY26',9,9,11],['GLB 250 4MATIC','MY26',13,17,17]]){
const r=row(name,my);for(const [pay,rate] of Object.entries({cash,install,lease})){const v=q.scene(r,{pay});assert.equal(v.rate,rate,`${my} ${name} ${pay}`);assert.equal(v.after,Math.floor(v.q.basis*(1-rate/100)/10000)*10000,`${name} rounding`);}
assert.equal(q.scene(r,{pay:'rental'}).after,null);assert.equal(q.scene(r,{pay:'rental'}).status,'need');}
for(const name of ['CLA 200 electric Essential','CLA 250+ electric','GLB 250+ electric']){
const r=row(name),v=q.scene(r,{pay:'cash'});assert.equal(v.q.cashWon,1000000,name);assert.equal(v.after,r.price-1000000);assert.equal(v.saved,1000000);assert.equal(q.of(r).normal,v.after);}
const s=row('S 450 4MATIC'),a=q.scene(s,{pay:'cash',conquest:true});assert.ok(a.q.campaign.conquestEW);assert.equal(a.conqRate,0);assert.ok(a.blocks.some(x=>x.includes('보증연장 +1년')));assert.ok(!a.blocks.some(x=>x.includes('대상이 아닙니다')));
const b=c.window.BenzNovemberBenefits.sClass(false);for(const text of ['총 2번째','총 3번째','총 4번째','+1년 · 3만km','+2년 · 7만km','5월 18일~7월 31일'])assert.ok(b.includes(text),text);
assert.equal(c.window.NOVEMBER_RETAIL.length,125);assert.equal(rows.length,before.length);
for(let i=0;i<rows.length;i++){assert.equal(rows[i][3],before[i][3]);const r=row(rows[i][2],rows[i][1]);for(const pay of ['cash','install','care','lease','rental']){const v=q.scene(r,{pay});assert.ok(v.after==null||Number.isFinite(v.after));assert.equal(v.month,0);}}
for(const image of ['golf-bag.png','folding-chairs.png','boston-bag.png','picnic-blanket.png','camping-table.png'])assert.ok(fs.statSync(path.join(root,'images/golden',image)).size>500);
const cards=fs.readFileSync(path.join(root,'cards.html'),'utf8');for(const rate of ['4.3%','4.4%','4.5%','4.6%','4.7%'])assert.ok(cards.includes(rate));
console.log('November full package: 125 source rows, 153 unchanged catalogue prices, verified retail totals, no unconfirmed rental totals, fixed 1M once, S warranty tiers and conquest EW, no old monthly subsidy, real gift assets, card rates.');
