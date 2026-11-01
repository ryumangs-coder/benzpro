const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'benz-videos.json'),'utf8'));
function moduleFor(videos){const c={window:{},document:{readyState:'loading',addEventListener(){}}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'benz-video.js'),'utf8').replace('var videos = [], current = null;','var videos = '+JSON.stringify(videos)+';'),c);return c.window.BenzVideo;}
const v=moduleFor(data.videos);
assert.equal(v.pick(['E 200 Exclusive','E 300 4MATIC AMG Line'])[0].id,'y8sx0CCegQ0');
assert.equal(v.pick(['GLC 300 4MATIC electric'])[0].id,'tsaprIcuEis');
assert.equal(v.pick(['E 200 Exclusive']).length,3);
assert.equal(v.pick(['E 200 Exclusive','E 300 4MATIC AMG Line']).length,4);
assert.doesNotMatch(v.card('',['E 200 Exclusive']),/kP_GP68aIuA/);
assert.match(v.card('',['E 200 Exclusive']),/bp-youtube-button/);
assert.ok(!v.pick(['E 200 Exclusive']).some(x=>x.id==='TJKyxSxc7OQ'));
assert.ok(!v.pick(['GLB 250+ electric']).some(x=>x.id==='Fh7FCkGI2NE'));
assert.equal(v.pick(['E 200 Exclusive','E 200 AMG Line'])[0].id,'Qt8mBPC-qPo');
assert.ok(!moduleFor([{id:'aaaaaaaaaaa',title:'벤츠 GLB 250 4MATIC 가솔린 실물 리뷰'},...data.videos]).pick(['GLB 250+ electric']).some(x=>x.id==='aaaaaaaaaaa'));
const related=data.videos.filter(x=>/E200/.test(x.title.replace(/\s/g,''))).slice(0,2);
assert.equal(moduleFor(related).pick(['E 200']).length,2);
assert.equal(moduleFor(related.slice(0,1)).pick(['E 200']).length,0);
const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'october-2026.js'),'utf8'),c);
const names=c.window.OCTOBER_2026.models.map(r=>r[2]);let pairs=0;
for(let a=0;a<names.length;a++)for(let b=a+1;b<names.length;b++){
 const selected=v.pick([names[a],names[b]]);
 assert.ok(selected.length>=3 && selected.length<=4,`${names[a]} / ${names[b]}: ${selected.length}`);
 assert.equal(new Set(selected.map(x=>x.id)).size,selected.length);
 pairs++;
}
const html=fs.readFileSync(path.join(root,'preorder.html'),'utf8');
const other=html.slice(html.indexOf('<section id="others"'),html.indexOf('<section id="reserve"'));
assert.doesNotMatch(other,/GLB/);
assert.match(html,/<section id="glb"/);
assert.match(html,/value="GLB 일렉트릭"/);
assert.ok((html.match(/data-benz-videos=/g)||[]).length>=5);
assert.ok(fs.existsSync(path.join(root,'glb-electric.html')));
console.log(`Video checks passed: ${pairs} vehicle pairs have 3–4 unique relevant recommendations; two-video and singleton behavior; GLB navigation and preorder slots.`);
