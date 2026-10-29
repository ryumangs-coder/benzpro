/* 2026-10-29: 비교 제원 보완. 원본 PDF는 비공개로 보관하고 출처·쪽수만 표시합니다.
 * 숫자 제원은 명시한 연식에만 적용합니다. 연식 없는 규칙은 현행 세대의 변속기 등
 * 제조사 공통 사양만 대상으로 하며, 해외 자료는 국내 인증 수치로 취급하지 않습니다.
 * replace는 기존 값의 오류를 확인한 항목만 사용합니다. 나머지는 누락값만 채웁니다.
 */
(function () {
  var rules = [];
  var checked = "2026-10-29";
  function pdf(page, year) {
    return { by: "사용자 제공 사양 자료 · " + page + "쪽", my: year, checked: checked,
      note: "세부 사양은 생산 시점에 따라 다를 수 있음" };
  }
  function official(title, url, note) {
    return { by: title, url: url, checked: checked, note: note || "현행 세대 제조사 공통 사양" };
  }
  function add(year, need, not, values, source, replace) {
    rules.push({ year: year, need: need, not: not || [], source: source,
      specs: Object.keys(values).map(function (key) { return [key, values[key]]; }), replace: replace || [] });
  }
  function p(page, year, need, not, values, replace) { add(year, need, not, values, pdf(page, year), replace); }
  function gear(need, value, source, not) { add(null, need, not, { "변속기": value }, source, ["변속기"]); }
  var e = official("메르세데스-벤츠 코리아 · E-클래스 공식 출시자료", "https://www.mercedes-benz.co.kr/passengercars/brand/news-events/news-story/2024/news-20240123.html");
  gear(["E 200"], "9G-TRONIC", e, ["AMG E"]);
  gear(["E 220"], "9G-TRONIC", e, ["AMG E"]);
  gear(["E 300"], "9G-TRONIC", e, ["AMG E"]);
  gear(["E 450"], "9G-TRONIC", e, ["AMG E"]);
  gear(["E 350 e"], "9G-TRONIC", pdf(16, "MY26 · 현행 E 350 e 파워트레인"));
  gear(["C 200"], "9G-TRONIC", pdf(8, "MY26 · 현행 C 200 파워트레인"));
  ["CLE 200", "CLE 450"].forEach(function (name) {
    gear([name], "9G-TRONIC", official("메르세데스-벤츠 · CLE 제조사 제원", "https://www.mercedes-benz.de/passengercars/models/coupe/cle/overview.html"));
  });
  gear(["AMG CLE 53"], "AMG SPEEDSHIFT TCT 9G", official("메르세데스-벤츠 코리아 · AMG CLE", "https://www.mercedes-benz.co.kr/passengercars/models/cabriolet-roadster/cle/amg.html"));
  gear(["AMG A 45"], "AMG SPEEDSHIFT DCT 8G", pdf(2, "MY26 · 현행 AMG A 45 S 파워트레인"));
  gear(["AMG CLA 45"], "AMG SPEEDSHIFT DCT 8G", pdf(6, "MY26 · 현행 AMG CLA 45 S 파워트레인"));
  gear(["AMG GLB 35"], "AMG SPEEDSHIFT DCT 8G", official("메르세데스-벤츠 코리아 · 콤팩트카 공식 출시자료", "https://www.mercedes-benz.co.kr/passengercars/brand/news-events/news-story/2023/news-20231228.html"));
  [["AMG GLC 43",28],["AMG GLE 53",32],["AMG GLS 63",37],["AMG G 63",40]].forEach(function (item) {
    gear([item[0]], item[0] === "AMG GLC 43" ? "AMG SPEEDSHIFT MCT 9G" : "AMG SPEEDSHIFT TCT 9G",
      pdf(item[1], "현행 해당 모델 파워트레인"));
  });
  /* GT 43의 2도어/4도어는 서로 다른 변속기입니다. */
  add("MY26",["GT 43","4MATIC"],[],{"변속기":"AMG SPEEDSHIFT TCT 9G","최대토크":"51kg·m"},pdf(43,"MY26"),["변속기"]);
  gear(["AMG E 53"], "AMG SPEEDSHIFT TCT 9G", official("Mercedes-AMG · E 53 HYBRID", "https://www.mercedes-amg.com/en/e-class-sedan"));
  gear(["S 350"], "9G-TRONIC", pdf(19,"MY27 · 현행 S 350 d 파워트레인"));
  p(1,"MY26",["A 220","Hatch"],[],{"연료탱크":"43L"});
  p(2,"MY26",["AMG A 45"],[],{"연료":"가솔린","공차중량":"1655kg","연료탱크":"51L"});
  p(3,"MY26",["A 220","Sedan"],[],{"길이":"4560mm","너비":"1795mm","높이":"1445mm","공차중량":"1495kg","연료":"가솔린","연료탱크":"51L"},["길이","너비","높이"]);
  p(5,"MY26",["CLA 250"],["electric"],{"배기량":"1991cc","연료탱크":"51L"});
  p(6,"MY26",["AMG CLA 45"],[],{"배기량":"1991cc","연료탱크":"51L"});
  p(8,"MY26",["C 200"],[],{"연료탱크":"66L"});
  p(9,"MY27",["CLE 450","Coup"],[],{"길이":"4850mm","너비":"1861mm","높이":"1428mm","휠베이스":"2865mm","연료":"가솔린","트렁크":"420L"});
  p(11,"MY27",["CLE 450","Cabriolet"],[],{"길이":"4850mm","너비":"1861mm","높이":"1425mm","휠베이스":"2865mm","연료":"가솔린","트렁크":"295–385L"});
  p(13,"MY26",["E 200"],[],{"길이":"4995mm","너비":"1880mm","높이":"1475mm","최대토크":"32.6kg·m","최고속도":"240km/h"});
  p(16,"MY26",["E 300"],[],{"길이":"4995mm","너비":"1880mm","연료탱크":"66L"});
  p(16,"MY26",["E 350 e"],[],{"배터리":"25.4kWh","연료탱크":"66L"});
  p(17,"MY26",["E 450"],[],{"연료":"가솔린","구동":"사륜구동","최고속도":"250km/h","연료탱크":"66L"});
  p(19,"MY27",["S 350"],[],{"연료탱크":"76L"});
  p(20,"MY27",["S 450"],["Long"],{"연료탱크":"76L"});
  p(25,"MY26",["GLA 250"],[],{"배기량":"1991cc","연료탱크":"51L"});
  p(26,"MY26",["GLB 250"],["electric"],{"배기량":"1991cc","길이":"4650mm","너비":"1845mm","높이":"1690mm","연료탱크":"60L"});
  p(26,"MY26",["AMG GLB 35"],[],{"배기량":"1991cc","연료탱크":"60L"});
  ["GLC 220","GLC 300"].forEach(function (name) {
    p(27,"MY26",[name],["Coup","electric"],{"길이":"4720mm","너비":"1890mm","높이":"1645mm","연료탱크":"62L"});
  });
  p(28,"MY26",["AMG GLC 43"],["Coup"],{"연료탱크":"62L"});
  p(30,"MY26",["AMG GLC 43","Coup"],[],{"연료탱크":"62L"});
  p(32,"MY26",["AMG GLE 53"],["Coup"],{"트렁크":"630–2055L"});
  p(33,"MY26",["GLE 450 d","Coup"],[],{"최대토크":"76.5kg·m","0-100km/h":"5.6초"});
  p(33,"MY26",["GLE 450","Coup"],["450 d"],{"최대토크":"51kg·m","0-100km/h":"5.6초"});
  p(35,"MY26",["GLS 450"],["450 d"],{"최대토크":"51kg·m","연료":"가솔린","연료탱크":"90L"});
  p(36,"MY26",["GLS 580"],[],{"연료탱크":"90L"});
  p(37,"MY26",["AMG GLS 63"],[],{"길이":"5245mm","너비":"2030mm","높이":"1837mm","연료탱크":"90L"});
  p(38,"MY26",["Maybach GLS"],[],{"연료탱크":"90L"});
  p(39,"MY27",["G 450"],[],{"배기량":"2989cc","연료탱크":"100L"});
  p(40,"MY27",["AMG G 63"],[],{"연료탱크":"100L"});
  p(41,"MY26",["SL 43"],[],{"연료탱크":"70L"});
  p(42,"MY26",["Maybach SL"],[],{"길이":"4705mm","너비":"1915mm","높이":"1365mm","구동":"사륜구동","연료탱크":"70L"});
  p(44,"MY26",["GT 43"],["4MATIC"],{"휠베이스":"2700mm","최대토크":"51kg·m","트렁크":"321–675L","공차중량":"1775kg","최고속도":"280km/h"});
  p(45,"MY26",["GT 55"],[],{"휠베이스":"2700mm","트렁크":"321–675L","공차중량":"1970kg","구동":"사륜구동","최고속도":"295km/h"});
  p(45,"MY26",["GT 63"],[],{"휠베이스":"2700mm","트렁크":"182–562L","공차중량":"2195kg","구동":"사륜구동","배터리":"6.1kWh","최고속도":"320km/h"});
  p(46,"MY26",["EQA"],[],{"배터리":"65.9kWh 리튬이온","최대토크":"38.2kg·m"});
  p(47,"MY26",["EQB"],[],{"배터리":"66.5kWh 리튬이온","최대토크":"39.7kg·m","모터 최고출력":"168kW"});
  p(49,"MY26",["EQE 350+","SUV"],[],{"배터리":"96kWh 리튬이온","최대토크":"57.6kg·m","모터 최고출력":"235kW"});
  /* 500은 사이트 가격표에서 SUV가 생략되어 있지만, 세단 자료를 대신 적용하지 않습니다. */
  p(49,"MY26",["EQE 500"],[],{"길이":"4880mm","너비":"1930mm","높이":"1685mm","휠베이스":"3030mm","배터리":"88.8kWh 리튬이온","최대토크":"87.5kg·m","모터 최고출력":"300kW","트렁크":"520–1675L","구동":"사륜구동"});
  p(50,"MY26",["EQS 450","SUV"],[],{"최대토크":"57.9kg·m"});
  p(50,"MY26",["EQS 580","SUV"],[],{"최대토크":"87.5kg·m"});
  p(51,"MY26",["Maybach EQS"],[],{"배터리":"118kWh 리튬이온","최대토크":"96.8kg·m","모터 최고출력":"484kW"});
  p(52,"MY26",["G 580"],[],{"배터리":"118kWh 리튬이온","최대토크":"118.7kg·m","모터 최고출력":"432kW","변속기":"2단 변속기"});
  p(48,"MY27",["GLC 300","electric"],[],{"최대토크":"81.6kg·m"});
  function reference(title, url, note) {
    var src = official(title, url, note || "해외 제조사 제원 참고 · 국내 해당 연식 확정 수치와 다를 수 있음");
    src.reference = true;
    return src;
  }
  var claUK = reference("Mercedes-Benz UK · 전기 CLA 제조사 제원", "https://www.mercedes-benz.co.uk/passengercars/models/saloon/cla-electric/overview.html/");
  ["CLA 200","CLA 250+"].forEach(function (name) {
    add("MY27",[name,"electric"],[],{"길이":"4723mm","너비":"1855mm","높이":"1468mm","최대토크":"34.2kg·m","트렁크":"405L","승차 정원":"5인승"},claUK);
  });
  add("MY27",["CLA 200","electric"],[],{"0-100km/h":"7.5초"},reference("Mercedes-Benz India · CLA 200 제조사 제원","https://www.sundarammotorscbe.mercedes-benz.co.in/passengercars/models/saloon/cla-electric/overview.html"));
  var claLaunch = reference("메르세데스-벤츠 코리아 · CLA 글로벌 공개 제원", "https://www.mercedes-benz.co.kr/passengercars/brand/news-events/news-story/2025/news-20250325.html", "글로벌 공개 사양 참고 · 국내 해당 연식 확정 수치와 다를 수 있음");
  ["CLA 200","CLA 250+"].forEach(function (name) { add("MY27",[name,"electric"],[],{"휠베이스":"2790mm"},claLaunch); });
  add("MY27",["CLA 250+","electric"],[],{"0-100km/h":"6.7초"},claLaunch);
  gear(["CLA","electric"],"2단 변속기",official("Mercedes-Benz Group · 전기 CLA 구동계", "https://group.mercedes-benz.com/technology/innovation/development/next-generation-cla.html"));
  add("MY27",["GLB 250+","electric"],[],{"길이":"4732mm","너비":"1861mm","높이":"1687mm","구동":"후륜구동","모터 최고출력":"200kW"},reference("Mercedes-Benz UK · 전기 GLB 제조사 제원", "https://www.mercedes-benz.co.uk/passengercars/models/suv/glb-electric/overview.html"),["너비"]);
  add("MY27",["GLB 250+","electric"],[],{"배터리":"85kWh 리튬이온","최대토크":"34.2kg·m","0-100km/h":"7.4초","최고속도":"210km/h","WLTP 주행거리":"542–631km","복합연비":"15.8–18.3kWh/100km"},reference("Mercedes-Benz Media · 전기 GLB 공식 제원","https://media.mercedes-benz.com/press-kit/5c87b37d-85fa-4161-a246-68ad10e5c54a/article/4a0928df-7c62-440f-bb7b-923b980106ad"));
  gear(["GLC","electric"],"2단 변속기",official("Mercedes-Benz Media · 전기 GLC 구동계", "https://media.mercedes-benz.com/en/press-kit/8fa9180e-edb4-4629-8c85-e2bc3c6e1468/article/c25c6609-7ee7-49f0-944f-f39a1f3b1141"));
  /* GLC 300 electric: domestic MY27 body/range figures are from the user's dealer sheet;
     performance/charging/range bands below are explicitly marked as Europe WLTP references. */
  var glc300evLocal = { by: "사용자 제공 국내 MY27 제원", my: "MY27", internal: true };
  add("MY27",["GLC 300","electric"],[],{"길이":"4845mm","너비":"1913mm","높이":"1644mm","휠베이스":"2972mm","연료":"전기","구동":"사륜구동","배터리":"85kWh 리튬이온","모터 최고출력":"310kW","최대토크":"81.6kg·m","1회 충전 주행거리":"448km","승차 정원":"5인승"},glc300evLocal,["길이","너비","높이","휠베이스","배터리","모터 최고출력","최대토크","1회 충전 주행거리"]);
  var glc300evEU = reference("Mercedes-Benz Media · GLC 300 4MATIC electric 공식 제원","https://media.mercedes-benz.com/en/article/b7a07378-7df6-407d-a074-7d44426efe70","해외 제조사 사양 · WLTP/유럽 시장 기준");
  add("MY27",["GLC 300","electric"],[],{"0-100km/h":"4.7초","최고속도":"210km/h","WLTP 주행거리":"523–616km","복합연비":"15.9–18.8kWh/100km","트렁크":"570–1740L","전면 트렁크":"128L","급속 충전":"320kW DC · 10–80% 약 22분","전기 아키텍처":"800V"},glc300evEU,["트렁크"]);
  var glc53 = reference("Mercedes-AMG · GLC 53 제조사 제원", "https://media.mercedes-benz.com/article/7baf1cd8-2b99-4d6d-9d51-5ae0133298ad");
  add("MY27",["AMG GLC 53"],[],{"배기량":"2999cc","연료":"가솔린 · 48V 마일드 하이브리드","최고출력":"449ps","최대토크":"61.2kg·m","0-100km/h":"4.2초","구동":"사륜구동","엔진":"직렬 6기통 터보"},glc53);
  gear(["AMG GLC 53"],"AMG SPEEDSHIFT TCT 9G",official("Mercedes-AMG · GLC 53 구동계", "https://www.mercedes-amg.com/en/glc-suv"));
  /* MY27 GLC 300은 실제 연식이 명시된 국내 공식 스토어 제원으로 보완합니다. */
  add("MY27",["GLC 300"],["Coup","electric"],{"길이":"4720mm","너비":"1890mm","높이":"1645mm","배기량":"1999cc","연료":"가솔린 · 48V 마일드 하이브리드","최고출력":"258ps","0-100km/h":"6.2초","최고속도":"240km/h"},official("메르세데스-벤츠 코리아 · MY27 GLC 300 공식 스토어","https://www.mercedes-benz.co.kr/passengercars/buy/new-car/product.html?emhPath=%2FMB5Y01HA3E","2027년식 AVANTGARDE 표시 차량 · 공통 차체/동력계 참고"));
  add("MY27",["GLC 300","Avantgarde"],["Coup","electric"],{"복합연비":"10.6km/L","공차중량":"1915kg"},official("메르세데스-벤츠 코리아 · MY27 GLC 300 AVANTGARDE 공식 스토어","https://www.mercedes-benz.co.kr/passengercars/buy/new-car/product.html?emhPath=%2FMB5Y01HA3E","2027년식 AVANTGARDE 표시 차량"),["복합연비"]);
  var glcBase = reference("메르세데스-벤츠 코리아 · 현행 GLC 출시 제원","https://www.mercedes-benz.co.kr/passengercars/brand/news-events/news-story/2023/news-20230817.html","현행 X254 세대 참고 · 연식/세부 트림 제원은 다를 수 있음");
  add("MY27",["GLC 300"],["Coup","electric"],{"휠베이스":"2890mm","최대토크":"40.8kg·m","구동":"사륜구동","변속기":"9G-TRONIC"},glcBase);
  add("MY27",["GLC 220"],["Coup","electric"],{"길이":"4720mm","너비":"1890mm","높이":"1645mm"},reference("메르세데스-벤츠 코리아 · 현행 GLC 출시 제원","https://www.mercedes-benz.co.kr/passengercars/brand/news-events/news-story/2023/news-20230608.html","현행 X254 세대 참고 · 연식 제원은 다를 수 있음"));
  var eRef = reference("메르세데스-벤츠 코리아 · E 200 익스클루시브 출시 제원","https://www.mercedes-benz.co.kr/passengercars/brand/news-events/news-story/2026/news-20260424.html","2026년 국내 출시 W214 제원 참고 · MY27 확정 제원과 다를 수 있음");
  add("MY27",["E 200"],[],{"길이":"4955mm","너비":"1880mm","높이":"1475mm","최대토크":"32.6kg·m"},eRef);
  add("MY27",["E 300"],[],{"길이":"4955mm","너비":"1880mm"},reference("메르세데스-벤츠 코리아 · W214 국내 출시 제원",e.url,"현행 W214 세대 참고 · 연식/트림별 제원은 다를 수 있음"));
  /* G 580은 현행 국내 파워트레인 자료로 보완하되 연식별 배터리/주행거리는 덮어쓰지 않습니다. */
  add(null,["G 580"],[],{"최대토크":"118.7kg·m","0-100km/h":"4.7초"},official("메르세데스-벤츠 코리아 · G 580 공식 출시자료","https://www.mercedes-benz.co.kr/passengercars/brand/news-events/news-story/2024/news-20241107.html","현행 G 580 구동계 참고 · 연식별 사양은 다를 수 있음"));
  gear(["G 580"],"2단 변속기",pdf(52,"MY26 · 현행 G 580 구동계"));
  gear(["EQE"],"1단 감속기",official("Mercedes-Benz UK · EQE 제조사 제원","https://tax.mercedes-benz.co.uk/details/?derivative=EQE+350PLUSSIGN+Sport+Edition+320hp+235kW+Auto&derivative_extra=&make=Mercedes-Benz&model=EQE","현행 EQE 전기 구동계 참고"));
  gear(["EQS","SUV"],"1단 감속기",official("Mercedes-Benz USA · EQS SUV 기술자료","https://media.mbusa.com/news/2023-eqs-suv-quick-reference-guide"));
  gear(["Maybach EQS"],"1단 감속기",official("Mercedes-Benz USA · Maybach EQS 680 SUV","https://www.mbusa.com/en/vehicles/model/eqs/suv/eqs680z4"));
  gear(["GLB","electric"],"2단 변속기",official("Mercedes-Benz USA · 신형 전기 GLB 구동계","https://media.mbusa.com/news/the-all-new-mercedes-benz-glb"));
  gear(["EQA"],"1단 감속기",official("Mercedes-Benz UK · EQA 전기 구동계","https://tax.mercedes-benz.co.uk/details/?derivative=EQA+250PLUSSIGN+Sport+Executive+190hp+140kW+Auto&make=Mercedes-Benz&model=EQA","현행 EQA 단일 기어 전기 구동계 참고"));
  gear(["EQB"],"1단 감속기",official("Mercedes-Benz UK · EQB 300 전기 구동계","https://tax.mercedes-benz.co.uk/details/?derivative=EQB+300+4MATIC+AMG+Line+Executive+228hp+215kW+Auto&derivative_extra=&make=Mercedes-Benz&model=EQB+New"));
  add("MY26",["Maybach EQS"],[],{"0-100km/h":"4.4초"},reference("메르세데스-벤츠 코리아 · Maybach EQS 680 국내 출시 제원","https://www.mercedes-benz.co.kr/passengercars/brand/news-events/news-story/2024/news-20240725.html","현행 모델 국내 출시 제원 참고 · 연식별 사양은 다를 수 있음"));
  add(null,["AMG E 53"],[],{"연료":"가솔린 + 전기 (PHEV)"},official("Mercedes-AMG · E 53 HYBRID 구동계","https://www.mercedes-amg.com/en/e-class-sedan"),["연료"]);
  gear(["AMG SL 63"],"AMG SPEEDSHIFT MCT 9G",official("메르세데스-벤츠 코리아 · SL 63 국내 출시 제원","https://www.mercedes-benz.co.kr/passengercars/brand/news-events/news-story/2023/news-230613.html"));
  add("MY27",["AMG SL 63"],[],{"길이":"4705mm","너비":"1915mm","높이":"1365mm","최대토크":"81.5kg·m","0-100km/h":"3.6초"},reference("메르세데스-벤츠 코리아 · R232 SL 63 국내 출시 제원","https://www.mercedes-benz.co.kr/passengercars/brand/news-events/news-story/2023/news-230613.html","현행 R232 국내 출시 제원 참고 · MY27 확정 수치와 다를 수 있음"));
  window.SPEC_UPDATES = rules;
}());
