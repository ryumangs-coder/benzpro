/* Shared presentation: year labels and controlled preorder autoplay. */
(function(){
 function newYears(root){
  var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[],n;
  while((n=walker.nextNode())){var p=n.parentElement;if(!p||p.closest('script,style,option,select,textarea,[data-year-decorated],.bp-new,[aria-hidden=true]'))continue;
   var text=n.nodeValue;if(text.length<90&&/(?:MY27|27MY|2027년식|27년식)/i.test(text))nodes.push(n);
  }
  nodes.forEach(function(node){var text=node.nodeValue,pattern=/MY27|27MY|2027년식|27년식/ig,m,last=0,fragment=document.createDocumentFragment();while((m=pattern.exec(text))){fragment.appendChild(document.createTextNode(text.slice(last,m.index)));var span=document.createElement('span');span.dataset.yearDecorated='';span.textContent=m[0];var b=document.createElement('em');b.className='bp-new';b.textContent='NEW';span.appendChild(b);fragment.appendChild(span);last=pattern.lastIndex;}fragment.appendChild(document.createTextNode(text.slice(last)));node.replaceWith(fragment);});
 }
 function start(){
  newYears(document.body);var pending=false;new MutationObserver(function(records){if(pending||!records.some(function(r){return r.addedNodes.length||r.type==='characterData';}))return;pending=true;requestAnimationFrame(function(){pending=false;newYears(document.body);});}).observe(document.body,{subtree:true,childList:true,characterData:true});
  var host=document.querySelector('[data-preorder-carousel]');if(!host)return;
  var slides=Array.from(host.querySelectorAll('.preorder-slide')),dots=Array.from(host.querySelectorAll('[data-pre-index]')),index=0,elapsed=0,last=0,duration=4500,hover=false,touch=false,focus=false,visible=true,frame=0;
  var motion=window.matchMedia('(prefers-reduced-motion: reduce)'),manualPaused=motion.matches;
  var pause=host.querySelector('[data-pre-pause]'),count=host.querySelector('.preorder-count');
  function paint(){slides.forEach(function(s,i){s.hidden=i!==index;s.inert=i!==index;});dots.forEach(function(d,i){d.setAttribute('aria-current',i===index?'true':'false');d.querySelector('.preorder-progress').style.transform='scaleX('+(i===index?Math.min(elapsed/duration,1):0)+')';});count.textContent=(index+1)+' / '+slides.length;pause.textContent=manualPaused?'자동재생 시작':'자동재생 멈춤';pause.setAttribute('aria-pressed',String(manualPaused));}
  function go(i){index=(i+slides.length)%slides.length;elapsed=0;last=0;paint();}
  host.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-pre-pause')){manualPaused=!manualPaused;paint();syncPlayback();}else if(b.hasAttribute('data-pre-next'))go(index+1);else if(b.hasAttribute('data-pre-prev'))go(index-1);else if(b.hasAttribute('data-pre-index'))go(Number(b.dataset.preIndex));});
  function syncPlayback(){
   var playing=!manualPaused&&!hover&&!touch&&!focus&&visible&&!document.hidden;
   if(playing&&!frame){last=0;frame=requestAnimationFrame(tick);}
   if(!playing&&frame){cancelAnimationFrame(frame);frame=0;last=0;}
  }
  function tick(t){
   if(last)elapsed+=t-last;
   last=t;
   if(elapsed>=duration)go(index+1);
   dots[index].querySelector('.preorder-progress').style.transform='scaleX('+Math.min(elapsed/duration,1)+')';
   frame=requestAnimationFrame(tick);
  }
  host.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){hover=true;syncPlayback();}});
  host.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse'){hover=false;syncPlayback();}});
  host.addEventListener('touchstart',function(){touch=true;syncPlayback();},{passive:true});
  function endTouch(e){touch=e.touches.length>0;syncPlayback();}
  host.addEventListener('touchend',endTouch,{passive:true});
  host.addEventListener('touchcancel',endTouch,{passive:true});
  host.addEventListener('focusin',function(e){focus=e.target!==pause;syncPlayback();});
  host.addEventListener('focusout',function(e){focus=host.contains(e.relatedTarget)&&e.relatedTarget!==pause;syncPlayback();});
  document.addEventListener('visibilitychange',syncPlayback);
  motion.addEventListener('change',function(e){if(e.matches){manualPaused=true;paint();syncPlayback();}});
  if('IntersectionObserver' in window){
   visible=false;
   new IntersectionObserver(function(entries){visible=entries[0].isIntersecting;syncPlayback();},{threshold:.15}).observe(host);
  }
  paint();
  syncPlayback();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
