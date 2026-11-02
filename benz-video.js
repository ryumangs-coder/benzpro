/* Vehicle-first recommendations; daily public upload catalogue. */
(function () {
  var videos = [], current = null;
  function norm(s) { return String(s || '').normalize('NFC').toUpperCase().replace(/\s+/g, ''); }
  function tokens(s) { return (norm(s).match(/(?:CLA|CLE|GLA|GLB|GLC|GLE|GLS|EQA|EQB|EQE|EQS|GT|SL|[ACEGSV])\d{2,3}/) || [''])[0]; }
  function profile(name) {
    var s=norm(name), model=tokens(s), family=(s.match(/CLA|CLE|GLA|GLB|GLC|GLE|GLS|EQA|EQB|EQE|EQS|GT|SL|[ACEGSV](?=\d|클래스)/)||[''])[0];
    return {name:s,model:model,family:family,ev:!/가솔린|전기차대신/.test(s)&&/ELECTRIC|일렉트릭|전기|EQ[ABES]|G580|CLA250\+|GLB250\+/.test(s),suv:/GL[ABCES]|EQ[AB]|SUV|G(?:450|580|63)|지바겐|G바겐|마이바흐EQS|MAYBACHEQS|V300/.test(s)};
  }
  function relevance(name,v) {
    var p=profile(name), t=norm(v.title), q=profile(t), score=0,reason='';
    if(!p.family) return {score:0,reason:''};
    var sameFamily=p.family===q.family || t.indexOf(p.family+'클래스')>=0;
    var mentioned=t.match(/(?:CLA|CLE|GLA|GLB|GLC|GLE|GLS|EQA|EQB|EQE|EQS|GT|SL|[ACEGSV])\d{2,3}/g)||[];
    var modelMatch=p.model && mentioned.indexOf(p.model)>=0;
    var wrongGLC=p.family==='GLC' && q.family==='GLC' && (p.ev ? /가솔린/.test(t) || !/일렉트릭|전기/.test(t) : /일렉트릭/.test(t)&&!/가솔린/.test(t));
    if(wrongGLC || (sameFamily && /^(GLB|CLA)$/.test(p.family) && p.ev!==q.ev)) return {score:0,reason:''};
    if(modelMatch && (!/^AMG/.test(p.name)||/AMG/.test(t))) {score=100;reason='선택 차량 실물·비교';}
    else if(sameFamily && p.ev===q.ev) {score=70;reason='같은 차종 살펴보기';}
    else if(p.ev && q.ev) {score=p.suv===q.suv?40:25;reason=p.suv&&q.suv?'함께 비교할 전기 SUV':'함께 살펴볼 전기차';}
    else if(p.suv && q.suv && !p.ev && !q.ev) {score=30;reason='함께 비교할 SUV';}
    else if(!p.suv && !q.suv && p.ev===q.ev && /실내|시트|비교|리뷰/.test(t)) {score=20;reason='함께 비교할 차량';}
    if(score && score<70 && p.family==='GLB' && q.family==='GLC')score+=5;
    if(score && score<70 && /MAYBACH|마이바흐/.test(t) && !/MAYBACH|마이바흐/.test(p.name))score-=18;
    if(score && /SHORTS/.test(t))score-=8;
    return {score:score,reason:reason};
  }
  function pick(names) {
    names=(names||[]).filter(Boolean);
    var distinct=names.map(function(n){var p=profile(n);return p.model+'|'+p.family+'|'+p.ev;}).filter(function(k,i,a){return a.indexOf(k)===i;});
    var multi=distinct.length>1, limit=multi?4:3;
    var ranked=videos.map(function(v,i){
      var per=names.map(function(n){return relevance(n,v);});
      var best=per.reduce(function(a,b){return a.score>=b.score?a:b;},{score:0,reason:''});
      var wanted=names.map(function(n){return profile(n).model;});
      var extras=(norm(v.title).match(/(?:CLA|CLE|GLA|GLB|GLC|GLE|GLS|EQA|EQB|EQE|EQS|GT|SL|[ACEGSV])\d{2,3}/g)||[]).filter(function(k){return wanted.indexOf(k)<0;}).length;
      var score=best.score+(multi&&per.filter(function(x){return x.score>=95;}).length>1?15:0)-(best.score>=95?extras*4:0);
      if(/VS|비교/.test(norm(v.title)))score+=best.score?3:0;
      return {v:v,per:per,score:score,reason:best.reason,index:i};
    }).filter(function(x){return x.score>0;}).sort(function(a,b){return b.score-a.score||a.index-b.index;});
    var selected=[];
    function add(x){if(x&&!selected.some(function(y){return y.v.id===x.v.id;}))selected.push(x);}
    // Represent both compared vehicles before filling the remaining recommendation slots.
    if(multi) names.forEach(function(n,i){add(ranked.filter(function(x){return x.per[i].score>=70;})[0]);});
    ranked.forEach(function(x){if(selected.length<limit)add(x);});
    // Never display a solitary recommendation rail.
    if(selected.length<2)return [];
    return selected.map(function(x){return Object.assign({},x.v,{reason:x.reason});});
  }
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function icon(){return '<svg viewBox="0 0 32 23" aria-hidden="true" focusable="false"><rect width="32" height="23" rx="6" fill="#ff0000"/><path d="M13 6.5v10l9-5z" fill="white"/></svg>';}
  function card(context,names) {
    var selected=pick(names||[]);if(!selected.length)return '';
    return '<section class="bp-videos" aria-label="관련 벤츠프로 영상"><div class="bp-videos-heading"><h3>영상으로 한 번 더 살펴보세요</h3><p>선택한 차를 먼저, 함께 비교할 차도 이어서</p></div><div class="bp-video-grid">'+selected.map(function(v){var url='https://www.youtube.com/watch?v='+encodeURIComponent(v.id);return '<article class="bp-video-card"><a class="bp-video-thumb" href="'+url+'" target="_blank" rel="noopener noreferrer" data-video-id="'+esc(v.id)+'" aria-label="'+esc(v.title)+' 유튜브에서 재생"><img src="https://i.ytimg.com/vi/'+esc(v.id)+'/mqdefault.jpg" alt="" loading="lazy"><span class="bp-video-play">'+icon()+'</span></a><div class="bp-video-copy"><p>'+esc(v.reason)+'</p><h4><a href="'+url+'" target="_blank" rel="noopener noreferrer" data-video-id="'+esc(v.id)+'">'+esc(v.title)+'</a></h4></div></article>';}).join('')+'</div><p class="bp-video-footnote">벤츠프로 공식 채널 · 영상 속 가격·연식·사양은 촬영 당시 기준입니다.</p></section>';
  }
  function paint(){var slot=document.getElementById('q-video'),select=document.getElementById('car');if(slot&&select)slot.innerHTML=card('',[select.options[select.selectedIndex]?.textContent]);document.querySelectorAll('[data-benz-videos]').forEach(function(el){el.innerHTML=card('',JSON.parse(el.getAttribute('data-benz-videos')));});}
  window.BenzVideo={card:card,pick:pick};
  function start(){paint();var select=document.getElementById('car');if(select)select.addEventListener('change',paint);fetch('/benz-videos.json?v='+new Date().toISOString().slice(0,10)).then(function(r){if(!r.ok)throw Error('feed');return r.json();}).then(function(data){videos=data.videos.filter(function(v){return /^[\w-]{11}$/.test(v.id)&&v.title;});paint();document.dispatchEvent(new Event('benz-videos-ready'));}).catch(function(){/* No irrelevant promotion on a feed error. */});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
