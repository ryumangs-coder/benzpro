/* Confirmed November MBFSK notice pp.2–4: annual rate reference, 30% down / 60 months. */
(function(){
var rows=[
['2026 C 200 아방가르드·AMG Line',5.33,4.93,5.73,5.33,'24'],
['2026 E 200 Exclusive',5.87,5.47,5.64,5.24,'24'],
['2026 E 200 AMG Line',5.88,5.48,5.66,5.26,'24'],
['2026 E 300',5.33,4.93,5.72,5.32,'24'],
['2027 E 200 Exclusive',5.80,5.40,6.10,5.70,'24'],
['2027 E 200 AMG Line',5.82,5.42,6.11,5.71,'24'],
['2027 E 300',6.60,6.20,6.41,6.01,'—'],
['2026 AMG E 53 · AMG S 63',4.26,3.86,5.02,4.62,'24·36'],
['2026 S 450 숏바디',5.40,5.00,5.75,5.35,'24'],
['2026 GLC 300 아방가르드 SUV·쿠페',5.39,4.99,5.75,5.35,'24'],
['2026 GLC 300 AMG Line SUV·쿠페',5.28,4.88,5.69,5.29,'24'],
['2027 GLC 300 SUV',6.60,6.20,6.43,6.03,'—'],
['2027 GLC 300 쿠페',5.65,5.25,5.99,5.59,'24'],
['2026 GLE 350·GLE 450 d 쿠페·AMG GLE 53·GLS 450·GLS 580',4.26,3.86,5.02,4.62,'24·36'],
['2026 GLE 450 SUV·쿠페',3.84,3.44,4.80,4.40,'24·36'],
['2026 마이바흐 GLS 600',4.35,3.95,5.07,4.67,'24·36'],
['2026 AMG GLS 63',4.47,4.07,5.13,4.73,'24·36'],
['2026·2027 AMG G 63',4.50,4.10,5.15,4.75,'24·36'],
['2026 GLB 250',5.26,4.86,5.68,5.28,'24'],
['2026 AMG GLB 35',4.08,3.68,4.87,4.47,'24·36'],
['2026 GLA 250·AMG A 45 S',6.60,6.20,6.43,6.03,'—'],
['2026 A 220·CLA 250·AMG CLA 45',7.63,7.23,7.20,6.80,'—'],
['전 연식 대상 CLE·AMG CLE·SL·GT·마이바흐 SL',7.63,7.23,7.20,6.80,'—'],
['2026·2027 EQA / 2026 EQB',7.63,7.23,7.20,6.80,'—'],
['2026 G 580·마이바흐 EQS',7.63,7.23,7.20,6.80,'—'],
['2026 AMG GLC 43 SUV·쿠페',7.43,7.03,7.16,6.76,'—'],
['2026 EQE 350·EQE 500 / 2026·2027 EQS 450·EQS 580 / 2027 EQS 400',4.19,3.79,4.88,4.48,'24·36'],
['2026 E 200 아방가르드·E 220 d·E 350 e / 2026·2027 E 450',7.43,7.03,7.16,6.76,'—'],
['2026 S 350 d·S 450 롱·S 500·S 580·마이바흐 S',7.43,7.03,7.16,6.76,'—'],
['2027 S 350 d·S 450·S 500·S 580·마이바흐 S',7.43,7.03,7.16,6.76,'—'],
['2026 GLC 220 d·GLE 300 d·GLS 450 d·G 450 d',7.43,7.03,7.16,6.76,'—']
];
window.BenzNovemberFinance=rows;
document.addEventListener('DOMContentLoaded',function(){var el=document.getElementById('nov-finance');if(!el)return;el.innerHTML='<p>각 금리: 일반 고객 / 재구매 고객 · 모두 연 금리(%)</p><div class="nov-retail-scroll" tabindex="0" aria-label="차종별 금융 금리 표, 위아래 스크롤"><table><thead><tr><th>차종·연식</th><th>일반 할부<br>연 %</th><th>안심 할부<br>연 %</th><th>무이자<br>개월</th></tr></thead><tbody>'+rows.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1].toFixed(2)+' / '+r[2].toFixed(2)+'</td><td>'+r[3].toFixed(2)+' / '+r[4].toFixed(2)+'</td><td>'+r[5]+'</td></tr>';}).join('')+'</tbody></table></div><p class="nov-small">무이자는 각 기간별 별도 선수금 조건을 충족해야 합니다. 표의 30% 선수금·60개월 유이자 예시와 조건이 다릅니다. 세부 트림·연식·심사·약정에 따라 적용 여부를 확인하세요.</p>';});
})();
/* Confirmed MBFSK November finance notice, pp.2–4. Conditions for down payment differ by model. */
(function(){
 function of(row){var n=row.name||row[2]||'',y=row.my||row[1],z=false,z36=false;
 if(y==='MY26'){
  z=/^C 200 (Avantgarde|AMG Line)$|^E 200 (Exclusive|AMG Line)|^E 300 |^AMG E 53 |^AMG S 63 |^GLB 250 4MATIC$|^AMG GLB 35 |^GLC 300 |^GLE 350 |^GLE 450 |^GLE 450 d .*Coup|^AMG GLE 53 |^GLS (450 4MATIC AMG Line|580 4MATIC)|^AMG GLS 63 |^Maybach GLS 600|^AMG G 63|^EQE (350\+|500)|^EQS (450|580)/.test(n)||n==='S 450 4MATIC (SWB)';
  z36=/^AMG (E 53|S 63|GLB 35|GLE 53|GLS 63|G 63)|^GLE (350|450)|^GLS (450 4MATIC AMG Line|580)|^Maybach GLS 600|^EQE (350\+|500)|^EQS (450|580)/.test(n);
 }
 if(y==='MY27'){z=/^E 200 (Exclusive|AMG Line)|^GLC 300 .*Coup|^AMG G 63|^EQS (400|450|580)/.test(n);z36=/^AMG G 63|^EQS (400|450|580)/.test(n);}
 if(/electric/.test(n))z=z36=false;
 return {zero24:z,zero36:z36,monthlySupport:0,source:'2026.11.01'};
 }
 function badges(row){return of(row).zero24?'<span class="finance-zero" title="차종별 선수금·심사·약정 조건 확인 필요">24개월 무이자 할부 가능</span><small class="finance-zero-note">모델별 선수금·심사 조건 확인</small>':'';}
 window.BenzFinance={of:of,badges:badges};
})();
