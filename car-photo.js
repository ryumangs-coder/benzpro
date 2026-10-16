/* 차종 대표 사진: 차 이름 → 사진 한 장. 프로모션 목록, 할인 확인, 견적 화면에서 같이 씁니다.
 * 사진은 메르세데스-벤츠 코리아 공식 카탈로그와 색상 사진입니다. */
(function () {
  var V = "?v=20261017d";
  var MAP = {
 "A 220 Hatch": "images/tech/m-a-front-sm.webp",
 "A 220 Sedan": "images/tech/m-as-front-sm.webp",
 "CLA 250 4MATIC AMG Line": "images/tech/m-cla-amg-front-sm.webp",
 "GLA 250 4MATIC": "images/tech/m-gla-front-sm.webp",
 "GLB 250 4MATIC": "images/tech/m-glb-front-sm.webp",
 "AMG GLB 35 4MATIC": "images/tech/a-aglb-front-sm.webp",
 "AMG A 45 S 4MATIC+": "images/tech/a-aa-front-sm.webp",
 "AMG CLA 45 S 4MATIC+": "images/tech/a-acla-front-sm.webp",
 "C 200 Avantgarde": "images/tech/m-c-avg-front-sm.webp",
 "C 200 AMG Line": "images/tech/m-c-amg-front-sm.webp",
 "E 200 Avantgarde": "images/tech/e-front-avantgarde-sm.webp",
 "E 200 Exclusive": "images/tech/e-front-exclusive-sm.webp",
 "E 200 AMG Line": "images/tech/e-front-amg-sm.webp",
 "E 200 AMG Line (RoF Edition)": "images/tech/e-front-amg-sm.webp",
 "E 220 d 4MATIC": "images/tech/e-front-exclusive-sm.webp",
 "E 300 4MATIC Exclusive": "images/tech/e-front-exclusive-sm.webp",
 "E 300 4MATIC AMG Line": "images/tech/e-front-amg-sm.webp",
 "E 300 AMG Line (140주년)": "images/tech/e-front-amg-sm.webp",
 "E 350 e 4MATIC Exclusive": "images/tech/e-front-exclusive-sm.webp",
 "E 450 4MATIC AMG Line": "images/tech/e-front-amg-sm.webp",
 "E 450 4MATIC Exclusive": "images/tech/e-front-exclusive-sm.webp",
 "AMG E 53 4MATIC+": "images/tech/a-ae-front-sm.webp",
 "S 350 d 4MATIC": "images/tech/m-s-std-front-sm.webp",
 "S 450 4MATIC (SWB)": "images/tech/m-s-std-front-sm.webp",
 "S 450 4MATIC Long": "images/tech/m-s-std-front-sm.webp",
 "S 500 4MATIC Long": "images/tech/m-s-std-front-sm.webp",
 "S 580 4MATIC Long": "images/tech/m-s-std-front-sm.webp",
 "Maybach S 580 4MATIC": "images/tech/my-s-front-sm.webp",
 "Maybach S 680 4MATIC": "images/tech/my-s-front-sm.webp",
 "S 450 4MATIC": "images/tech/m-s-std-front-sm.webp",
 "S 450 4MATIC Long AMG Line": "images/tech/m-s-amg-front-sm.webp",
 "S 450 4MATIC Long Exclusive": "images/tech/m-s-std-front-sm.webp",
 "Maybach S 580": "images/tech/my-s-front-sm.webp",
 "Maybach S 580 MANUFAKTUR": "images/tech/my-s-front-sm.webp",
 "Maybach S 680": "images/tech/my-s-front-sm.webp",
 "CLE 200 Coupé": "images/tech/m-cle-coupe-front-sm.webp",
 "CLE 200 Coupé (140주년)": "images/tech/m-cle-coupe-front-sm.webp",
 "CLE 200 Cabriolet": "images/tech/m-cle-cab-front-sm.webp",
 "CLE 200 Cabriolet (140주년)": "images/tech/m-cle-cab-front-sm.webp",
 "CLE 450 4MATIC Coupé": "images/tech/m-cle-coupe-front-sm.webp",
 "CLE 450 4MATIC Cabriolet": "images/tech/m-cle-cab-front-sm.webp",
 "AMG CLE 53 4MATIC+ Coupé": "images/tech/a-acle-cpe-front-sm.webp",
 "AMG CLE 53 4MATIC+ Cabriolet": "images/tech/a-acle-cab-front-sm.webp",
 "AMG SL 43": "images/tech/a-asl-front-sm.webp",
 "AMG GT 43": "images/tech/a-agt-front-sm.webp",
 "AMG GT 43 4MATIC+": "images/tech/a-agt4-front-sm.webp",
 "AMG GT 55 4MATIC+": "images/tech/a-agt-front-sm.webp",
 "AMG GT 63 S E Performance": "images/tech/a-agt-front-sm.webp",
 "Maybach SL 680": "images/tech/my-sl-front-sm.webp",
 "CLE 450 Coupé": "images/tech/m-cle-coupe-front-sm.webp",
 "GLC 220 d 4MATIC": "images/tech/m-glc-suv-avg-front-sm.webp",
 "GLC 300 4MATIC Avantgarde": "images/tech/m-glc-suv-avg-front-sm.webp",
 "GLC 300 4MATIC AMG Line": "images/tech/m-glc-suv-amg-front-sm.webp",
 "GLC 300 4MATIC AMG Line (RoF)": "images/tech/m-glc-suv-amg-front-sm.webp",
 "GLC 300 4MATIC AMG Line (140주년)": "images/tech/m-glc-suv-amg-front-sm.webp",
 "GLC 300 4MATIC Coupé Avantgarde": "images/tech/m-glc-cpe-avg-front-sm.webp",
 "GLC 300 4MATIC Coupé AMG Line": "images/tech/m-glc-cpe-amg-front-sm.webp",
 "GLC 300 4MATIC Coupé AMG Line (RoF)": "images/tech/m-glc-cpe-amg-front-sm.webp",
 "GLC 300 4MATIC Coupé AMG Line (140주년)": "images/tech/m-glc-cpe-amg-front-sm.webp",
 "AMG GLC 43 4MATIC": "images/tech/a-aglc-suv-front-sm.webp",
 "AMG GLC 43 4MATIC Coupé": "images/tech/a-aglc-cpe-front-sm.webp",
 "GLE 350 4MATIC": "images/tech/m-gle-std-front-sm.webp",
 "GLE 300 d 4MATIC": "images/tech/m-gle-std-front-sm.webp",
 "GLE 450 4MATIC": "images/tech/m-gle-std-front-sm.webp",
 "GLE 450 4MATIC AMG Line": "images/tech/m-gle-amg-front-sm.webp",
 "GLE 450 4MATIC AMG Line (140주년)": "images/tech/m-gle-amg-front-sm.webp",
 "GLE 450 d 4MATIC Coupé": "images/tech/m-gle-cpe-front-sm.webp",
 "GLE 450 4MATIC Coupé": "images/tech/m-gle-cpe-front-sm.webp",
 "GLE 450 4MATIC Coupé (140주년)": "images/tech/m-gle-cpe-front-sm.webp",
 "GLE 450 4MATIC AMG Line Coupé": "images/tech/m-gle-cpe-front-sm.webp",
 "AMG GLE 53 4MATIC+": "images/tech/a-agle-suv-front-sm.webp",
 "AMG GLE 53 4MATIC+ Coupé": "images/tech/a-agle-cpe-front-sm.webp",
 "GLS 450 4MATIC AMG Line": "images/tech/m-gls-std-front-sm.webp",
 "GLS 450 d 4MATIC": "images/tech/m-gls-std-front-sm.webp",
 "GLS 580 4MATIC": "images/tech/m-gls-std-front-sm.webp",
 "GLS 580 4MATIC (140주년)": "images/tech/m-gls-std-front-sm.webp",
 "AMG GLS 63 4MATIC+": "images/tech/m-gls-amg-front-sm.webp",
 "Maybach GLS 600": "images/tech/my-gls-front-sm.webp",
 "Maybach GLS 600 MANUFAKTUR": "images/tech/my-gls-front-sm.webp",
 "G 450 d": "images/tech/m-g-front-sm.webp",
 "G 450 d MANUFAKTUR": "images/tech/m-g-front-sm.webp",
 "AMG G 63": "images/tech/a-ag-front-sm.webp",
 "AMG G 63 MANUFAKTUR": "images/tech/a-ag-front-sm.webp",
 "Maybach EQS 680 SUV": "images/tech/my-eqs-front-sm.webp",
 "AMG S 63 E Performance": "images/tech/m-s-amg-front-sm.webp",
 "C 200 Final Edition": "images/colors/c-class/149U.webp",
 "EQA 250 Progressive": "images/tech/q-eqa-prog-front-sm.webp",
 "EQA 250 AMG Line": "images/tech/q-eqa-amg-front-sm.webp",
 "EQB 300 4MATIC Progressive": "images/tech/q-eqb-prog-front-sm.webp",
 "EQB 300 4MATIC AMG Line": "images/tech/q-eqb-amg-front-sm.webp",
 "EQE 350+ SUV": "images/tech/q-eqes-350-front-sm.webp",
 "EQE 350+": "images/tech/q-eqe-front-sm.webp",
 "EQE 500 4MATIC": "images/tech/q-eqes-500-front-sm.webp",
 "EQS 450 4MATIC SUV": "images/tech/q-eqss-front-sm.webp",
 "EQS 580 4MATIC SUV": "images/tech/q-eqss-front-sm.webp",
 "G 580": "images/tech/q-eg-front-sm.webp",
 "G 580 MANUFAKTUR": "images/tech/q-eg-front-sm.webp"
};
  var DARK = [];
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
  function guess(name) {
    var n = String(name || "");
    var c = "images/colors/";
    if (/^Maybach EQS/.test(n)) return "images/tech/my-eqs-front-sm.webp";
    if (/^Maybach GLS/.test(n)) return "images/tech/my-gls-front-sm.webp";
    if (/^Maybach SL/.test(n)) return "images/tech/my-sl-front-sm.webp";
    if (/^Maybach S/.test(n)) return "images/tech/my-s-front-sm.webp";
    if (/^AMG GT 43 4MATIC/.test(n)) return "images/tech/a-agt4-front-sm.webp";
    if (/^AMG GT/.test(n)) return "images/tech/a-agt-front-sm.webp";
    if (/^AMG SL/.test(n)) return "images/tech/a-asl-front-sm.webp";
    if (/^AMG G /.test(n)) return "images/tech/a-ag-front-sm.webp";
    if (/^AMG S /.test(n)) return "images/tech/m-s-amg-front-sm.webp";
    if (/^G 580/.test(n)) return "images/tech/q-eg-front-sm.webp";
    if (/^G /.test(n)) return "images/tech/m-g-front-sm.webp";
    if (/^EQE.*SUV|^EQE 500/.test(n)) return "images/tech/q-eqes-350-front-sm.webp";
    if (/^EQE/.test(n)) return "images/tech/q-eqe-front-sm.webp";
    if (/^EQS.*SUV/.test(n)) return "images/tech/q-eqss-front-sm.webp";
    if (/^EQS/.test(n)) return c + "eqs/149U.webp";
    if (/^EQA/.test(n)) return "images/tech/q-eqa-prog-front-sm.webp";
    if (/^EQB/.test(n)) return "images/tech/q-eqb-prog-front-sm.webp";
    if (/^C /.test(n)) return c + "c-class/149U.webp";
    if (/^E /.test(n)) return c + "e-class/149U.webp";
    if (/^S /.test(n)) return c + "s-class/197U.webp";
    if (/^CLA/.test(n)) return c + "cla/149U.webp";
    if (/^CLE.*Cab/.test(n)) return c + "cle-cabriolet/149U.webp";
    if (/^CLE/.test(n)) return c + "cle-coupe/149U.webp";
    if (/^GLA/.test(n)) return c + "gla/149U.webp";
    if (/^GLB/.test(n)) return c + "glb/149U.webp";
    if (/^GLC.*Coup/.test(n)) return c + "glc-coupe/149U.webp";
    if (/^GLC/.test(n)) return c + "glc/149U.webp";
    if (/^GLE.*Coup/.test(n)) return c + "gle-coupe/149U.webp";
    if (/^GLE/.test(n)) return c + "gle/149U.webp";
    if (/^GLS/.test(n)) return c + "gls/149U.webp";
    if (/^A /.test(n)) return c + "a-class/149U.webp";
    return "";
  }
  function srcOf(name) { return MAP[name] || guess(name); }
  window.BenzPhoto = {
    src: function (name) { var s = srcOf(name); return s ? s + V : ""; },
    /* 대표 사진 박스. extra로 크기 class를 더할 수 있습니다. */
    html: function (name, extra) {
      var s = srcOf(name);
      if (!s) return "";
      var dark = DARK.indexOf(s) !== -1 ? " dark" : "";
      return '<div class="car-photo' + dark + (extra ? " " + extra : "") + '"><img src="' + esc(s + V) + '" alt="' + esc(name) + ' 대표 사진" loading="lazy" decoding="async"></div>';
    }
  };
})();
