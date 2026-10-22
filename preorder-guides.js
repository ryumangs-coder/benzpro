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
    ["길이", "4,723mm"],
    ["너비", "1,855mm"],
    ["높이", "1,450mm"],
    ["휠베이스", "2,790mm"],
    ["배기량", "1,499cc"],
    ["엔진", "직렬 4기통 터보 · 48V 하이브리드"],
    ["연료", "가솔린 · 48V 하이브리드"],
    ["변속기", "8G-DCT"],
    ["구동", "전륜구동"],
    ["최고출력", "190ps"],
    ["모터 최고출력", "22"],
    ["최대토크", "30.6kg·m"],
    ["0-100km/h", "7.2초"],
    ["최고속도", "240km/h"],
    ["복합연비", "16.2 km/L"],
    ["도심 · 고속 연비", "14.7 · 18.4km/L"],
    ["연비 등급", "1등급"],
    ["연료탱크", "43L"],
    ["트렁크", "405L"],
    ["공차중량", "1,645kg"],
    ["승차 정원", "5인승"],
    ["서스펜션", "앞 맥퍼슨 스트럿 · 뒤 멀티링크"],
    ["브레이크", "앞 V디스크 · 뒤 디스크"],
    ["타이어", "225/45 R 18"]
  ];
  var cla200ev = [
    ["배기량", "엔진 없음"],
    ["연료", "전기"],
    ["구동", "후륜구동"],
    ["최고출력", "221ps"],
    ["모터 최고출력", "165"],
    ["배터리", "58kWh LFP"],
    ["WLTP 주행거리", "최대 542km"],
    ["1회 충전 주행거리", "342km"],
    ["급속 충전", "최대 200kW · 10→80% 약 20분"]
  ];
  var cla250ev = [
    ["배기량", "엔진 없음"],
    ["연료", "전기"],
    ["구동", "후륜구동"],
    ["최고출력", "268ps"],
    ["모터 최고출력", "200"],
    ["배터리", "85kWh NCM"],
    ["WLTP 주행거리", "최대 792km"],
    ["1회 충전 주행거리", "474km"],
    ["급속 충전", "최대 320kW · 10분에 WLTP 최대 325km"]
  ];
  var claLook = {
    "MY27|CLA220": {
      options: [
        ["외관 디자인", "프로그레시브 라인"],
        ["서스펜션", "컴포트"],
        ["기본 휠", "18인치 5스포크 (R31)"],
        ["시트 소재", "아티코 인조가죽"],
        ["스티어링 휠", "가죽 · 열선"],
        ["기본 실내 장식", "앤트러사이트 아노다이징 룩 트림"]
      ],
      drop: [],
      add: [
        ["주행·승차감", "컴포트 서스펜션", "기본"]
      ]
    },
    "MY27|CLA220AMGLINE": {
      options: [
        ["외관 디자인", "AMG 라인 외장"],
        ["서스펜션", "로워링 컴포트"],
        ["기본 휠", "18인치 AMG 5스포크 (RQR)"],
        ["시트 소재", "아티코 나파 룩 · 마이크로컷 투톤"],
        ["스티어링 휠", "스포츠 나파 가죽 · 열선"],
        ["기본 실내 장식", "라이트 카본 그레인 알루미늄 트림"]
      ],
      drop: ["컴포트 서스펜션"],
      add: [
        ["주행·승차감", "로워링 컴포트 서스펜션", "기본"],
        ["외관·생활 편의", "벤츠 로고 프로젝션 (애니메이션 패턴)", "기본"]
      ]
    }
  };
  var claShared = [
    ["외관·생활 편의", "어댑티브 하이빔 어시스트", "기본"],
    ["외관·생활 편의", "일루미네이티드 그릴", "기본"],
    ["외관·생활 편의", "플러시 도어 핸들", "기본"],
    ["시트·공간", "뒷좌석 접이식 시트 · i-Size", "기본"],
    ["디스플레이·오디오", "10.25인치 계기판 · 14인치 중앙 디스플레이", "기본"],
    ["디스플레이·오디오", "MB.OS · T맵 오토 내비게이션", "기본"],
    ["디스플레이·오디오", "셀피 카메라", "기본"],
    ["디스플레이·오디오", "기본 사운드 시스템 (스피커 8개, 125W)", "기본"],
    ["실내 편의", "디지털 엑스트라 (원격 시동 · 스마트폰 차량 키)", "기본"],
    ["실내 편의", "순정형 블랙박스 · 하이패스", "기본"],
    ["안전·주차", "후방 카메라", "기본"],
    ["안전·주차", "액티브 보닛", "기본"],
    ["안전·주차", "충돌 회피 조향 어시스트", "기본"],
    ["안전·주차", "PRE-SAFE · PRE-SAFE 사운드 · 임펄스 사이드", "기본"],
    ["안전·주차", "에어백 8개", "기본"]
  ];
  Object.keys(claLook).forEach(function (key) {
    var rec = book[key];
    if (!rec) return;
    var look = claLook[key];
    rec.options = look.options.map(function (pair) { return pair.slice(); });
    var gear = (rec.gear || []).filter(function (item) { return look.drop.indexOf(item[1]) === -1; });
    look.add.concat(claShared).forEach(function (item) {
      if (!gear.some(function (g) { return g[1] === item[1]; })) gear.push(item.slice());
    });
    rec.gear = gear;
  });
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
