(function () {
  'use strict';
  var hero = document.querySelector('.showroom-hero');
  if (!hero) return;
  // Keep mobile contact shortcuts out of the hero, including when returning to it.
  var contactFrame = false;
  function updateContactBar() {
    contactFrame = false;
    var header = document.querySelector('.bp-head');
    var headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
    document.body.classList.toggle('showroom-in-view', hero.getBoundingClientRect().bottom > headerBottom);
  }
  function scheduleContactBar() {
    if (contactFrame) return;
    contactFrame = true;
    requestAnimationFrame(updateContactBar);
  }
  window.addEventListener('scroll', scheduleContactBar, { passive: true });
  window.addEventListener('resize', scheduleContactBar);
  window.addEventListener('pageshow', scheduleContactBar);
  updateContactBar();
  var video = hero.querySelector('video');
  var playButton = hero.querySelector('.showroom-play');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var mobile = matchMedia('(max-width: 759px)');
  var saveData = navigator.connection && navigator.connection.saveData;
  var manualPause = false;
  function status(playing) {
    playButton.hidden = false;
    playButton.textContent = playing ? '영상 일시정지 Ⅱ' : '영상 재생 ▷';
    playButton.setAttribute('aria-label', playing ? '배경 영상 일시정지' : '배경 영상 재생');
  }
  function play() {
    if (!video.getAttribute('src')) {
      video.src = 'images/showroom/consultation-' + (mobile.matches ? 'mobile' : 'desktop') + '.mp4';
      video.muted = true;
      video.load();
    }
    var promise = video.play();
    if (promise) promise.catch(function () { video.classList.remove('is-playing'); status(false); });
  }
  video.addEventListener('playing', function () { video.classList.add('is-playing'); status(true); });
  video.addEventListener('pause', function () { status(false); });
  video.addEventListener('error', function () { video.classList.remove('is-playing'); status(false); });
  playButton.addEventListener('click', function () {
    manualPause = !video.paused;
    if (manualPause) video.pause(); else play();
  });
  if (reduce.matches || saveData) status(false); else play();
  reduce.addEventListener('change', function () { if (reduce.matches) video.pause(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) video.pause();
      else if (!manualPause && !reduce.matches && !saveData && !document.hidden) play();
    }, { threshold: 0.05 }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) video.pause();
    else if (!manualPause && !reduce.matches && !saveData && hero.getBoundingClientRect().bottom > 0) play();
  });
  var toggle = document.getElementById('advisor-toggle');
  var panel = document.getElementById('advisor-panel');
  var animation;
  function setOpen(open) {
    if (animation) animation.cancel();
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('span').textContent = open ? '−' : '＋';
    panel.inert = !open;
    if (open) panel.hidden = false;
    var height = panel.scrollHeight;
    if (reduce.matches || !panel.animate) panel.hidden = !open;
    else {
      animation = panel.animate([{height:open ? '0px' : height+'px',opacity:open?0:1},{height:open ? height+'px' : '0px',opacity:open?1:0}],{duration:400,easing:'cubic-bezier(.2,.7,.2,1)'});
      animation.onfinish = function () { panel.hidden = !open; animation = null; };
    }
    if (open) requestAnimationFrame(function () { panel.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'}); });
  }
  toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
  document.getElementById('advisor-close').addEventListener('click', function () { setOpen(false); toggle.focus({preventScroll:true}); toggle.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'center'}); });
  panel.addEventListener('keydown', function (event) { if (event.key === 'Escape') { setOpen(false); toggle.focus(); } });
})();
