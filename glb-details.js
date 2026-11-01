/* MY27 GLB electric product information v2 (2026-10-26), pp.2–9.
 * Domestic seating follows the confirmed Korean five-seat launch specification.
 */
(function(){
  var groups=[
    ['화면·휴대폰·길 안내',[
      ['MBUX 슈퍼스크린','기본','운전석·가운데·조수석에 화면이 나뉩니다. 운전자는 계기판을 보고, 동승자는 자기 앞 화면을 쓸 수 있어요.'],
      ['헤드업 디스플레이','기본','속도와 길 안내를 앞유리 쪽에 띄워 줍니다. 계기판을 보려고 시선을 크게 내릴 일이 줄어요.'],
      ['4세대 MBUX · MB.OS · 내비게이션','기본','차 안의 길 안내와 여러 기능을 맡는 두뇌예요. 지원되는 기능은 소프트웨어 업데이트로 바뀔 수 있어요.'],
      ['스마트폰 연동 · 앞좌석 무선 충전','기본','지원되는 휴대폰 기능을 차량 화면과 연결합니다. 무선 충전이 되는 휴대폰은 충전 자리에 올려 충전해요.'],
      ['셀피·비디오 카메라 · 얼굴 인식','기본','지원 앱에서 차 안 카메라를 쓰고, 등록한 사용자를 알아보는 기능입니다. 사진 촬영과 개인별 차량 이용 환경을 돕습니다.'],
      ['톨 정산 시스템','기본','고속도로 통행료를 편하게 정산하도록 돕습니다. 이용할 카드와 서비스 등록 조건을 함께 확인해요.']
    ]],
    ['시트·온도·매일 만지는 곳',[
      ['국내 출시 좌석','5인승','앞에 두 자리, 뒤에 세 자리입니다. 국내 GLB 일렉트릭은 5인승만 출시한 사양으로 안내합니다.'],
      ['컴포트 시트 · ARTICO 내장','기본','일상에서 편하게 앉도록 만든 시트이며, 기본 소재는 ARTICO 인조가죽입니다. 천연가죽과 구분해서 보세요.'],
      ['앞좌석 열선','기본','추운 날 앞좌석을 따뜻하게 데워 줍니다. 통풍 시트는 이 기본 사양표에 기재되어 있지 않아요.'],
      ['앞좌석 메모리 패키지','기본','앉는 위치를 기억해 두었다가 불러옵니다. 두 사람이 번갈아 운전할 때 매번 다시 맞추는 수고를 덜어요.'],
      ['나파 가죽 다기능 스포츠 핸들 · 핸들 열선','기본','핸들에서 여러 기능을 조작할 수 있고, 겨울에는 손이 닿는 핸들이 따뜻해집니다.'],
      ['2존 자동 온도 조절','기본','운전석과 조수석의 온도를 따로 맞춥니다. 한 사람은 춥고 다른 사람은 더울 때 편해요.'],
      ['앰비언트 라이트 · 앤트러사이트 아노다이즈드 룩 트림','기본','실내의 은은한 조명과 어두운 금속 느낌 장식입니다. 차 안 분위기를 만드는 부분이에요.']
    ]],
    ['운전·주차를 도와주는 기능',[
      ['MB.DRIVE 어시스트','기본','앞차와의 거리와 차로 유지를 도와줍니다. 운전자가 계속 도로를 보고 직접 책임지고 운전해야 해요.'],
      ['차선 변경 어시스트','기본','조건이 맞는 도로에서 옆 차로로 옮기는 일을 돕습니다. 운전자가 주변을 살펴야 하며 아무 도로에서나 자동으로 움직이는 기능은 아니에요.'],
      ['차선 이탈 방지 · 스티어링 어시스트','기본','차선을 벗어나려는 상황을 살피고 핸들 조작을 돕습니다. 차선이 흐리거나 날씨가 나쁘면 도움을 제한받을 수 있어요.'],
      ['브레이크 어시스트 · 사각지대 어시스트','기본','위험 상황에서 제동을 돕고, 옆이나 뒤에서 잘 안 보이는 차를 알아채도록 돕습니다.'],
      ['MB.DRIVE 주차 어시스트 360°','기본','차 주변을 위에서 내려다보는 듯한 화면으로 보여 줍니다. 좁은 주차장에서 차 옆과 모서리를 살피기 편해요.'],
      ['PARKTRONIC','기본','장애물이 가까워지면 알려 주는 주차 감지 기능입니다. 낮은 물체나 가느다란 장애물까지 모두 알아채는 것은 아니에요.']
    ]],
    ['외관·짐 공간·승차감',[
      ['PROGRESSIVE 외장 · 컴포트 서스펜션','기본','외관은 프로그레시브 디자인이고, 하체는 일상 승차감을 고려한 컴포트 방식입니다. 방지턱을 넘는 느낌은 시승으로 살펴보세요.'],
      ['18인치 5스포크 경량 알로이 휠 (83R)','기본','출고 기본 바퀴입니다. 휠이 커질수록 무조건 좋은 것은 아니며 타이어와 함께 승차감·교체 비용을 살펴보세요.'],
      ['타이어핏','기본','예비 바퀴 대신 사용하는 임시 펑크 대응 키트입니다. 옆면이 찢어지는 등 수리할 수 없는 손상도 있어요.'],
      ['파노라믹 루프','기본','넓은 유리 지붕으로 하늘이 보여 실내가 한결 트여 보입니다.'],
      ['LED 고성능 헤드램프 · 어댑티브 상향등 어시스트','기본','앞길을 LED로 밝히고 상황에 따라 상향등 사용을 돕습니다. 밤길에서 멀리 보는 일을 도와주는 장비예요.'],
      ['일루미네이티드 패널 · 도어 실','기본','앞쪽 장식 패널과 문을 열었을 때 보이는 발판 부분에 빛을 더하는 외관 사양입니다.'],
      ['키레스 고 패키지 · 플러시 도어 핸들','기본','차 키를 지닌 채 편하게 문을 여닫도록 돕습니다. 손잡이는 차체 선에 맞춰 매끈하게 배치됩니다.'],
      ['전면 트렁크 · 전동 트렁크','기본','보닛 아래 127L 짐칸을 따로 쓰고, 뒤쪽 문은 전동으로 여닫습니다. 뒤 짐칸은 기본 540L, 뒷좌석을 접으면 최대 1,715L예요.'],
      ['85kWh NMC 배터리 (CATL)','기본','전기를 담는 큰 저장통입니다. 85kWh는 사용 가능 용량으로, 한 번 충전에 갈 거리는 기온·속도·냉난방에 따라 달라져요.']
    ]]
  ];
  var rows=[
    ['국내 출시 좌석','5인승만 출시','Premium RWD·Long Range AWD 모두 5인승','같은 다섯 자리끼리 비교합니다. Model Y L 6인승은 별도 모델이에요.'],
    ['기본 차량 가격','6,990만원','RWD 4,999만원 / Long Range AWD 6,699만원','GLB는 RWD보다 1,991만원, Long Range AWD보다 291만원 높습니다. 할인·보조금·유료 옵션 전 가격입니다.'],
    ['차 길이·너비·높이','4,732 × 1,861 × 1,687mm','4,790 × 1,920 × 1,624mm','미러를 뺀 너비입니다. GLB가 길이 58mm·너비 59mm 작고 지붕은 63mm 높아요. GLB 치수는 해외 제조사 참고값입니다.'],
    ['운전자와 동승자 화면','운전석 10.25인치 + 중앙 14인치 + 조수석 14인치 · 헤드업 디스플레이 기본','현행 국내 Premium: 중앙 16인치 + 뒷좌석 8인치','GLB는 앞좌석의 화면을 나누고 앞유리로 정보를 봅니다. Model Y는 중앙 화면과 뒷좌석 화면 구성이에요. 초기 주니퍼와 현행 화면 사양은 다를 수 있어요.'],
    ['앞좌석 열선·통풍','열선 기본 · 통풍은 기본 사양표 미기재','열선·통풍 기능 제공','겨울에는 둘 다 시트를 따뜻하게 쓸 수 있습니다. 여름철 시트 바람이 중요하면 통풍 유무를 보세요.'],
    ['주행 보조와 주차','MB.DRIVE·차선 변경·360° 주차 어시스트 기본','기본 오토파일럿 포함 · 자동 차선 변경·자동 주차 등은 향상된 오토파일럿 유료 패키지에 안내','기본 포함 범위가 다릅니다. Tesla 향상된 오토파일럿은 주문 화면 기준 452만2천원이며, 두 차 모두 운전자의 감독이 필요해요.'],
    ['급속 충전 최대 출력','최대 320kW · 800V','RWD 최대 175kW / Long Range AWD 최대 250kW','충전기가 충분한 전력을 주고 배터리 온도·잔량이 맞아야 합니다. 최대 숫자만으로 실제 충전 시간을 단정할 수는 없어요.'],
    ['1회 충전 주행거리','WLTP 최대 631km · 국내 인증 거리는 인도 시 공개 예정','국내 MCT 기준 RWD 400km / Long Range AWD 505km','시험 기준이 달라 631km와 400·505km로 승패를 정하면 안 됩니다. 서로 다른 기준을 적은 참고 비교입니다.'],
    ['뒤 짐칸 / 앞 짐칸','540L / 127L · 뒤 좌석 접으면 최대 1,715L','822L / 116L · 뒤 좌석 접으면 뒤쪽 2,022L','각 제조사 공개 수치입니다. 적재 공간을 재는 방식과 포함 범위가 같다고 확인되지 않아 수치만으로 우열을 정하지 않습니다.'],
    ['휴대폰을 차 키로 쓰기','스마트폰 디지털 키(896)는 출시 시 작동하지 않고 추후 업데이트 예정','폰 키와 앱을 이용한 차량 접근 지원','GLB는 출시 시 휴대폰만 들고 차 키를 대신할 수 있다고 생각하면 안 돼요. 일반 키의 키레스 고와 휴대폰 디지털 키는 다른 기능입니다.']
  ];
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function render(){return '<section class="glb-detail-zone" aria-label="GLB 세부 사양과 모델 Y 비교"><div class="glb-seat-note"><strong>국내 GLB 일렉트릭은 5인승입니다.</strong><p>앞 두 자리 + 뒤 세 자리. 해외 7인승 안내를 국내 판매 구성과 혼동하지 않도록 국내 출시 사양만 따로 정리했습니다.</p></div><h3>기본 사양, 쉬운 말로 하나씩</h3><p class="glb-detail-intro">MY27 GLB 250+ electric 제품 정보 v2의 기본 사양입니다. 제목을 누르면 생활 속에서 어떤 도움이 되는지 읽을 수 있어요.</p>'+groups.map(function(g,i){return '<details class="glb-option-group"'+(i===0?' open':'')+'><summary>'+esc(g[0])+'<span>'+g[1].length+'개</span></summary><dl>'+g[1].map(function(x){return '<div class="glb-option-item"><dt>'+esc(x[0])+' <em>'+esc(x[1])+'</em></dt><dd>'+esc(x[2])+'</dd></div>';}).join('')+'</dl></details>';}).join('')+'<div class="glb-config-note"><h4>기본 사양과 따로 확인할 구성</h4><p><b>19인치 휠(28R)</b>과 <b>브라운/블랙 가죽(224A)</b>은 자료에 별도 구성으로 소개됩니다. 기본 18인치·ARTICO와 구분하고, 선택 가능 재고와 추가 금액을 확인하세요.</p><p>ARTICO는 블랙/블랙(101A), 마키아토 베이지/블랙(105A) 구성이 소개됩니다. 시트 색만 보고 핸들 색까지 같다고 생각하지 말고, 배정될 차량의 실내 사진과 실제 구성도 함께 확인하세요.</p><p><b>스마트폰 디지털 키(896)</b>의 문 잠금·해제와 시동은 출시 시 제공되지 않으며 추후 업데이트 예정입니다.</p><small>사양 근거: MY27 X244 GLB electric 제품 정보 v2 · 2026.10.26 · 2~9쪽. 생산 시점과 실제 차량 구성에 따라 달라질 수 있습니다.</small></div><section class="glb-modely-compare"><p class="glb-eyebrow">같은 다섯 자리 전기 SUV를 고민한다면</p><h3>모델 Y 주니퍼와 직접 비교</h3><p class="glb-detail-intro">2026년 11월 2일 확인한 국내 Model Y Premium RWD·Long Range AWD 기준입니다. GLB는 국내 5인승 출시 사양, Model Y L은 제외했습니다.</p><div class="glb-table-scroll" role="region" aria-label="GLB와 모델 Y 사양 비교표" tabindex="0"><table><thead><tr><th scope="col">비교할 부분</th><th scope="col">GLB 일렉트릭</th><th scope="col">모델 Y 주니퍼</th><th scope="col">쉽게 보면</th></tr></thead><tbody>'+rows.map(function(r){return '<tr><th scope="row">'+esc(r[0])+'</th>'+r.slice(1).map(function(v,i){return '<td data-label="'+esc(['GLB 일렉트릭','모델 Y 주니퍼','쉽게 보면'][i])+'">'+esc(v)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div><div class="glb-choice-grid"><article><h4>GLB를 먼저 살펴볼 분</h4><p>앞유리에 보이는 속도 안내, 조수석 전용 화면, 기본 360° 주차 보조가 일상에서 도움이 되는지 보세요. 열선과 좌석 기억 기능도 함께 살펴보면 좋아요.</p></article><article><h4>모델 Y도 꼭 함께 볼 분</h4><p>구매 예산, 통풍 시트, 뒷좌석 화면을 중요하게 보신다면 직접 비교해 보세요. GLB와 앉는 높이·화면 조작 방식이 달라 시승으로 확인하면 좋습니다.</p></article></div><p class="glb-sources">가격과 Tesla 사양은 확인일 기준이며 변경될 수 있습니다. 출처: <a href="https://www.tesla.com/ko_kr/modely/design" target="_blank" rel="noopener noreferrer">Tesla 국내 주문 화면</a> · <a href="https://www.tesla.com/ko_kr/modely" target="_blank" rel="noopener noreferrer">Model Y 국내 제원</a> · <a href="https://www.tesla.com/ownersmanual/modely/ko_kr/GUID-1E76B638-7B12-4D9A-8767-94B7F1E92A0E.html" target="_blank" rel="noopener noreferrer">Tesla 치수·적재 매뉴얼</a> · <a href="https://www.tesla.com/ownersmanual/modely/ko_kr/GUID-4F3599A1-20D9-4A49-B4A0-5261F957C096.html" target="_blank" rel="noopener noreferrer">Tesla 시트 온도 조절</a> · <a href="https://www.mercedes-benz.co.uk/passengercars/models/suv/glb-electric/overview.html" target="_blank" rel="noopener noreferrer">GLB 해외 치수 참고</a>. GLB 국내 가격·충전·적재 수치는 벤츠코리아 공식 발표와 제품 정보를 참고했습니다.</p></section></section>';}
  function start(){document.querySelectorAll('[data-glb-details]').forEach(function(el){el.innerHTML=render();});}
  window.BenzGLBDetails={render:render,optionCount:groups.reduce(function(n,g){return n+g[1].length;},0),comparisonRows:rows};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
