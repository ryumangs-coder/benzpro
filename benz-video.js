/* 견적·비교 흐름에 벤츠프로 실제 유튜브 영상을 소개합니다. */
(function () {
  var CHANNEL = "https://www.youtube.com/@benzpro.official/videos";
  var VIDEO = "https://www.youtube.com/watch?v=kP_GP68aIuA";
  var VIDEO_ID = "kP_GP68aIuA";
  var TITLE = "2억 3,500만원 마이바흐 EQS 680 실물 리뷰｜뒷좌석을 보면 이유가 보입니다";
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function card(context, names) {
    var isMaybach = (names || []).some(function (name) { return /Maybach EQS 680/i.test(name || ""); });
    var href = isMaybach ? VIDEO : CHANNEL;
    var action = isMaybach ? "이 차 실물 영상 보기" : "벤츠프로 영상 더 보기";
    var kicker = isMaybach ? (context ? context + " · " : "견적 차량 · ") + "실물 리뷰" : "벤츠프로 최신 영상";
    var note = isMaybach ? "뒷좌석 공간과 실제 차량 분위기를 영상으로 살펴보세요." : "벤츠프로 채널에서 다른 차종의 실물 영상도 살펴보세요.";
    return '<section class="bp-video-card" aria-label="벤츠프로 유튜브 영상"><div class="bp-video-copy"><p>' + esc(kicker || "차량 이야기") + '</p><h3>' + esc(TITLE) + '</h3><span>' + note + '</span><a href="' + href + '" target="_blank" rel="noopener noreferrer">' + action + ' <b aria-hidden="true">↗</b></a></div><a class="bp-video-thumb" href="' + href + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(TITLE) + ' 영상 열기"><img src="https://i.ytimg.com/vi/' + VIDEO_ID + '/hqdefault.jpg" alt="' + esc(TITLE) + ' 유튜브 썸네일" loading="lazy" decoding="async"><span aria-hidden="true">▶</span></a></section>';
  }
  function mountQuote() {
    var slot = document.getElementById("q-video");
    var select = document.getElementById("car");
    if (!slot || !select) return;
    function paint() {
      var option = select.options[select.selectedIndex];
      slot.innerHTML = card("", [option && option.textContent]);
    }
    paint();
    select.addEventListener("change", paint);
  }
  window.BenzVideo = { card: card };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountQuote);
  else mountQuote();
})();
