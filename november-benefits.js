/* Customer benefits only. No partner commissions, staff rewards or internal processes. */
(function(){
  function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function isS(row){return (row.my||row[1])==='MY27'&&/^(S |Maybach S )/.test(row.name||row[2]);}
  function sClass(compact){
    var lead='<section class="nov-benefit nov-s"><p class="nov-kicker">2027년식 S클래스 · 마이바흐 S 포함</p><h3>벤츠를 다시 살수록<br>보증 혜택도 커집니다</h3>';
    if(compact)return lead+'<p>총 3번째 구매: 보증 <b>+1년·3만km</b><br>총 4번째 이상: 보증 <b>+2년·7만km</b></p><p class="nov-small">현재 E클래스 이상 대상 차량 보유 등 조건 충족 시. 재구매 2%·인증중고 매각 1%는 각각 조건 확인.</p><a class="nov-link" href="november.html#retention">구매 횟수별 혜택 자세히 보기 →</a></section>';
    return lead+'<p>현재 E클래스 이상 대상 차량을 보유하고, 2027년식 S클래스를 구매하는 고객의 <b>과거 벤츠 보유 이력</b>을 확인합니다. 과거 차량은 차종과 신차·중고차 여부를 가리지 않습니다.</p><div class="nov-steps"><article><span>총 2번째 구매 · 1차 재구매</span><strong>재구매 할인 2%</strong><p>조건에 맞게 기존 벤츠를 인증중고로 매각하면 1% 추가. 이 단계에는 횟수에 따른 추가 보증이 없습니다.</p></article><article><span>총 3번째 구매 · 2차 재구매</span><strong>보증 +1년 · 3만km</strong><p>재구매 2%와 해당 시 인증중고 매각 1%에 더해 보증을 연장합니다.</p></article><article><span>총 4번째 이상 · 3차 이상 재구매</span><strong>보증 +2년 · 7만km</strong><p>재구매 2%와 해당 시 매각 1%에 더해 보증을 연장합니다. 특별 재구매 운용리스 이용 시 별도 케어 서비스도 확인하세요.</p></article></div><p class="nov-small">1년·3만km 연장은 최대 4년·13만km, 2년·7만km 연장은 최대 5년·17만km이며 먼저 도래한 기준까지입니다. 보유 이력과 명의·증빙 확인 후 적용하며 다른 브랜드 혜택과 중복되지 않습니다.</p><details><summary>현재 보유 차종·케어 서비스 확인</summary><p>대상: E클래스, CLE, CLS, AMG GT 4도어, S클래스·마이바흐 S, GLE, GLS, EQE·EQE SUV, EQS·EQS SUV, 대상 G클래스 등. G클래스 등 세부 대상 형식은 상담에서 확인합니다. 현재 차량은 구매월 기준 과거 3개월 내 보유 이력을 확인합니다.</p><p>특별 재구매 운용리스의 케어는 최대 3년: 외장·유리·선루프·사이드미러 손상 보상, 타이어 파손 총 1회·최대 좌우 2개 교환, 사고 시 조건을 충족하면 신차교환 보상입니다.</p></details><details><summary>사전계약 혜택·여행상품권은 별도 조건입니다</summary><p>기존 S클래스 고객이 2026년 5월 18일~7월 31일 사전계약하고 12월 31일까지 대상 신형 S클래스를 구매하는 별도 프로그램은 현금 구매 시 보증 +1년·3만km, 대상 금융 이용 시 최대 +2년·7만km를 안내합니다. 현재 신규 계약자가 과거 사전계약 혜택을 자동으로 받는 것은 아닙니다.</p><p>11월 중 대상 재구매 특별 운용리스·장기렌탈을 실행한 고객은 여행상품권 100만원을 별도 확인하세요. 지급 전 취소·중도해지 시 제외됩니다. 보증 프로그램끼리는 자동 합산하지 않고 최종 적용 상품을 확인합니다.</p></details><a class="nov-link" href="index.html?note=S클래스%20재구매횟수별%20보증연장%20상담#consulting">내 구매 이력으로 보증 혜택 확인하기 →</a></section>';
  }
  function html(row,state){
    state=state||{};var name=row.name||row[2]||'',year=row.my||row[1];
    if(isS(row))return sClass(!!state.compact) + (/^Maybach /.test(name) ? '<section class="nov-benefit"><h3>마이바흐 고객 문화 혜택</h3><p>11~12월 구매 고객은 오페라의 유령 프리미엄석 2매를 확인하세요. 한국여자오픈 특별 라운딩은 100명 추첨입니다.</p><a class="nov-link" href="november.html">공연·추첨 상세 조건 보기 →</a></section>' : '');
    var items=[];
    var campaign=window.BenzCampaign&&window.BenzCampaign.of(row);
    if(campaign&&campaign.cashWon)items.push('<b>차량가 100만원 정액 할인</b> — 할인율로 바꾸지 않고 한 번만 반영합니다.');
    if(campaign&&campaign.ew&&year!=='MY27'&&/^Maybach S /.test(name))items.push('<b>보증연장 +2년·7만km</b> — 최대 5년·17만km, 먼저 도래한 기준까지. 대상 차량·동의서·등록 확인 후 적용합니다.');
    if(campaign&&campaign.ew&&/EQA|EQB|EQE|EQS|^G 580/.test(name))items.push('<b>대상 전기차 보증연장 +2년·7만km</b> — 최대 5년·17만km. CLA·GLC 전기차는 이 보증 캠페인 제외입니다.');
    if(/^Maybach /.test(name))items.push('<b>11~12월 마이바흐 구매 고객</b> — 오페라의 유령 프리미엄석 2매. 한국여자오픈 특별 라운딩은 100명 추첨으로, 모두에게 제공되는 혜택이 아닙니다.');
    if(/^AMG G 63/.test(name))items.push('<b>11월 G 63 한정 선물 캠페인</b> — G클래스 수트케이스 90명 한정. 선정 방식과 잔여 수량은 상담에서 확인합니다. 골든타임과는 별도입니다.');
    if(!items.length)return '';
    return '<section class="nov-benefit"><p class="nov-kicker">11월에 확인할 추가 혜택</p><ul>'+items.map(function(t){return '<li>'+t+'</li>';}).join('')+'</ul><a class="nov-link" href="november.html">대상·기간·제외 조건 자세히 보기 →</a></section>';
  }
  function mount(){
    document.querySelectorAll('[data-nov-sclass]').forEach(function(el){el.innerHTML=sClass(false);});
    var table=document.getElementById('nov-retail-list');
    if(table&&window.NOVEMBER_RETAIL){
      var source=window.NOVEMBER_RETAIL;
      function render(query){var q=String(query||'').toLowerCase().replace(/\s/g,'');var rows=source.filter(function(r){var model=r.name.toLowerCase().replace(/^m-amg\s*/, '').replace(/^mm\s*/, '').replace(/\s/g,'');var term=q.replace(/^amg/,'');return !q || model.indexOf(term)===0 || r.my.toLowerCase().indexOf(q)>=0;});table.innerHTML='<p>'+rows.length+'개 모델·연식 조건</p><div class="nov-retail-scroll" tabindex="0" aria-label="차종별 조건 표, 위아래 스크롤"><table><thead><tr><th>차종·연식</th><th>기본 할인</th><th>금융 추가</th><th>재구매</th></tr></thead><tbody>'+rows.map(function(r){var name=r.name.replace('M-AMG','AMG').replace(/^MM /,'마이바흐 ').replace(/4M\b/g,'4MATIC');return '<tr><td>'+esc(name)+'<small>'+r.my.replace('MY','20')+'년식</small></td><td>'+(r.cashWon?'100만원':r.cash==null?'확인':'<b>'+r.cash+'%</b>')+'</td><td>할부 '+r.mbm+'%<br>운용리스 '+r.leaseAdd+'%</td><td>'+r.retain+'%</td></tr>';}).join('')+'</tbody></table></div>';}
      render('');var input=document.getElementById('nov-retail-search');if(input)input.addEventListener('input',function(){render(input.value);});
    }
  }
  window.BenzNovemberBenefits={html:html,sClass:sClass,mount:mount};
  if(typeof document!=='undefined')document.addEventListener('DOMContentLoaded',mount);
})();
