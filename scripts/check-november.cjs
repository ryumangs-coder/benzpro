const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),c={window:{}};vm.createContext(c);
function run(file){vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c);}
run('october-2026.js');
const before=JSON.parse(JSON.stringify(c.window.OCTOBER_2026.models));
run('november-2026.js');run('quote.js');
const rows=c.window.OCTOBER_2026.models;
function row(name,my='MY27'){const r=rows.find(r=>r[2]===name&&r[1]===my);assert.ok(r, name);return {seg:r[0],my:r[1],name:r[2],price:r[3],cash:r[4],mbm:r[5],retain:r[7],conquest:r[8]};}
const quote=c.window.BenzQuote;
// Reference assertions transcribed from the two user-supplied campaign images.
for(const [name,my,cash,install,lease,rental] of [
 ['E 200 Exclusive','MY27',14,18,18,21],
 ['E 200 AMG Line','MY27',14,17,17,20],
 ['E 300 4MATIC Exclusive','MY27',8,12,12,15],
 ['GLC 300 4MATIC','MY27',7,8,8,11],
 ['GLC 300 4MATIC Coupé AMG Line','MY27',7,8,8,10],
 ['GLC 300 4MATIC Coupé AMG Line (이후 생산)','MY27',7,8,8,10],
 ['S 450 4MATIC (SWB)','MY26',7,11,13,16],
 ['Maybach S 580 4MATIC','MY26',9,9,11,14],
 ['Maybach S 680 4MATIC','MY26',9,9,11,14],
 ['GLB 250 4MATIC','MY26',13,17,17,20],
 ['GLA 250 4MATIC','MY27',9,13,13,16],
 ['AMG GLS 63 4MATIC+','MY27',1,1,1,4]
]){
 const r=row(name,my);for(const [pay,rate] of Object.entries({cash,install,lease,rental})){
  const scene=quote.scene(r,{pay});assert.equal(scene.rate,rate,`${my} ${name} ${pay}`);
  if(scene.q.basis!=null) assert.equal(scene.after,Math.floor(scene.q.basis*(1-rate/100)/10000)*10000,`${name} rounding`);
  else assert.equal(scene.after,null);
 }
}
assert.equal(quote.of(row('GLC 300 4MATIC electric AMG Line')).campaign,null);
assert.equal(quote.of(row('CLE 200 Coupé')).campaign,null);
assert.equal(quote.scene(row('CLE 200 Coupé'),{pay:'rental'}).status,'need');
assert.match(quote.of(row('CLE 200 Coupé')).campaignNote,/직전 확인 조건/);
assert.equal(c.window.OCTOBER_2026.asOfPrice,'2026.10.27');
assert.equal(c.window.OCTOBER_2026.asOfPromo,'2026.11.02');
for(let i=0;i<rows.length;i++){
 if (before[i]) assert.equal(rows[i][3],before[i][3],'Catalogue price must not change');
 else assert.equal(rows[i][3],null,'New source-only model must not invent a price');
 const r=row(rows[i][2],rows[i][1]);
 if(!c.window.BenzCampaign.of(r)) {assert.equal(rows[i][4],before[i][4]);assert.equal(rows[i][5],before[i][5]);}
 for(const pay of ['cash','install','care','lease','rental']){
  const scene=quote.scene(r,{pay});assert.ok(scene.after==null||Number.isFinite(scene.after));
 }
}
console.log(`November campaign checked: source totals, lease/rental separation, GLC coupe exclusion, rounding, ${before.length} preserved catalogue prices, ${rows.length} model cases and unlisted-term isolation.`);
