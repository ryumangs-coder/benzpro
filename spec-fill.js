/* 제원 빈칸 보완 (벤츠비교).
 * 새 숫자를 만들지 않습니다. 같은 차의 다른 기록에 이미 있는 값, 차 이름으로 확실한 값(4MATIC = 사륜구동, 전기차 = 전기)만 채웁니다.
 * guide-data.js · approach-specs.js · preorder-guides.js 다음에 불러옵니다. */
(function () {
  var book = window.GUIDE_DATA;
  var rules = window.APPROACH_SPECS || [];
  if (!book) return;

  function canon(label) {
    if (label === "구동 방식" || label === "구동방식") return "구동";
    if (label === "가속력") return "0-100km/h";
    if (label === "공차 중량") return "공차중량";
    return label;
  }
  function has(rec, label) {
    return (rec.specs || []).some(function (pair) { return canon(pair[0]) === label && pair[1] && pair[1] !== "확인 필요"; });
  }
  function valueOf(rec, label) {
    var hit = (rec && rec.specs || []).filter(function (pair) { return canon(pair[0]) === label && pair[1]; })[0];
    return hit ? hit[1] : "";
  }
  function add(key, label, value) {
    var rec = book[key];
    if (!rec || !value || has(rec, label)) return;
    rec.specs = rec.specs || [];
    rec.specs.push([label, value]);
  }

  /* 1. 가격표 이름과 제원 기록 이름이 달라 엉뚱한 기록에 붙던 차를 같은 차 기록에 연결합니다.
        (예: 26년식 CLE 450 쿠페가 카브리올레 제원에, GLE 450 쿠페가 SUV 제원에 붙던 문제) */
  var ALIAS = {
    "MY27|CLE450COUPE": "MY27|CLE4504MATICCOUPE",
    "MY26|CLE4504MATICCOUPE": "MY26|CLE4504MATICCOUPEAMGLINE",
    "MY26|CLE4504MATICCABRIOLET": "MY26|CLE4504MATICCABRIOLETAMGLINE",
    "MY26|E300AMGLINE": "MY26|E3004MATICAMGLINE",
    "MY26|S5804MATICLONG": "MY26|S5804MATIC",
    "MY26|GLE4504MATICCOUPE": "MY26|GLE4504MATICCOUPEAMGLINE",
    "MY26|GLE4504MATICAMGLINECOUPE": "MY26|GLE4504MATICCOUPEAMGLINE",
    "MY26|GLE450D4MATICCOUPE": "MY26|GLE450D4MATICCOUPEAMGLINE",
    "MY26|GLS5804MATIC": "MY26|GLS5804MATICAMGLINE",
    "MY26|EQE5004MATIC": "MY26|EQE5004MATICSUV",
    "MY26|AMGE534MATICPLUS": "MY26|AMGE53HYBRID4MATICPLUS",
    "MY27|AMGE534MATICPLUS": "MY27|AMGE53HYBRID4MATICPLUS"
  };
  Object.keys(ALIAS).forEach(function (key) {
    if (!book[key] && book[ALIAS[key]]) book[key] = book[ALIAS[key]];
  });

  /* 2. 같은 세대·같은 트림의 다른 연식 기록에서 차체·엔진 값만 가져옵니다. 연비는 연식마다 달라 가져오지 않습니다.
        E클래스는 기존 방침(27년식 공통 사양은 26년식 같은 트림 기준)과 같습니다. */
  var BODY = ["길이", "너비", "높이", "휠베이스", "배기량", "최고출력", "최대토크"];
  [
    ["MY27|E200EXCLUSIVE", "MY26|E200EXCLUSIVE"],
    ["MY27|E200AMGLINE", "MY26|E200AMGLINE"],
    ["MY27|E3004MATICEXCLUSIVE", "MY26|E3004MATICEXCLUSIVE"],
    ["MY27|E3004MATICAMGLINE", "MY26|E3004MATICAMGLINE"],
    ["MY27|E4504MATICEXCLUSIVE", "MY26|E4504MATICEXCLUSIVE"],
    ["MY27|E4504MATICAMGLINE", "MY26|E4504MATICAMGLINE"],
    ["MY27|GLC220D4MATIC", "MY26|GLC220D4MATIC"],
    ["MY27|GLC3004MATICAVANTGARDE", "MY26|GLC3004MATICAVANTGARDE"],
    ["MY27|GLC3004MATICAMGLINE", "MY26|GLC3004MATICAMGLINE"],
    ["MY27|GLC3004MATIC", "MY26|GLC3004MATICAVANTGARDE"],
    ["MY27|AMGSL634MATICPLUS", "MY26|AMGSL634MATICPLUS"]
  ].forEach(function (pair) {
    var from = book[pair[1]];
    if (!from) return;
    BODY.forEach(function (label) { add(pair[0], label, valueOf(from, label)); });
  });

  /* 27년식 GLC 300 4MATIC 기본 모델은 아방가르드와 엔진·구동이 같습니다(제품 정보: 아방가르드에서 HUD·부메스터·대시보드만 빠짐).
     휠 디자인이 달라 타이어 규격은 가져오지 않습니다. */
  var glcAv = rules.filter(function (r) { return (r.need || []).join("|") === "GLC 300|Avantgarde"; })[0];
  if (glcAv) {
    (glcAv.specs || []).forEach(function (pair) {
      if (pair[0] !== "타이어" && pair[0] !== "복합연비") add("MY27|GLC3004MATIC", pair[0], pair[1]);
    });
  }

  /* GLE 450 4MATIC SUV는 같은 엔진인 GLE 450 쿠페 어프로치북 값(최대토크 51kg·m로 동일)에서 최고출력만 가져옵니다. */
  var gleCoupe = rules.filter(function (r) { return (r.need || []).join("|") === "GLE 450|Coup"; })[0];
  var glePower = gleCoupe ? (gleCoupe.specs || []).filter(function (pair) { return pair[0] === "최고출력"; })[0] : null;
  if (glePower) {
    ["MY26|GLE4504MATIC", "MY26|GLE4504MATICAMGLINE"].forEach(function (key) { add(key, "최고출력", glePower[1]); });
  }

  /* 3. 이름으로 확실한 값 */
  var FUEL = {
    "가솔린": [
      "MY26|A220SEDAN", "MY26|AMGA45S4MATICPLUS", "MY27|AMGA45S4MATICPLUS",
      "MY26|CLE4504MATICCOUPEAMGLINE", "MY26|CLE4504MATICCABRIOLETAMGLINE", "MY27|CLE4504MATICCOUPE", "MY27|CLE4504MATICCABRIOLET",
      "MY26|E4504MATICAMGLINE", "MY26|E4504MATICEXCLUSIVE", "MY27|E4504MATICAMGLINE", "MY27|E4504MATICEXCLUSIVE",
      "MY26|S5804MATIC", "MY26|GLS4504MATICAMGLINE", "MY26|GLS4504MATICAMGLINEPREMIUM",
      "MY27|AMGSL634MATICPLUS", "MY27|AMGGLC534MATICPLUS", "MY27|AMGGLC534MATICPLUSCOUPE"
    ],
    "전기": [
      "MY26|EQA250PROGRESSIVE", "MY26|EQA250AMGLINE", "MY27|EQA250PROGRESSIVE", "MY27|EQA250AMGLINE",
      "MY26|EQB3004MATICPROGRESSIVE", "MY26|EQB3004MATICAMGLINE",
      "MY26|EQE350SUV", "MY26|EQE350", "MY26|EQE5004MATICSUV",
      "MY26|EQS4504MATICSUV", "MY26|EQS5804MATICSUV", "MY26|MAYBACHEQS680SUV",
      "MY26|G580WITHEQTECHNOLOGY", "MY27|G580WITHEQTECHNOLOGY", "MY27|G580WITHEQTECHNOLOGYMANUFAKTUR"
    ]
  };
  Object.keys(FUEL).forEach(function (fuel) {
    FUEL[fuel].forEach(function (key) { add(key, "연료", fuel); });
  });
  Object.keys(book).forEach(function (key) {
    if (/4MATIC/.test(key.split("|")[1] || "")) add(key, "구동", "사륜구동");
  });
  /* 26년식 가격표 이름은 "Maybach S 580 4MATIC"인데 제원 기록 이름에는 4MATIC이 빠져 있습니다. */
  ["MY26|MAYBACHS580", "MY26|MAYBACHS680"].forEach(function (key) { add(key, "구동", "사륜구동"); });
})();
