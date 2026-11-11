(function () {
  "use strict";
  function esc(value) { return String(value || "").replace(/[&<>"']/g, function (c) { return {"&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"}[c]; }); }
  window.BenzSelectionContact = function (row, href, placement) {
    var name = row && row.name ? row.name + " · " + row.my : "선택한 차량";
    return '<div class="selection-contact" aria-label="선택 차량 상담"><p><strong>' + esc(name) + '</strong><br>배정 가능 여부와 최종 견적을 상담으로 확인하세요.</p><div class="selection-contact-links">' +
      '<a data-cta="' + placement + '_phone" href="tel:01091649639">전화 상담</a>' +
      '<a data-cta="' + placement + '_kakao" href="https://benzpro.co.kr/chat">카카오 문의</a>' +
      '<a data-cta="' + placement + '_consult" href="' + esc(href) + '">견적 상담</a></div></div>';
  };
})();
