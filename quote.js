/* 차종 실구매가
 * 1. 차량 가격 + 에디션 옵션 = 기준가
 * 2. 기본 할인 + 금융 추가 할인을 기준가에 적용하고, 만원 미만은 버림
 * 3. 옵션 추가 할인이 있으면 그다음 뺌
 * 4. 2026년 7월 1일 이전 통관 재고만 개소세 인하를 한 번 더 뺌
 * 재구매·다른 브랜드·카드는 여기 넣지 않습니다.
 */
(function () {
  var EDITIONS = {
    "MY26|E 200 AMG Line (RoF Edition)": { option: 930000, extra: 220000, optionLabel: "RoF 옵션" },
    "MY26|GLC 300 4MATIC AMG Line (RoF)": { option: 1260000, extra: 0, optionLabel: "RoF 옵션" },
    "MY26|GLC 300 4MATIC Coupé AMG Line (RoF)": { option: 1260000, extra: 0, optionLabel: "RoF 옵션" },
    "MY26|E 300 AMG Line (140주년)": {
      option: 5700000,
      extra: 0,
      optionLabel: "140주년 옵션",
      points: [
        "에어매틱이 들어 있습니다. 공기 스프링이라 승차감이 부드럽고 높낮이도 바뀝니다.",
        "후륜 조향이 최대 2.5°까지 돌아, 주차와 유턴이 수월합니다.",
        "외장은 마누팍투어 알파인 그레이, 바퀴는 블랙 AMG 휠입니다. 140대입니다."
      ]
    },
    "MY26|GLC 300 4MATIC AMG Line (140주년)": {
      option: 5400000,
      extra: 0,
      optionLabel: "140주년 옵션",
      points: [
        "에어매틱이 들어 있습니다. 공기 스프링이라 승차감이 부드럽고 높낮이도 바뀝니다.",
        "후륜 조향이 최대 4.5°까지 돌아, 골목 회전과 유턴이 수월합니다.",
        "외장은 마누팍투어 알파인 그레이, 바퀴는 블랙 AMG 휠입니다. 140대입니다."
      ]
    },
    "MY26|GLC 300 4MATIC Coupé AMG Line (140주년)": {
      option: 5400000,
      extra: 0,
      optionLabel: "140주년 옵션",
      points: [
        "에어매틱이 들어 있습니다. 공기 스프링이라 승차감이 부드럽고 높낮이도 바뀝니다.",
        "후륜 조향이 최대 4.5°까지 돌아, 골목 회전과 유턴이 수월합니다.",
        "외장은 마누팍투어 알파인 그레이, 바퀴는 블랙 AMG 휠입니다. 140대입니다."
      ]
    },
    "MY26|CLE 200 Coupé (140주년)": {
      option: 4500000,
      extra: 0,
      optionLabel: "140주년 옵션",
      points: [
        "부메스터 3D 사운드가 들어 있습니다. 스피커 17개로 음악을 둘러 들려 줍니다.",
        "헤드업 디스플레이가 있어, 앞유리에 속도와 길 안내가 뜹니다.",
        "70대입니다."
      ]
    },
    "MY26|CLE 200 Cabriolet (140주년)": {
      option: 4300000,
      extra: 0,
      optionLabel: "140주년 옵션",
      points: [
        "부메스터 3D 사운드가 들어 있습니다. 스피커 17개로 음악을 둘러 들려 줍니다.",
        "헤드업 디스플레이가 있어, 앞유리에 속도와 길 안내가 뜹니다.",
        "70대입니다."
      ]
    },
    "MY26|GLE 450 4MATIC AMG Line (140주년)": {
      option: 2400000,
      extra: 0,
      optionLabel: "140주년 옵션",
      points: [
        "나이트 패키지입니다. 그릴과 문 손잡이는 다크 크롬, 거울과 창틀은 블랙입니다.",
        "22인치 AMG 휠, 블랙 나파 가죽, 앤트러사이트 나무 장식이 들어 있습니다.",
        "외장은 알파인 그레이 175대, 옵시디안 블랙 175대입니다."
      ]
    },
    "MY26|GLE 450 4MATIC Coupé (140주년)": {
      option: 2900000,
      extra: 0,
      optionLabel: "140주년 옵션",
      points: [
        "나이트 패키지입니다. 그릴과 문 손잡이는 다크 크롬, 거울과 창틀은 블랙입니다.",
        "22인치 AMG 휠, 블랙 나파 가죽, 앤트러사이트 나무 장식이 들어 있습니다.",
        "외장은 알파인 그레이 115대, 옵시디안 블랙 115대입니다."
      ]
    },
    "MY26|GLS 580 4MATIC (140주년)": {
      option: 5600000,
      extra: 0,
      optionLabel: "140주년 옵션",
      points: [
        "나이트 패키지와 23인치 AMG 휠, 블랙 나파 가죽이 들어 있습니다.",
        "E-액티브 바디 컨트롤이 들어 있습니다. 앞 노면을 보고 바퀴를 미리 움직여 울퉁불퉁을 더 걸러 줍니다.",
        "외장은 알파인 그레이 100대입니다."
      ]
    }
  };

  function floorWon(n) {
    return Math.floor(n / 10000) * 10000;
  }
  function man(n) {
    if (n == null || !isFinite(n)) return null;
    return Math.round(n / 10000);
  }
  function cashPct(s) {
    if (!s || s === "—") return null;
    var m = String(s).match(/(\d+(?:\.\d+)?)%/);
    return m ? parseFloat(m[1]) : null;
  }
  function finance(mbm) {
    var s = String(mbm || "");
    if (!s || s === "—") return { add: 0, alt: 0, altLabel: "" };
    var nums = [];
    var re = /\+(\d+(?:\.\d+)?)%/g;
    var found;
    while ((found = re.exec(s))) nums.push(parseFloat(found[1]));
    if (s.indexOf("할부") !== -1 && nums.length >= 2) {
      return { add: nums[0], alt: nums[1], altLabel: "운용리스·장기렌트" };
    }
    if (nums.length) return { add: nums[0], alt: 0, altLabel: "" };
    return { add: 0, alt: 0, altLabel: "" };
  }
  function taxWon(vehicle, row) {
    if (!vehicle || row.my !== "MY26") return 0;
    var n = row.name || "";
    if (row.seg === "EQ" && vehicle <= 130000000) return 0;
    if (n.indexOf("G 450") === 0 || n.indexOf("AMG G ") === 0 || n.indexOf("G 580") === 0) return 0;
    var stepped = Math.round((vehicle * 0.0123) / 100000) * 100000;
    if (stepped < 600000) stepped = 600000;
    if (stepped > 1400000) stepped = 1400000;
    return stepped;
  }
  function applyRate(basis, rate, extra) {
    if (basis == null) return null;
    if (rate == null) return basis;
    return floorWon(basis * (1 - rate / 100)) - (extra || 0);
  }
  function of(row) {
    var edition = EDITIONS[row.my + "|" + row.name] || null;
    var vehicle = row.price;
    var option = edition ? edition.option : 0;
    var extra = edition ? edition.extra : 0;
    var basis = vehicle == null ? null : vehicle + option;
    var cash = cashPct(row.cash);
    var fin = finance(row.mbm);
    var rate = cash == null && !fin.add ? null : (cash || 0) + fin.add;
    var altRate = fin.alt ? (cash || 0) + fin.alt : null;
    var afterPct = basis == null || rate == null ? basis : floorWon(basis * (1 - rate / 100));
    var normal = applyRate(basis, rate, extra);
    var altNormal = altRate == null ? null : applyRate(basis, altRate, extra);
    var tax = taxWon(vehicle, row);
    return {
      vehicle: vehicle,
      option: option,
      extra: extra,
      optionLabel: edition ? edition.optionLabel : "",
      points: edition && edition.points ? edition.points : [],
      basis: basis,
      cash: cash,
      finAdd: fin.add,
      altAdd: fin.alt,
      altLabel: fin.altLabel,
      rate: rate,
      altRate: altRate,
      afterPct: afterPct,
      normal: normal,
      early: tax && normal != null ? normal - tax : null,
      altNormal: altNormal,
      altEarly: tax && altNormal != null ? altNormal - tax : null,
      tax: tax
    };
  }
  function pctOf(s) {
    if (!s || s === "—") return 0;
    var m = String(s).match(/(\d+(?:\.\d+)?)%/);
    return m ? parseFloat(m[1]) : 0;
  }
  function leaseOnly(row) {
    var s = String(row.mbm || "");
    return s.indexOf("운용리스") !== -1 && s.indexOf("할부") === -1;
  }
  function payAdd(row, pay, q) {
    if (pay === "cash") return { add: 0, label: "현금 구매" };
    if (pay === "lease") {
      var add = q.altAdd || (leaseOnly(row) ? q.finAdd : 0);
      return { add: add || 0, label: "운용리스·장기렌트" };
    }
    if (leaseOnly(row)) return { add: 0, label: pay === "care" ? "안심보장할부" : "할부" };
    return { add: q.finAdd || 0, label: pay === "care" ? "안심보장할부" : "할부" };
  }
  function careMonth(name) {
    name = String(name || "");
    if (name.indexOf("S 63") !== -1) return 200;
    if (name.indexOf("GLS 63") !== -1) return 145;
    if (name.indexOf("GLE 53") !== -1) return 115;
    if (name.indexOf("E 53") !== -1) return 100;
    if (name.indexOf("GLB 35") !== -1) return 50;
    if (name.indexOf("GLE 450") !== -1) return 60;
    if (name.indexOf("electric") !== -1) return 0;
    if (name.indexOf("GLC 300") !== -1 && name.indexOf("AMG") !== -1) return 45;
    if (name.indexOf("GLC 300") !== -1 && name.toLowerCase().indexOf("avant") !== -1) return 40;
    if (name.indexOf("E 300") !== -1) return 45;
    if (name.indexOf("E 200") !== -1 && name.indexOf("AMG") !== -1) return 37;
    if (name.indexOf("E 200") !== -1 && name.indexOf("Exclusive") !== -1) return 35;
    if (name.indexOf("C 200") !== -1) return 30;
    return 0;
  }
  function defaultPay(row) {
    var q = of(row);
    if (leaseOnly(row) && (q.finAdd || q.altAdd)) return "lease";
    if (q.finAdd) return "install";
    return "cash";
  }
  /* 견적 페이지와 메인이 같이 쓰는 조건 계산.
   * 재고에만 해당하는 통관·전시·수리·주행거리는 state로 켰을 때만 반영합니다. */
  function scene(row, state) {
    state = state || {};
    var pay = state.pay || "cash";
    var q = of(row);
    var fin = payAdd(row, pay, q);
    var lines = [];
    var blocks = [];
    if (q.cash) lines.push({ label: "기본 할인", pct: q.cash });
    if (fin.add) lines.push({ label: fin.label, pct: fin.add });
    var extra = 0;
    function add(on, label, rate) {
      if (!on || !rate) return;
      extra += rate;
      lines.push({ label: label, pct: rate });
    }
    var retainRate = pctOf(row.retain);
    var conqRate = pctOf(row.conquest);
    if (state.retain && !retainRate) blocks.push("이 연식은 지금 타는 벤츠 혜택이 없습니다.");
    if (state.conquest && !conqRate) blocks.push("이 차종은 다른 브랜드 혜택 대상이 아닙니다.");
    if (state.retain && state.conquest && retainRate) {
      blocks.push("지금 타는 벤츠 혜택과 다른 브랜드 혜택은 같이 적용되지 않습니다. 지금 타는 벤츠 혜택만 반영했습니다.");
    }
    if (state.trade && !(state.retain && retainRate)) {
      blocks.push("인증 중고 매각은 지금 타는 벤츠 혜택과 같이만 적용됩니다.");
    }
    add(state.retain && retainRate, "지금 타는 벤츠", retainRate);
    add(state.trade && state.retain && retainRate, "인증 중고로 매각", 1);
    add(state.conquest && conqRate && !(state.retain && retainRate), "다른 브랜드", conqRate);
    add(state.mou, "MOU 제휴", 2);
    add(state.repair, "수리 이력 공개", 1);
    add(state.mile, "도착 주행거리", 1);
    add(state.showcar, "오래 전시된 차", 1);
    if (state.mou) blocks.push("MOU는 제휴 여부를 확인한 뒤에 적용됩니다.");
    if (state.repair || state.mile || state.showcar) {
      blocks.push("수리 이력, 주행거리, 전시 할인은 해당 재고인지 확인이 필요합니다.");
    }
    if (state.early) {
      blocks.push(q.tax ? "7월 1일 이전 통관 재고인지 확인이 필요합니다." : "이 차는 개소세 인하 재고 금액이 없습니다.");
    }
    var rate = (q.cash || 0) + fin.add + extra;
    var has = q.cash != null || fin.add || extra;
    var after = q.basis;
    if (after != null && has) after = floorWon(q.basis * (1 - rate / 100));
    if (after != null && q.extra) after -= q.extra;
    var tax = state.early && q.tax ? q.tax : 0;
    if (after != null && tax) after -= tax;
    var saved = q.basis != null && after != null ? q.basis - after : null;
    var month = pay === "care" ? careMonth(row.name) : 0;
    var status = "ok";
    if (q.basis == null || !has) status = "need";
    return {
      q: q,
      fin: fin,
      lines: lines,
      rate: has ? rate : 0,
      after: after,
      saved: saved,
      tax: tax,
      month: month,
      retainRate: retainRate,
      conqRate: conqRate,
      blocks: blocks,
      status: status,
      pay: pay
    };
  }
  window.BenzQuote = { of: of, man: man, scene: scene, defaultPay: defaultPay, floorWon: floorWon };
})();
