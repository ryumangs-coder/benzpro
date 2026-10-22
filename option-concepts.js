/* ------------------------------------------------------------------
   옵션 이름 통일 (option-concepts.js)
   같은 기능인데 차마다 이름이 달라서 '한쪽은 있음, 한쪽은 없음'으로 보이던 오류를 막습니다.
   - 이름이 달라도 같은 기능이면 한 줄로 묶어서 비교합니다. (예: 휠, 서스펜션, 사운드 시스템, 온열 윈드스크린)
   - 단계가 있는 기능(휠·서스펜션·사운드·내비게이션 등)은 '있다/없다'가 아니라 두 차의 종류를 나란히 보여 줍니다.
   - 어느 쪽 자료에도 적혀 있지 않은 항목은 '없음'으로 단정하지 않고 비교에서 뺍니다.
   쓰는 곳: models.html (옵션 비교)
------------------------------------------------------------------ */
(function () {
  var GENERIC = /^(기본 적용|적용|포함|기본|미적용|없음|—|-|해당 없음|유료 선택|선택)$/;

  function stOf(s) {
    s = String(s || "").trim();
    if (/^(기본 적용|적용|포함|기본)$/.test(s)) return "yes";
    if (/^(선택|유료 선택)$/.test(s)) return "opt";
    if (/^(미적용|없음|—|-|해당 없음)$/.test(s)) return "no";
    return "yes";
  }
  function squash(s) { return String(s || "").replace(/[\s\-·,()]/g, "").toLowerCase(); }
  function has(re, s) { return re.test(s); }

  /* ---- 값 정리 함수 ---- */
  function tidyWheel(t) {
    var s = String(t || "")
      .replace(/(\d+)\s*-\s*인치/, "$1인치")
      .replace(/-\s*/g, "")
      .replace(/\s*,\s*/g, ", ")
      .replace(/\s*(경량 )?알로이 휠/, "")
      .replace(/\s*휠(?=\s*,|$)/, "")
      .replace(/(\d)\s*트윈/g, "$1 트윈")
      .replace(/(\d)\s*스포크/g, "$1 스포크")
      .replace(/멀티\s*스포크/g, "멀티 스포크")
      .replace(/\s+/g, " ")
      .trim();
    return s;
  }
  function wheelParts(t) {
    var s = String(t || "");
    var size = (s.match(/(\d+)\s*인치/) || [])[1] || "";
    var amg = /AMG/i.test(s) ? "A" : "";
    var design = s.replace(/\d+\s*인치/, "").replace(/AMG|MANUFAKTUR버전/gi, "").replace(/휠/g, "");
    return { size: size, amg: amg, design: squash(design) };
  }
  function wheelEq(a, b) {
    var x = wheelParts(a);
    var y = wheelParts(b);
    if (x.size !== y.size || x.amg !== y.amg) return false;
    return !x.design || !y.design || x.design === y.design;
  }
  function lineName(t) {
    var s = String(t || "");
    if (/AMG ?(Line|라인)/i.test(s)) return "AMG 라인";
    if (/바디 ?스타일링/.test(s)) return "AMG 바디스타일링";
    if (/AMG/.test(s)) return "AMG";
    if (/익스클루시브|EXCLUSIVE/i.test(s)) return "익스클루시브";
    if (/아방가르드|AVANTGARDE/i.test(s)) return "아방가르드";
    if (/프로그레시브|PROGRESSIVE/i.test(s)) return "프로그레시브";
    if (/일렉트릭 아트/.test(s)) return "일렉트릭 아트";
    if (/수페리어/.test(s)) return "수페리어";
    if (/V8/.test(s)) return "V8 스타일링";
    if (/메르세데스-벤츠 스타일링/.test(s)) return "벤츠 스타일링";
    return s.replace(/익스테리어|인테리어|외장|내장/g, "").trim() || s;
  }
  function seatMat(t) {
    var s = String(t || "");
    var amg = /AMG/.test(s) ? "AMG " : "";
    if (/나파 ?룩/.test(s)) return /마이크로컷/.test(s) ? "나파 룩 · 마이크로컷" : "아티코 나파 룩";
    if (/나파/.test(s)) return amg + "나파 가죽";
    if (/마이크로컷/.test(s)) return "아티코 · 마이크로컷";
    if (/인조가죽/.test(s)) return "아티코 인조가죽";
    if (/아티코/.test(s)) return "아티코 가죽";
    return "가죽";
  }
  function trimName(t) {
    return String(t || "").replace(/\s*,\s*(블랙|트림)$/, "").replace(/\s*·\s*블랙$/, "").replace(/\s*,\s*트림/, "").replace(/\s*트림\s*$/, "").replace(/\s+/g, " ").trim();
  }
  function rankOf(list, text) {
    for (var i = 0; i < list.length; i++) if (list[i][0].test(text)) return list[i][1];
    return 0;
  }
  function labelOf(list, text, dflt) {
    for (var i = 0; i < list.length; i++) if (list[i][0].test(text)) return list[i][2] || dflt;
    return dflt;
  }

  var SOUND = [
    [/하이엔드.*4D/, 6, "부메스터 하이엔드 4D"], [/하이엔드.*3D/, 5, "부메스터 하이엔드 3D"], [/4D/, 4, "부메스터 4D"],
    [/3D/, 3, "부메스터 3D"], [/부메스터/, 2, "부메스터 서라운드"], [/어드밴스드/, 1, "어드밴스드 사운드"]
  ];
  var NAV = [[/증강 ?현실/, 2, "증강현실 내비게이션"], [/프리미엄/, 1, "내비게이션 프리미엄"]];
  var SUSP = [
    [/에어매틱/, 10, "에어매틱"], [/E- ?액티브 바디/, 9, "E-액티브 바디 컨트롤"], [/다이내믹 바디/, 8, "다이내믹 바디 컨트롤"],
    [/AMG.*액티브 라이드/, 7, "AMG 액티브 라이드 컨트롤"], [/AMG.*라이드/, 6, "AMG 라이드 컨트롤"], [/AMG 서스펜션/, 5, "AMG 서스펜션"],
    [/어질리티/, 4, "어질리티 컨트롤"], [/어댑티브/, 3, "어댑티브 댐핑"], [/스포츠/, 2, "스포츠"], [/컴포트/, 1, "컴포트"]
  ];
  var SEAT = [
    [/AMG/, 6, "AMG 퍼포먼스 시트"], [/일등석/, 5, "일등석 뒷좌석 시트"], [/이그제큐티브/, 4, "이그제큐티브 시트"],
    [/럭셔리/, 3, "럭셔리 시트"], [/스포츠/, 2, "스포츠 시트"], [/컴포트/, 1, "컴포트 시트"]
  ];

  /* ---- 묶음 규칙 (위에서부터 먼저 맞는 것) ----
     mode: flag(있음/선택/없음) · tier(종류를 나란히 보여 줌)
     none: tier에서 한쪽에 아무 표시가 없을 때 보여 줄 말. null이면 한쪽만 있는 줄은 비교에서 뺍니다. */
  var RULES = [
    { key: "wheel", label: "기본 휠", cat: "외관·생활 편의", mode: "tier", yesOnly: true, none: null,
      re: /^\d{2}-? ?인치|^기본 휠$/, val: tidyWheel, eq: wheelEq },
    { key: "sound", label: "사운드 시스템 (부메스터 등)", cat: "디스플레이·오디오", mode: "tier", none: "기본 오디오",
      re: /부메스터|^프리미엄 오디오$|어드밴스드 사운드|^사운드 시스템$/,
      val: function (t) { return labelOf(SOUND, t, "프리미엄 오디오"); }, rank: function (t) { return rankOf(SOUND, t); } },
    { key: "nav", label: "MBUX 내비게이션", cat: "디스플레이·오디오", mode: "tier", none: "기본 내비게이션",
      re: /증강 ?현실 내비|내비게이션 프리미엄/,
      val: function (t) { return labelOf(NAV, t, "내비게이션"); }, rank: function (t) { return rankOf(NAV, t); } },
    { key: "parkassist", label: "주차 어시스트 (자동 주차)", cat: "안전·주차", mode: "flag", re: /주차 어시스트|파크트로닉/ },
    { key: "remotepark", label: "원격 주차 패키지", cat: "안전·주차", mode: "flag", re: /원격 주차/ },
    { key: "enginesound", label: "엔진 사운드 (스포티·AMG)", cat: "디스플레이·오디오", mode: "tier", none: "—", re: /엔진 사운드|^AMG 퍼포먼스 사운드$/,
      val: function (t) { return /AMG/.test(t) ? "AMG 퍼포먼스 사운드" : "스포티 엔진 사운드"; }, rank: function (t) { return /AMG/.test(t) ? 1 : 0; } },
    { key: "heatwind", label: "온열 윈드스크린", cat: "디스플레이·오디오", mode: "flag", re: /온열 윈드 ?스크린|히티드 윈드 ?스크린/ },
    { key: "rearscreen", label: "뒷좌석 엔터테인먼트 화면", cat: "디스플레이·오디오", mode: "flag", re: /^MBUX 하이엔드 뒷좌석|^MBUX 뒷좌석 태블릿|^뒷좌석 화면$/ },
    { key: "wirelessF", label: "앞좌석 무선 충전", cat: "실내 편의", mode: "flag", re: /^앞좌석 (듀얼 )?무선 충전/ },
    { key: "wirelessR", label: "뒷좌석 무선 충전", cat: "실내 편의", mode: "flag", re: /^뒷좌석 무선 충전/ },
    { key: "usb", label: "USB 패키지", cat: "실내 편의", mode: "tier", none: "—", re: /^USB 패키지/,
      val: function (t) { return /플러스/.test(t) ? "USB 패키지 플러스" : "USB 패키지"; }, rank: function (t) { return /플러스/.test(t) ? 1 : 0; } },
    { key: "mcR", label: "뒷좌석 멀티컨투어 시트", cat: "시트·공간", mode: "flag", re: /^뒷좌석 멀티컨투어/ },
    { key: "mcF", label: "앞좌석 멀티컨투어 시트", cat: "시트·공간", mode: "tier", none: "—", re: /멀티컨투어|^시트 마사지·컨투어$/,
      val: function (t) { return /액티브/.test(t) ? "액티브 멀티컨투어" : "멀티컨투어"; }, rank: function (t) { return /액티브/.test(t) ? 1 : 0; } },
    { key: "rearpower", label: "뒷좌석 전동 시트", cat: "시트·공간", mode: "flag", re: /뒷좌석 전동 ?시트|^뒷좌석 시트 조절/ },
    { key: "mem", label: "메모리 시트", cat: "시트·공간", mode: "flag", re: /^(운전석 |동반석 |앞좌석 )?메모리 (시트|패키지)$/ },
    { key: "lumbar", label: "요추 지지대 (허리 받침)", cat: "시트·공간", mode: "flag", re: /요추 지지대/ },
    { key: "chauffeur", label: "쇼퍼 패키지", cat: "시트·공간", mode: "flag", re: /^쇼퍼 패키지|^앞좌석 쇼퍼 포지션/ },
    { key: "seattype", label: "시트 종류", cat: "시트·공간", mode: "tier", none: null,
      re: /^(스포츠|컴포트|럭셔리|이그제큐티브) 시트$|^AMG 퍼포먼스 시트|^AMG Line 스포츠 시트|^일등석 뒷좌석 시트$/,
      val: function (t) { return labelOf(SEAT, t, t); }, rank: function (t) { return rankOf(SEAT, t); } },
    { key: "rearclimate", label: "뒷좌석 자동 온도 조절", cat: "실내 편의", mode: "flag", re: /^뒷좌석 자동 온도 조절/ },
    { key: "climate", label: "자동 온도 조절", cat: "실내 편의", mode: "tier", none: "—", re: /^자동 온도 조절 시스템|^[24] ?존 온도 조절|^온도 조절$/,
      val: function (t) { return /4 ?존/.test(t) ? "4존" : (/2 ?존/.test(t) ? "2존" : "자동"); },
      rank: function (t) { return /4 ?존/.test(t) ? 2 : (/2 ?존/.test(t) ? 1 : 0); },
      eq: function (a, b) { return a === b || a === "자동" || b === "자동"; } },
    { key: "heatwheel", label: "열선 스티어링 휠", cat: "실내 편의", mode: "flag", re: /열선 스티어링 휠/ },
    { key: "energizing", label: "에너자이징 (컨디션 케어)", cat: "실내 편의", mode: "tier", none: "—", re: /^에너자이징/,
      val: function (t) { return /플러스/.test(t) ? "에너자이징 패키지 플러스" : (/컴포트/.test(t) ? "에너자이징 컴포트" : "에너자이징 패키지"); },
      rank: function (t) { return /플러스/.test(t) ? 2 : (/컴포트/.test(t) ? 0 : 1); } },
    { key: "cup", label: "컵홀더", cat: "실내 편의", mode: "tier", none: "컵홀더", re: /컵홀더/,
      val: function (t) { return /온도 조절/.test(t) ? "온도 조절식 컵홀더" : "컵홀더"; }, rank: function (t) { return /온도 조절/.test(t) ? 1 : 0; } },
    { key: "airscarf", label: "에어스카프 (목 히터)", cat: "실내 편의", mode: "flag", re: /에어스카프/ },
    { key: "aircap", label: "에어캡 (바람막이)", cat: "실내 편의", mode: "flag", re: /에어캡/ },
    { key: "int", label: "실내 디자인 (인테리어 라인)", cat: "실내 편의", mode: "tier", none: "—", re: /인테리어|^수페리어 라인/, val: lineName },
    { key: "trim", label: "실내 장식 트림", cat: "실내 편의", mode: "tier", none: null,
      re: /트림|우드$|우드,|^기본 실내 장식$/, val: trimName,
      eq: function (a, b) { return squash(a) === squash(b); } },
    { key: "upholstery", label: "시트 소재", cat: "시트·공간", mode: "tier", none: null,
      re: /^(?!.*(스티어링|루프 라이너|시트 벨트)).*(가죽|아티코|마이크로컷)|^시트 소재$|^가죽 패키지$/, val: seatMat,
      eq: function (a, b) { return a === b || a === "가죽" || b === "가죽"; } },
    { key: "ext", label: "외관 디자인 (익스테리어 라인)", cat: "외관·생활 편의", mode: "tier", none: "—",
      re: /익스테리어|외장$|^외관 디자인$|^메르세데스-벤츠 스타일링|바디 ?스타일링|스타일링 패키지|^(AMG Line|EXCLUSIVE|AVANTGARDE|PROGRESSIVE)$|^(프로그레시브|아방가르드|익스클루시브) 라인$/i, val: lineName },
    { key: "glass", label: "열·소음 차단 유리", cat: "외관·생활 편의", mode: "flag", re: /소음 차단|차음·단열|어쿠스틱 글래스|열·소음/ },
    { key: "keyless", label: "키레스 고", cat: "외관·생활 편의", mode: "tier", none: "—", re: /^키레스 ?-? ?고|^핸즈 프리 액세스|^플러시 도어 핸들 키레스/,
      val: function (t) { return /컴포트|컨비니언스|핸즈 프리|플러시/.test(t) ? "키레스 고 컴포트" : "키레스 고"; },
      rank: function (t) { return /컴포트|컨비니언스|핸즈 프리|플러시/.test(t) ? 1 : 0; } },
    { key: "comfortdoor", label: "컴포트 도어", cat: "외관·생활 편의", mode: "flag", re: /컴포트 도어/ },
    { key: "powerclose", label: "파워 클로징", cat: "외관·생활 편의", mode: "flag", re: /파워 클로징/ },
    { key: "frunk", label: "전면 트렁크 (프렁크)", cat: "외관·생활 편의", mode: "flag", re: /전면 트렁크|프렁크|전면부 프렁크/ },
    { key: "trunk", label: "전동 트렁크", cat: "외관·생활 편의", mode: "flag", re: /전동 트렁크/ },
    { key: "susp", label: "서스펜션", cat: "주행·승차감", mode: "tier", none: null,
      re: /서스펜션|에어매틱|바디 컨트롤|라이드 컨트롤|어질리티|^컴포트$|^스포츠$/,
      val: function (t) { return labelOf(SUSP, t, t); }, rank: function (t) { return rankOf(SUSP, t); } },
    { key: "rearsteer", label: "후륜 조향", cat: "주행·승차감", mode: "tier", none: "—", re: /후륜 조향/,
      val: function (t) { var m = String(t).match(/(\d+(?:\.\d+)?)°/); return m ? m[1] + "°" : "있음"; },
      rank: function (t) { return /°/.test(t) ? 1 : 0; },
      eq: function (a, b) { return a === b || a === "있음" || b === "있음"; } },
    { key: "frontlift", label: "프론트 액슬 리프트", cat: "주행·승차감", mode: "flag", re: /앞차축 리프트|프론트 액슬 리프트/ },
    { key: "runboard", label: "러닝보드", cat: "외관·생활 편의", mode: "flag", re: /러닝보드/ },
    { key: "ac", label: "AC 충전 시스템", cat: "충전·전기차 기능", mode: "flag", re: /^AC 충전|^AC 온보드/ },
    { key: "dc", label: "DC 충전 시스템", cat: "충전·전기차 기능", mode: "tier", none: "—", re: /^DC 충전/,
      val: function (t) { var m = String(t).match(/(\d{3})V/); return m ? "DC 충전 " + m[1] + "V" : "DC 충전"; },
      rank: function (t) { return /\dV/.test(t) ? 1 : 0; },
      eq: function (a, b) { return a === b || a === "DC 충전" || b === "DC 충전"; } },
    { key: "cable", label: "충전 케이블", cat: "충전·전기차 기능", mode: "flag", re: /충전 케이블/ },
    { key: "heatpump", label: "히트펌프", cat: "충전·전기차 기능", mode: "flag", re: /히트 ?펌프/ }
  ];

  function ruleOf(text) {
    var s = String(text || "");
    for (var i = 0; i < RULES.length; i++) if (RULES[i].re.test(s)) return RULES[i];
    return null;
  }

  /* 한 차의 자료(gear + options)를 낱개 항목으로 풀어 줍니다. */
  function flat(rec) {
    var out = [];
    ((rec && rec.gear) || []).forEach(function (g) { out.push({ text: g[1], st: stOf(g[2]), pair: "" }); });
    ((rec && rec.options) || []).forEach(function (p) { out = out.concat(flatPair(p)); });
    return out;
  }
  function flatPair(p) {
    var out = [];
    var lab = String(p[0] || "");
    var val = String(p[1] == null ? "" : p[1]).trim();
    if (!val || val === "확인 필요") return out;
    if (GENERIC.test(val)) { out.push({ text: lab, st: stOf(val), pair: lab }); return out; }
    val.split(/\s*\/\s*/).forEach(function (part) {
      var st = "yes";
      if (/·\s*(유료 )?선택$/.test(part)) { st = "opt"; part = part.replace(/\s*·\s*(유료 )?선택$/, ""); }
      out.push({ text: part.trim(), st: st, pair: lab });
    });
    return out;
  }

  function resolve(rule, list) {
    if (!list.length) return null;
    var yes = list.filter(function (x) { return x.st === "yes"; });
    var opt = list.filter(function (x) { return x.st === "opt"; });
    var no = list.filter(function (x) { return x.st === "no"; });
    if (rule.mode === "flag") return yes.length ? { k: "yes" } : (opt.length ? { k: "opt" } : { k: "no" });
    var pool = yes.length ? yes : (rule.yesOnly ? [] : opt);
    if (pool.length) {
      var best = pool[0];
      var rk = rule.rank ? rule.rank(best.text) : 0;
      pool.forEach(function (x) {
        var r = rule.rank ? rule.rank(x.text) : 0;
        if (r > rk) { best = x; rk = r; }
      });
      return { k: yes.length ? "yes" : "opt", v: rule.val ? rule.val(best.text) : best.text };
    }
    return no.length ? { k: "no" } : null;
  }

  /* skip(text): 이미 다른 기준(기본 사양 대조)이 맡은 이름이면 true */
  function build(rec, skip) {
    var map = {};
    flat(rec).forEach(function (it) {
      if (skip && skip(it.text)) return;
      var rule = ruleOf(it.text) || labelRule(it);
      if (!rule) return;
      (map[rule.key] = map[rule.key] || []).push(it);
    });
    var out = {};
    RULES.forEach(function (rule) {
      var r = map[rule.key] ? resolve(rule, map[rule.key]) : null;
      if (r) out[rule.key] = r;
    });
    return out;
  }

  /* 이 항목(이름 하나, 또는 옵션 요약 한 줄)이 위 규칙에 묶이는가 */
  /* 값이 "브라운 메이플 우드·알루미늄 라인"처럼 이름만 있는 경우, 항목명(기본 실내 장식)으로 판단 */
  function labelRule(it) {
    var r = it.pair ? ruleOf(it.pair) : null;
    return r && r.key === "trim" ? r : null;
  }
  function mapped(text, skip) {
    if (skip && skip(text)) return false;
    return !!ruleOf(text);
  }
  function pairMapped(pair, skip) {
    return flatPair(pair).some(function (it) { return mapped(it.text, skip) || !!labelRule(it); });
  }

  function pair(recA, recB, opt) {
    opt = opt || {};
    var a = build(recA, opt.skip);
    var b = build(recB, opt.skip);
    var rows = [];
    RULES.forEach(function (rule) {
      var x = a[rule.key] || null;
      var y = b[rule.key] || null;
      if (!x && !y) return;
      if (opt.oneThin && ((opt.thinA && !x) || (opt.thinB && !y))) return;
      var on = function (s) { return !!s && s.k !== "no"; };
      if (!on(x) && !on(y)) return;
      var row;
      if (rule.mode === "flag") {
        var lt = x && x.k === "yes" ? "●" : (x && x.k === "opt" ? "선택" : "—");
        var rt = y && y.k === "yes" ? "●" : (y && y.k === "opt" ? "선택" : "—");
        row = { left: lt, right: rt, kl: lt === "●" ? "yes" : (lt === "선택" ? "opt" : "no"), kr: rt === "●" ? "yes" : (rt === "선택" ? "opt" : "no"), differ: lt !== rt, detail: "" };
      } else {
        if (rule.none === null && (!on(x) || !on(y))) return;
        var noneA = rule.none;
        var noneB = rule.none;
        if (rule.key === "ext" || rule.key === "int") {
          if (/^AMG /.test(opt.nameA || "")) noneA = "AMG";
          if (/^AMG /.test(opt.nameB || "")) noneB = "AMG";
          if (/^Maybach/.test(opt.nameA || "")) noneA = "마이바흐";
          if (/^Maybach/.test(opt.nameB || "")) noneB = "마이바흐";
        }
        var va = on(x) ? x.v : noneA;
        var vb = on(y) ? y.v : noneB;
        var oa = on(x) && x.k === "opt";
        var ob = on(y) && y.k === "opt";
        var same = rule.eq ? rule.eq(va, vb) : squash(va) === squash(vb);
        var differ = !same || oa !== ob;
        row = {
          left: va + (oa ? " (선택)" : ""), right: vb + (ob ? " (선택)" : ""),
          kl: !on(x) ? "no" : (oa ? "opt" : "yes"), kr: !on(y) ? "no" : (ob ? "opt" : "yes"),
          differ: differ, detail: !differ && on(x) ? va : ""
        };
      }
      row.cat = rule.cat;
      row.label = rule.label;
      row.key = rule.key;
      rows.push(row);
    });
    return rows;
  }

  window.BenzConcepts = { rules: RULES, ruleOf: ruleOf, mapped: mapped, pairMapped: pairMapped, flat: flat, build: build, pair: pair };
})();
