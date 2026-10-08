(function () {
  if (document.querySelector(".site-legal")) return;
  var note = document.createElement("div");
  note.className = "site-legal";
  note.innerHTML =
    "<p>이 페이지는 메르세데스-벤츠 코리아 최신 판매 조건을 모아 둔 참고 자료입니다. 차량 가격은 부가세가 포함된 권장소비자가입니다. 최종 금액은 재고, 고객 조건, 금융 심사 결과에 따라 달라질 수 있습니다. 판매 조건은 예고 없이 바뀔 수 있으니, 계약 전에 한 번 더 확인하세요.</p>" +
    "<strong>메르세데스-벤츠 공식 파트너 (주)모터원 고양 전시장 · 김민구 차장</strong>";
  var home = document.querySelector("[data-home-foot]");
  if (home) home.appendChild(note);
  else document.body.appendChild(note);
})();
