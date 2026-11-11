const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('chrome.js','utf8');const start=source.indexOf('  var SUBMIT_HOST'),end=source.indexOf('  /* 개인정보 안내',start);assert.ok(start>0&&end>start);
function setup(response,failed=false){let request;const window={setTimeout(){return 1;},clearTimeout(){},AbortController};const fetch=(url,options)=>{request={url,options};return failed?Promise.reject(new TypeError('network')):Promise.resolve(response);};vm.runInNewContext(source.slice(start,end),{window,location:{hostname:'benzpro.co.kr'},fetch,AbortController,SUBMIT_TIMEOUT:15000,Promise,Error,TypeError});return {api:window.BenzSubmit,request:()=>request};}
function response(body,extra={}){return {ok:true,status:200,type:'cors',clone(){return {text(){return Promise.resolve(body);}};},...extra};}
(async()=>{
for(const body of ['success','success\n','{"ok":true}']){const e=setup(response(body));const r=await e.api.post('https://example.test/exec','test=1');assert.equal(r.ok,true);assert.equal(e.request().options.mode,'cors');assert.equal(e.request().options.credentials,'omit');}
for(const r of [response('ignored'),response('{"ok":false}'),response('<html>Error</html>'),response('success',{ok:false,status:500}),response('success',{type:'opaque'}),null]){await assert.rejects(setup(r).api.post('https://example.test/exec','test=1'));}
await assert.rejects(setup(null,true).api.post('https://example.test/exec','test=1'));
console.log('Submission confirmation: CORS, plain/JSON storage acknowledgments, HTTP/network/unreadable/unconfirmed failures passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
