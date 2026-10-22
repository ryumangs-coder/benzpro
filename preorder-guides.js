/* 사전예약 페이지에 정리된 일렉트릭 GLC를 벤츠비교에 그대로 넣습니다.
 * 가솔린 GLC 사양표가 전기 트림에 붙지 않게 막습니다. */
(function () {
  var book = window.GUIDE_DATA || (window.GUIDE_DATA = {});
  var specs = window.APPROACH_SPECS || (window.APPROACH_SPECS = []);
  var basics = window.BASIC_OPTIONS || (window.BASIC_OPTIONS = []);

  function addNot(list, token) {
    (list || []).forEach(function (item) {
      var need = (item.need || []).join(" ");
      if (!/GLC 300|GLC 220/.test(need)) return;
      item.not = item.not || [];
      if (item.not.indexOf(token) === -1) item.not.push(token);
    });
  }
  addNot(specs, "electric");
  addNot(basics, "electric");

  var size300 = [
    ["길이", "4,845mm"],
    ["너비", "1,913mm"],
    ["높이", "1,644mm"],
    ["휠베이스", "2,972mm"],
    ["연료", "전기"],
    ["구동", "사륜구동"],
    ["모터 최고출력", "310kW"],
    ["1회 충전 주행거리", "448km"],
    ["트렁크", "570–1,868L"]
  ];
  var size400 = [
    ["길이", "4,845mm"],
    ["너비", "1,913mm"],
    ["높이", "1,644mm"],
    ["휠베이스", "2,972mm"],
    ["연료", "전기"],
    ["구동", "사륜구동"],
    ["모터 최고출력", "360kW"],
    ["0-100km/h", "4.3초"],
    ["트렁크", "570–1,868L"]
  ];

  var shared = [
    ["충전·전기차 기능", "DC 충전 시스템 (800V)", "기본"],
    ["충전·전기차 기능", "AC 충전 시스템", "기본"],
    ["충전·전기차 기능", "DC 충전 시스템 (400V)", "기본"],
    ["외관·생활 편의", "SKY CONTROL 파노라마 루프", "기본"],
    ["외관·생활 편의", "전자식 전면부 프렁크", "기본"],
    ["외관·생활 편의", "일루미네이티드 아이코닉 그릴", "기본"],
    ["외관·생활 편의", "브랜드 로고 프로젝션 앰비언트 라이트", "기본"],
    ["외관·생활 편의", "AMG 바디스타일링", "기본"],
    ["외관·생활 편의", "어쿠스틱 글래스", "기본"],
    ["외관·생활 편의", "키레스 고 컴포트 패키지", "기본"],
    ["외관·생활 편의", "디지털 라이트", "기본"],
    ["외관·생활 편의", "발광 도어 실 패널", "기본"],
    ["외관·생활 편의", "전동 트렁크", "기본"],
    ["시트·공간", "메모리 패키지", "기본"],
    ["시트·공간", "뒷좌석 접이식 시트", "기본"],
    ["시트·공간", "앞좌석 열선 및 통풍 시트", "기본"],
    ["시트·공간", "뒷좌석 열선 시트", "기본"],
    ["시트·공간", "앞좌석 마사지 기능", "기본"],
    ["실내 편의", "자동 온도 조절 시스템", "기본"],
    ["실내 편의", "USB 패키지 플러스", "기본"],
    ["실내 편의", "액티브 앰비언트 라이트", "기본"],
    ["실내 편의", "공기 청정 패키지", "기본"],
    ["실내 편의", "앞좌석 무선 충전 시스템", "기본"],
    ["실내 편의", "열선 스티어링 휠", "기본"],
    ["안전·주차", "MB.DRIVE 어시스트", "기본"],
    ["안전·주차", "360° 카메라가 포함된 주차 어시스트", "기본"],
    ["안전·주차", "PRE-SAFE 시스템", "기본"],
    ["안전·주차", "센터 에어백", "기본"],
    ["디스플레이·오디오", "MBUX 증강 현실 내비게이션 헤드업 디스플레이", "기본"],
    ["디스플레이·오디오", "부메스터 하이엔드 4D 서라운드 사운드 시스템", "기본"],
    ["디스플레이·오디오", "스마트폰 통합 패키지", "기본"],
    ["주행·승차감", "AMG 액티브 라이드 컨트롤", "기본"]
  ];

  function plus(rows) {
    return shared.concat(rows);
  }

  function put(key, rec) {
    book[key] = rec;
  }

  put("MY27|GLC3004MATICELECTRIC", {
    name: "GLC 300 4MATIC electric",
    year: "MY27",
    family: "GLC electric",
    specs: size300.slice(),
    options: [
      ["서스펜션", "컴포트"],
      ["후륜 조향", "미적용"],
      ["대형 디스플레이", "슈퍼스크린"],
      ["기본 휠", "20인치 5-스포크"],
      ["기본 실내 장식", "하이 글로스 실버 혼방"],
      ["시트 소재", "아티코"]
    ],
    gear: plus([
      ["디스플레이·오디오", "MBUX 슈퍼스크린", "기본"],
      ["주행·승차감", "컴포트 서스펜션", "기본"],
      ["외관·생활 편의", "20인치 5-스포크 휠", "기본"]
    ])
  });

  put("MY27|GLC3004MATICELECTRICAMGLINE", {
    name: "GLC 300 4MATIC electric AMG Line",
    year: "MY27",
    family: "GLC electric",
    specs: size300.slice(),
    options: [
      ["서스펜션", "컴포트"],
      ["후륜 조향", "미적용"],
      ["대형 디스플레이", "하이퍼스크린"],
      ["기본 휠", "20인치 AMG 5-스포크"],
      ["기본 실내 장식", "파인라인 버치 우드"],
      ["시트 소재", "아티코 · 스포츠 시트"]
    ],
    gear: plus([
      ["디스플레이·오디오", "MBUX 하이퍼스크린", "기본"],
      ["외관·생활 편의", "일루미네이티드 스타라이트 루프", "기본"],
      ["시트·공간", "스포츠 시트", "기본"],
      ["시트·공간", "AMG Line 스포츠 시트 패키지", "기본"],
      ["안전·주차", "PRE-SAFE 임펄스 사이드", "기본"],
      ["주행·승차감", "컴포트 서스펜션", "기본"],
      ["외관·생활 편의", "20인치 AMG 5-스포크 휠", "기본"]
    ])
  });

  put("MY27|GLC3004MATICELECTRICAMGLINEPLUS", {
    name: "GLC 300 4MATIC electric AMG Line+",
    year: "MY27",
    family: "GLC electric",
    specs: size300.slice(),
    options: [
      ["서스펜션", "에어매틱"],
      ["후륜 조향", "후륜 조향"],
      ["대형 디스플레이", "하이퍼스크린"],
      ["기본 휠", "20인치 AMG 10-스포크"],
      ["기본 실내 장식", "메탈릭 혼방 패브릭"],
      ["시트 소재", "아티코 · 스포츠 시트"]
    ],
    gear: plus([
      ["디스플레이·오디오", "MBUX 하이퍼스크린", "기본"],
      ["외관·생활 편의", "일루미네이티드 스타라이트 루프", "기본"],
      ["시트·공간", "스포츠 시트", "기본"],
      ["시트·공간", "AMG Line 스포츠 시트 패키지", "기본"],
      ["안전·주차", "PRE-SAFE 임펄스 사이드", "기본"],
      ["주행·승차감", "에어매틱", "기본"],
      ["주행·승차감", "후륜 조향", "기본"],
      ["외관·생활 편의", "20인치 AMG 10-스포크 휠", "기본"]
    ])
  });
  book["MY27|GLC3004MATICAMGLINEELECTRIC"] = book["MY27|GLC3004MATICELECTRICAMGLINEPLUS"];

  put("MY27|GLC4004MATICELECTRIC", {
    name: "GLC 400 4MATIC electric",
    year: "MY27",
    family: "GLC electric",
    specs: size400.slice(),
    options: [
      ["서스펜션", "에어매틱"],
      ["후륜 조향", "후륜 조향"],
      ["대형 디스플레이", "하이퍼스크린"],
      ["기본 휠", "21인치 AMG Y-스포크"],
      ["기본 실내 장식", "파인라인 버치 우드"],
      ["시트 소재", "천연가죽"]
    ],
    gear: plus([
      ["디스플레이·오디오", "MBUX 하이퍼스크린", "기본"],
      ["외관·생활 편의", "일루미네이티드 스타라이트 루프", "기본"],
      ["시트·공간", "스포츠 시트", "기본"],
      ["시트·공간", "AMG Line 스포츠 시트 패키지", "기본"],
      ["안전·주차", "PRE-SAFE 임펄스 사이드", "기본"],
      ["주행·승차감", "에어매틱", "기본"],
      ["주행·승차감", "후륜 조향", "기본"],
      ["외관·생활 편의", "21인치 AMG Y-스포크 휠", "기본"]
    ])
  });

  function hasRule(need) {
    return specs.some(function (item) {
      return (item.need || []).join("|") === need.join("|");
    });
  }
  if (!hasRule(["GLC 300", "electric"])) {
    specs.push({
      need: ["GLC 300", "electric"],
      not: ["GLC 400"],
      year: "MY27",
      specs: size300.slice()
    });
  }
  if (!hasRule(["GLC 400", "electric"])) {
    specs.push({
      need: ["GLC 400", "electric"],
      not: [],
      year: "MY27",
      specs: size400.slice()
    });
  }

  function hasBasic(need) {
    return basics.some(function (item) {
      return (item.need || []).join("|") === need.join("|");
    });
  }
  var evBasic = {
    assist: "MB.DRIVE 어시스트",
    cockpit: "",
    hud: "증강현실(AR)",
    seatF: "열선·통풍",
    seatR: "열선만",
    air: "",
    balance: null,
    presafe: "",
    airbag: "",
    pano: "SKY CONTROL",
    cam: "360° 카메라",
    hl: "디지털 라이트",
    amb: "액티브"
  };
  var cla220 = [
    ["배기량", "1,496cc"],
    ["연료", "가솔린 · 48V 하이브리드"],
    ["변속기", "8단 DCT"],
    ["구동", "전륜구동"],
    ["최고출력", "188ps"],
    ["모터 최고출력", "22"]
  ];
  var cla200ev = [
    ["배기량", "엔진 없음"],
    ["연료", "전기"],
    ["구동", "후륜구동"],
    ["최고출력", "221ps"],
    ["모터 최고출력", "165"],
    ["1회 충전 주행거리", "342km"]
  ];
  var cla250ev = [
    ["배기량", "엔진 없음"],
    ["연료", "전기"],
    ["구동", "후륜구동"],
    ["최고출력", "268ps"],
    ["모터 최고출력", "200"],
    ["1회 충전 주행거리", "474km"]
  ];
  [
    ["MY27|CLA220", cla220],
    ["MY27|CLA220AMGLINE", cla220],
    ["MY27|CLA200ELECTRICESSENTIAL", cla200ev],
    ["MY27|CLA200ELECTRICADVANCED", cla200ev],
    ["MY27|CLA200ELECTRICAMGLINE", cla200ev],
    ["MY27|CLA250ELECTRIC", cla250ev],
    ["MY27|CLA250ELECTRICAMGLINE", cla250ev]
  ].forEach(function (pair) {
    if (book[pair[0]]) book[pair[0]].specs = pair[1].slice();
  });
  if (!hasRule(["CLA 220"])) {
    specs.push({ need: ["CLA 220"], not: ["electric"], year: "MY27", specs: cla220.slice() });
  }
  if (!hasRule(["CLA 200", "electric"])) {
    specs.push({ need: ["CLA 200", "electric"], not: ["CLA 250"], year: "MY27", specs: cla200ev.slice() });
  }
  if (!hasRule(["CLA 250+", "electric"])) {
    specs.push({ need: ["CLA 250+", "electric"], not: [], year: "MY27", specs: cla250ev.slice() });
  }

  if (!hasBasic(["GLC 300", "electric"])) {
    basics.push({
      need: ["GLC 300", "electric"],
      not: ["AMG Line"],
      src: "사전예약 일렉트릭 GLC",
      f: Object.assign({}, evBasic, { cockpit: "슈퍼스크린" })
    });
    basics.push({
      need: ["GLC 300", "electric", "AMG Line"],
      not: [],
      src: "사전예약 일렉트릭 GLC",
      f: Object.assign({}, evBasic, { cockpit: "하이퍼스크린" })
    });
    basics.push({
      need: ["GLC 400", "electric"],
      not: [],
      src: "사전예약 일렉트릭 GLC",
      f: Object.assign({}, evBasic, { cockpit: "하이퍼스크린" })
    });
  }
})();
