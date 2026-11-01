/* Relevant vehicle videos only. No generic latest-video promotion. */
(function () {
  var videos = [], current = null;
  function norm(s) { return String(s || '').normalize('NFC').toUpperCase().replace(/\s+/g, ''); }
  function tokens(name) {
    var s = norm(name), m = s.match(/(CLA|CLE|GLA|GLB|GLC|GLE|GLS|EQA|EQB|EQE|EQS|GT|SL|[ACEGSV])\d{2,3}/);
    return m ? m[0] : '';
  }
  function pick(names) {
    var keys = names.map(tokens).filter(Boolean);
    return videos.map(function(v,i) {
      var title = norm(v.title), matches = keys.filter(function(k) { return title.indexOf(k) >= 0; }).length;
      // Distinguish electric GLC and combustion GLC, as well as AMG variants.
      var relevant = names.some(function(n) {
        if (!tokens(n)) return false;
        var electricGLC = /GLC/.test(norm(n)) && /ELECTRIC/.test(norm(n));
        if (title.indexOf(tokens(n)) < 0 && !(electricGLC && /GLC/.test(title))) return false;
        if (electricGLC && (!/일렉트릭|전기/.test(title) || /가솔린/.test(title))) return false;
        if (/GLC/.test(norm(n)) && !electricGLC && /일렉트릭/.test(title) && !/가솔린/.test(title)) return false;
        return !/^AMG/.test(norm(n)) || title.indexOf('AMG') >= 0;
      });
      return {v:v, score: relevant ? Math.max(1,matches) * 10 + (/VS|비교/.test(title) && keys.length > 1 ? 3 : 0) : 0, index:i};
    }).filter(function(x){return x.score > 0;}).sort(function(a,b){return b.score-a.score || a.index-b.index;}).slice(0,1).map(function(x){return x.v;});
  }
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function card(context,names) {
    var selected=pick(names || []);
    return selected.map(function(v){var url='https://www.youtube.com/watch?v='+encodeURIComponent(v.id);return '<aside class="bp-video-card" aria-label="선택한 차 관련 영상"><a class="bp-video-thumb" href="'+url+'" target="_blank" rel="noopener noreferrer" data-video-id="'+esc(v.id)+'"><img src="https://i.ytimg.com/vi/'+esc(v.id)+'/mqdefault.jpg" alt="'+esc(v.title)+'" loading="lazy"><span aria-hidden="true">▶</span></a><div class="bp-video-copy"><p>사진 다음엔, 실물로 살펴보세요</p><h3>'+esc(v.title)+'</h3><span>선택한 차와 관련된 벤츠프로 영상 · 촬영 당시 연식·사양 기준</span><a href="'+url+'" target="_blank" rel="noopener noreferrer" data-video-id="'+esc(v.id)+'">실내·외관 영상 보기 ↗</a></div></aside>';}).join('');
  }
  function paint(){var slot=document.getElementById('q-video'),select=document.getElementById('car');if(slot&&select)slot.innerHTML=card('',[select.options[select.selectedIndex]?.textContent]);}
  window.BenzVideo={card:card,pick:pick};
  function start(){paint();var select=document.getElementById('car');if(select)select.addEventListener('change',paint);fetch('/benz-videos.json?v='+new Date().toISOString().slice(0,10)).then(function(r){if(!r.ok)throw Error('feed');return r.json();}).then(function(data){videos=data.videos.filter(function(v){return /^[\w-]{11}$/.test(v.id)&&v.title;});paint();document.dispatchEvent(new Event('benz-videos-ready'));}).catch(function(){/* Keep irrelevant promotions hidden when the feed is unavailable. */});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
