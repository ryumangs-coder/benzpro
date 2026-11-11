const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('bp-measure.js', 'utf8');
function setup() {
  const listeners = {};
  const document = {title:'벤츠프로',readyState:'loading',referrer:'',addEventListener(t,fn){(listeners[t] ||= []).push(fn);}, createElement(){return {};}, head:{appendChild(){}}};
  const window = {localStorage:{getItem(k){return k === 'benzpro-ga-test' ? 'dry' : '';}}};
  const location = new URL('https://benzpro.co.kr/quote');
  vm.runInNewContext(source,{window,document,location,URL,console});
  return {window,listeners,events(name){return window.__bpEvents.filter(e=>e.name===name);}, click(href){const link={href:new URL(href,location).href,getAttribute(k){return k==='href'?href:null;},hasAttribute(k){return k==='href';},matches(){return false;},closest(){return null;}};listeners.click[0]({target:{closest(){return link;}}});}};
}
(async()=>{
  for(const href of ['/chat','/chat/?from=cta','https://benzpro.co.kr/chat','https://www.benzpro.co.kr/chat','https://pf.kakao.com/_YxnqWX/chat','https://open.kakao.com/o/example']){
    const e=setup();e.click(href);e.click(href);assert.equal(e.events('kakao_click').length,2,href);assert.equal(e.events('카톡').length,0);assert.equal(e.events('kakao_click')[0].params.contact_method,'kakao');
  }
  for(const href of ['tel:01091649639','/quote','https://example.com/chat','https://pf.kakao.com.evil.test/chat']){const e=setup();e.click(href);assert.equal(e.events('kakao_click').length,0,href);}
  const e=setup(),t=e.window.BenzTrack;
  const response=(body,extra={})=>({type:'basic',ok:true,clone(){return {text(){return Promise.resolve(typeof body === "string" ? body : JSON.stringify(body));}};},...extra});
  const flush=()=>new Promise(resolve=>setImmediate(resolve));
  t.formResult('quote_consult',response({ok:true}));await flush();assert.equal(e.events('lead_submit_success').length,0,'No success without submission');
  t.formSubmit('quote_consult',{});assert.equal(e.events('consultation_submit').length,1);
  for(const res of [null,response({ok:true},{type:'opaque'}),response({ok:true},{ok:false}),response({ok:false}),response({status:'error'}),response('ignored'),response('<html>error</html>'),response(null),{type:'basic',ok:true,clone(){return {text(){return Promise.reject(new Error('invalid JSON'));}}; }}]){t.formResult('quote_consult',res);await flush();assert.equal(e.events('lead_submit_success').length,0);}
  t.formResult('quote_consult',response('success'));t.formResult('quote_consult',response('success'));await flush();assert.equal(e.events('lead_submit_success').length,1);assert.equal(e.events('generate_lead').length,0);
  const c={window:{}};vm.runInNewContext(fs.readFileSync('selection-contact.js','utf8'),c);const html=c.window.BenzSelectionContact({name:'E 200 Exclusive',my:'MY27'},'index.html?name=E%20200&my=MY27#consulting','price_selection');assert.match(html,/tel:01091649639/);assert.match(html,/https:\/\/benzpro.co.kr\/chat/);assert.match(html,/&amp;my=MY27/);assert.match(html,/price_selection_consult/);
  vm.runInNewContext(fs.readFileSync('october-2026.js','utf8'),c);assert.equal(c.window.OCTOBER_2026.asOfPrice,'2026.11.10');const rows=c.window.OCTOBER_2026.models;assert.equal(rows.find(r=>r[1]==='MY27'&&r[2]==='GLC 300 4MATIC Coupé AMG Line (이후 생산)')[3],97900000);assert.equal(rows.find(r=>r[1]==='MY26'&&r[2]==='GLC 300 4MATIC Coupé AMG Line')[3],96900000);
  console.log('Conversion: one Kakao metric, success only after verified response, duplicates/errors blocked, contextual CTAs and year-specific prices passed.');
})().catch(err=>{console.error(err);process.exitCode=1;});
