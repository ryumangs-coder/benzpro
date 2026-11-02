/* User-supplied joint campaign, confirmed as November despite the October heading.
 * Existing catalogue prices remain dated 2026-10-27. Unlisted terms are not renewed.
 */
(function () {
  var rules = {};
  function rule(cash, mbm, leaseExtra, rentalMbm, note) {
    return {cash:cash, mbm:mbm || 0, leaseAdd:(mbm || 0) + (leaseExtra || 0), rentalAdd:(rentalMbm == null ? (mbm || 0) : rentalMbm) + (leaseExtra || 0) + 3, note:note || ''};
  }
  function lookup(row) {
    var year = row.my || row[1], name = row.name || row[2], r = null;
    if (/^GLA 250 4MATIC$/.test(name) && /MY26|MY27/.test(year)) r = rule(9,4);
    if (year === 'MY26') {
      if (name === 'GLB 250 4MATIC') r = rule(13,4);
      if (name === 'AMG GLB 35 4MATIC') r = rule(9,4);
      if (name === 'AMG A 45 S 4MATIC+') r = rule(7,4);
      if (/^C 200 (Avantgarde|AMG Line|Final Edition)$/.test(name)) r = rule(10,4);
      if (name === 'E 200 Exclusive') r = rule(15,5);
      if (/^E 200 AMG Line(?: \(RoF Edition\))?$/.test(name)) r = rule(15,4);
      if (/^E 300 (?:4MATIC (?:Exclusive|AMG Line)|AMG Line \(140주년\))$/.test(name)) r = rule(10,4);
      if (name === 'AMG E 53 4MATIC+') r = rule(10,0);
      if (name === 'S 450 4MATIC (SWB)') r = rule(7,4,2);
      if (name === 'AMG S 63 E Performance') r = rule(10,0);
      if (/^Maybach S (580|680) 4MATIC$/.test(name)) r = rule(9,0,2);
      if (name === 'GLC 300 4MATIC Avantgarde') r = rule(7,4);
      if (/^GLC 300 4MATIC AMG Line(?: \((?:RoF|140주년)\))?$/.test(name)) r = rule(12,4);
      if (/^GLC 300 4MATIC Coupé AMG Line(?: \((?:RoF|140주년)\))?$/.test(name)) r = rule(9,4);
      if (name === 'GLE 350 4MATIC') r = rule(10,0);
      if (/^GLE 450 4MATIC(?: AMG Line)?(?: \(140주년\))?$/.test(name)) r = rule(12,4);
      if (name === 'GLE 450 d 4MATIC Coupé') r = rule(12,0);
      if (/^GLE 450 4MATIC (?:Coupé(?: \(140주년\))?|AMG Line Coupé)$/.test(name)) r = rule(15,4);
      if (name === 'AMG GLE 53 4MATIC+') r = rule(8,0);
      if (name === 'AMG GLE 53 4MATIC+ Coupé') r = rule(5,0);
      if (name === 'GLS 450 4MATIC AMG Line') r = rule(8,0);
      if (/^GLS 580 4MATIC(?: \(140주년\))?$/.test(name)) r = rule(9,0);
      if (name === 'Maybach GLS 600') r = rule(5,0);
      if (name === 'AMG G 63') r = rule(null,0);
      if (/^EQE (350\+(?: SUV)?|500 4MATIC)$/.test(name) || /^EQS (450|580) 4MATIC SUV$/.test(name)) r = rule(10,0,0,null,'장기렌탈 충전 바우처는 상담에서 확인합니다.');
    }
    if (/MY26|MY27/.test(year) && name === 'AMG GLS 63 4MATIC+') r = rule(1,0);
    if (year === 'MY27') {
      if (name === 'E 200 Exclusive') r = rule(14,4);
      if (name === 'E 200 AMG Line') r = rule(14,3);
      if (/^E 300 4MATIC (Exclusive|AMG Line)$/.test(name)) r = rule(8,4);
      if (/^S (350 d 4MATIC|450 4MATIC(?: Long (?:AMG Line|Exclusive))?|500 4MATIC Long|580 4MATIC Long)$/.test(name) || /^Maybach S (580(?: MANUFAKTUR)?|680)$/.test(name)) r = rule(null,0,0,null,'재구매 특별 금융은 운용리스·장기렌트 대상이며 별도 확인이 필요합니다.');
      if (/^GLC 300 4MATIC(?: Avantgarde| AMG Line)?$/.test(name)) r = rule(7,1);
      if (/^GLC 300 4MATIC Coupé(?: Avantgarde| AMG Line(?: \(이후 생산\))?)?$/.test(name)) r = rule(7,1,0,0,'장기렌탈은 MBM 추가 1%를 중복 적용하지 않습니다.');
    }
    return r;
  }
  var data = window.OCTOBER_2026;
  if (data) {
    data.asOfPromo = '2026.11.02';
    if (!data.models.some(function (r) { return r[1] === 'MY27' && r[2] === 'AMG GLS 63 4MATIC+'; })) {
      data.models.push(['SUV','MY27','AMG GLS 63 4MATIC+',null,'1%','','','','','','11월 표 기본 할인 1%. 이 연식의 차량가는 상담에서 확인합니다.']);
    }
    data.models.forEach(function (row) {
      var r = lookup(row);
      if (!r) return;
      rules[row[1] + '|' + row[2]] = r;
      row[4] = r.cash == null ? '—' : r.cash + '%';
      row[5] = r.leaseAdd !== r.mbm ? '할부 +' + r.mbm + '% · 운용리스 +' + r.leaseAdd + '%' : (r.mbm ? '+' + r.mbm + '%' : '');
      if (row[1] === 'MY27' && /^GLC 300 4MATIC Coupé/.test(row[2])) {
        row[10] = String(row[10] || '').replace('할인은 이후 생산분과 같은 5%', '11월 기본 할인 7%, MBM 추가 1% (장기렌탈 제외)').replace('2026.10.22 프로모션 5%', '11월 기본 할인 7%, MBM 추가 1% (장기렌탈 제외)');
      }
    });
  }
  window.BenzCampaign = {
    of:function (row) { return rules[(row.my || row[1]) + '|' + (row.name || row[2])] || null; },
    note:function (row) {
      var r = this.of(row);
      return r ? '11월 적용표 기준입니다. 월납 지원 등 별도 혜택은 11월 적용 여부를 상담에서 확인합니다. MBMK 장기렌탈은 추가 3%가 포함됩니다. 운용리스와 장기렌탈 조건은 구분합니다. ' + r.note : '이 차종의 11월 조건은 확인 중입니다. 표시 금액은 직전 확인 조건이며, 최종 조건은 상담에서 확인합니다.';
    }
  };
})();
