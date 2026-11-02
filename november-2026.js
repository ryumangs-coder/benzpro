/* November 2 partner package: customer retail terms only. Prices remain 2026-10-27. */
(function () {
  var rules = {}, source = window.NOVEMBER_RETAIL || [];
  function normalize(name) {
    return String(name).toUpperCase().replace(/M-AMG/g,'AMG').replace(/^MM /,'MAYBACH ')
      .replace(/4MATIC/g,'4M').replace(/COUPÉ|\bCP\b/g,'COUPE').replace(/\bEX\b/g,'EXCLUSIVE').replace(/\bAV\b/g,'AVANTGARDE')
      .replace(/AMGLINE/g,'AMG LINE').replace(/AMG LINE COUPE/g,'COUPE AMG LINE').replace(/SEDAN/g,'')
      .replace(/\((?:C192|X290|별도 구성|이후 생산)\)/g,'').replace(/140주년 EDITION/g,'140주년').replace(/ROF EDITION/g,'ROF')
      .replace(/\s+/g,'').replace(/^AMGA45S4M\+$/,'AMGA45S4M').replace(/^AMGCLA45S4M\+$/,'AMGCLA45S4M').replace(/^AMGSL634M\+$/,'AMGSL63');
  }
  function names(r) {
    var n=r.name;
    if (/^EQA 250 \(/.test(n)) return ['EQA 250 Progressive','EQA 250 AMG Line'];
    if (/^EQB 300 4M \(/.test(n)) return ['EQB 300 4MATIC Progressive','EQB 300 4MATIC AMG Line'];
    if (/^G 450 d \(/.test(n)) return ['G 450 d','G 450 d MANUFAKTUR'];
    if (/^G 580 \(/.test(n)) return ['G 580','G 580 MANUFAKTUR'];
    if (/^M-AMG G 63 \(/.test(n)) return ['AMG G 63','AMG G 63 MANUFAKTUR'];
    if (/^MM GLS 600 \(/.test(n)) return ['Maybach GLS 600','Maybach GLS 600 MANUFAKTUR'];
    if (/^MM S 580.*(?:MANUFAKTUR|Incl)/.test(n)) return r.my==='MY26' ? ['Maybach S 580 4MATIC'] : ['Maybach S 580','Maybach S 580 MANUFAKTUR'];
    if (n==='MM EQS 680 4M') return ['Maybach EQS 680 SUV'];
    if (/^CLA220 \(ICE\)/.test(n)) return ['CLA 220','CLA 220 AMG Line'];
    if (/^CLA 200 \(Incl/.test(n)) return ['CLA 200 electric Essential','CLA 200 electric Advanced','CLA 200 electric AMG Line'];
    if (/^CLA 250\+ \(Incl/.test(n)) return ['CLA 250+ electric','CLA 250+ electric AMG Line'];
    if (/^GLC 300 4M electric/.test(n)) return ['GLC 300 4MATIC electric','GLC 300 4MATIC electric AMG Line','GLC 300 4MATIC electric AMG Line+'];
    return [n];
  }
  var byName={};
  source.forEach(function(r){names(r).forEach(function(n){byName[r.my+'|'+normalize(n)]=r;});});
  var data=window.OCTOBER_2026;
  if(data){
    data.asOfPromo='2026.11.02';
    data.models.forEach(function(row){
      var s=byName[row[1]+'|'+normalize(row[2])];
      if(!s && row[1]==='MY27' && row[2]==='GLC 300 4MATIC Coupé')s=byName['MY27|'+normalize('GLC 300 4MATIC Coupé AV')];
      if(!s && /^(GLE|GLS) /.test(row[2]))s=byName[row[1]+'|'+normalize(row[2].replace(' (140주년)',''))];
      if(!s)return;
      var r=Object.assign({},s,{rentalAdd:null,rentalNeedQuote:true});
      // Rental Fleet 3% is channel-dependent, not an automatic retail add-on (pp.33–37).
      if(row[1]==='MY26' && /^Maybach S /.test(row[2]))r.rentalProductAdd=2;
      else if(s.mbm)r.rentalProductAdd=s.leaseAdd;
      else r.rentalProductAdd=0;
      rules[row[1]+'|'+row[2]]=r;
      row[4]=s.cashWon ? '100만원' : s.cash==null ? '—' : s.cash+'%';
      row[5]=s.leaseAdd!==s.mbm ? '할부 +'+s.mbm+'% · 운용리스 +'+s.leaseAdd+'%' : s.mbm ? '+'+s.mbm+'%' : '';
      row[7]=s.retain ? '+'+s.retain+'%' : '';
      row[8]=s.conquest ? '+'+s.conquest+'%' : '';
      if(row[1]==='MY27' && /^GLC 300 4MATIC Coupé/.test(row[2]))row[10]=String(row[10]||'').replace('할인은 이후 생산분과 같은 5%','11월 기본 할인 7%, 금융 추가 1%').replace('2026.10.22 프로모션 5%','11월 기본 할인 7%, 금융 추가 1%');
    });
  }
  window.BenzCampaign={
    of:function(row){return rules[(row.my||row[1])+'|'+(row.name||row[2])]||null;},
    isS27:function(row){return (row.my||row[1])==='MY27' && /^(S |Maybach S )/.test(row.name||row[2]);},
    note:function(row){var r=this.of(row);return r ? '2026년 11월 확인 조건입니다. 장기렌탈은 판매 채널에 따라 조건이 달라 별도 견적을 확인합니다.' : '이 차종은 11월 상세 조건을 상담에서 확인합니다. 표시 금액은 직전 확인 자료입니다.';},
    source:source,
    normalize:normalize
  };
})();
