/* Native scrolling remains available; large paging buttons make the next rows discoverable. */
(function(){
 var seen=new WeakSet();
 function enhance(){
  document.querySelectorAll('#nov-finance .nov-retail-scroll,#nov-retail-list .nov-retail-scroll').forEach(function(box){
   if(seen.has(box))return;seen.add(box);
   var finance=!!box.closest('#nov-finance'),label=finance?'금융·보장 차종 표':'차종·연식별 기본 조건 표';
   var frame=document.createElement('div');frame.className='nov-table-frame';box.before(frame);
   var hint=document.createElement('p');hint.className='nov-table-hint';hint.textContent='아래에도 다른 차종이 있어요. 표 위에서 내려보거나 아래 큰 버튼을 누르세요.';frame.append(hint,box);
   box.id=finance?'nov-finance-scroll':'nov-retail-scroll';box.setAttribute('role','region');box.setAttribute('aria-label',label+' · 위아래로 스크롤');box.tabIndex=0;
   var fade=document.createElement('div');fade.className='nov-table-more';fade.setAttribute('aria-hidden','true');fade.textContent='↓ 아래에 더 있어요';frame.append(fade);
   var controls=document.createElement('div');controls.className='nov-table-controls';controls.innerHTML='<div class="nov-table-status"><span aria-live="polite" aria-atomic="true"></span><progress max="100" value="0" aria-label="'+label+' 읽은 위치"></progress></div><div class="nov-table-buttons"><button type="button" data-direction="-1" aria-controls="'+box.id+'">↑ 위 차종 보기</button><button type="button" data-direction="1" aria-controls="'+box.id+'">아래 차종 더 보기 ↓</button></div><p>마우스 휠·손가락으로도 표 안을 내릴 수 있어요.</p>';frame.append(controls);
   var up=controls.querySelector('[data-direction="-1"]'),down=controls.querySelector('[data-direction="1"]'),status=controls.querySelector('.nov-table-status span'),progress=controls.querySelector('progress');
   function update(){var max=Math.max(0,box.scrollHeight-box.clientHeight),bottom=box.scrollTop>=max-3,top=box.scrollTop<3;
    up.disabled=top;down.disabled=bottom;fade.hidden=bottom||!max;frame.classList.toggle('has-more',!bottom&&max>0);
    var rows=Array.from(box.querySelectorAll('tbody tr')),r=box.getBoundingClientRect(),header=box.querySelector('thead'),head=header?header.getBoundingClientRect().height:0;
    var visible=rows.map(function(row,i){var v=row.getBoundingClientRect();return v.bottom>r.top+head&&v.top<r.bottom?i+1:0;}).filter(Boolean);
    var text=rows.length?(visible.length?visible[0]+'–'+visible[visible.length-1]+' / 전체 '+rows.length+'개 조건':'전체 '+rows.length+'개 조건'):'검색 결과가 없습니다';
    if(max&&bottom)text+=' · 마지막입니다';else if(max)text+=' · 아래에 더 있어요';
    var help=!rows.length?'검색된 조건이 없습니다. 차종명이나 연식을 다시 입력하세요.':!max?'검색된 조건을 모두 보여드리고 있습니다.':bottom?'마지막 조건까지 보셨습니다. 위 차종 보기로 돌아갈 수 있어요.':'아래에도 다른 차종이 있어요. 표 위에서 내려보거나 아래 큰 버튼을 누르세요.';if(hint.textContent!==help)hint.textContent=help;
    if(status.textContent!==text)status.textContent=text;progress.value=max?Math.round(box.scrollTop/max*100):100;controls.hidden=!max;
   }
   controls.addEventListener('click',function(e){var b=e.target.closest('button[data-direction]');if(!b)return;box.scrollBy({top:Number(b.dataset.direction)*Math.max(140,box.clientHeight*.72),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});
   box.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);if('ResizeObserver'in window)new ResizeObserver(update).observe(box);requestAnimationFrame(update);
  });
 }
 function start(){enhance();['nov-finance','nov-retail-list'].forEach(function(id){var node=document.getElementById(id);if(node)new MutationObserver(enhance).observe(node,{childList:true,subtree:true});});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
