/* Shared vehicle classification and accessible filter controls. */
(function(){
 function name(r){return r.name||r[2]||'';}
 function family(r){return (name(r).replace(/^(AMG|Maybach) /,'').match(/^(EQA|EQB|EQE|EQS|CLA|CLE|GLA|GLB|GLC|GLE|GLS|GT|SL|[ACEGSV])\b/)||['',''])[1]||'기타';}
 function model(r){var n=name(r).replace(/^(AMG|Maybach) /,'');var m=n.match(/^([A-Z]+)\s*(\d{2,3})(?:\s*(d|e|\+)(?=\s|$))?/);return m?m[1]+' '+m[2]+(m[3]||''):family(r);}
 function kind(r){return /^Maybach /.test(name(r))?'maybach':/^AMG /.test(name(r))?'amg':'base';}
 function body(r){var n=name(r);return /electric/.test(n)||/^EQ|^G 580/.test(n)?'electric':/Cabriolet|^AMG SL|^Maybach SL/.test(n)?'open':/Coup/.test(n)?'coupe':'standard';}
 function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
 function chips(key,items,value,label){return '<div class="vehicle-filter-row" role="group" aria-label="'+label+'"><b>'+label+'</b><div>'+items.map(function(x){return '<button type="button" data-vfilter="'+key+'" data-value="'+esc(x[0])+'" aria-pressed="'+(x[0]===value)+'">'+esc(x[1])+'</button>';}).join('')+'</div></div>';}
 function filters(rows,state,includeFamily){var s=state||{},html='';if(includeFamily){var fam=Array.from(new Set(rows.map(family)));html+=chips('family',fam.map(function(f){return[f,/^[ACESVG]$/.test(f)?f+'클래스':f];}),s.family,'차종');}
 var models=Array.from(new Set(rows.map(model)));if(models.length>1)html+=chips('model',[['','전체 모델']].concat(models.map(function(m){return[m,m];})),s.model||'','모델');
 var years=Array.from(new Set(rows.map(function(r){return r.my||r[1];}))).sort();html+=chips('year',[['','전체 연식']].concat(years.map(function(y){return[y,y.replace('MY','20')+'년식'];})),s.year||'','연식');
 var kinds=Array.from(new Set(rows.map(kind)));if(kinds.length>1)html+=chips('kind',[['','전체 라인']].concat(kinds.map(function(k){return[k,{base:'일반 모델',amg:'AMG',maybach:'마이바흐'}[k]];})),s.kind||'','라인');
 var bodies=Array.from(new Set(rows.map(body)));if(bodies.length>1)html+=chips('body',[['','전체 형태']].concat(bodies.map(function(b){return[b,{standard:'세단·일반 SUV',coupe:'쿠페',open:'오픈카',electric:'전기차'}[b]];})),s.body||'','형태');return html;}
 function matches(r,s){return (!s.family||family(r)===s.family)&&(!s.model||model(r)===s.model)&&(!s.year||(r.my||r[1])===s.year)&&(!s.kind||kind(r)===s.kind)&&(!s.body||body(r)===s.body);}
 window.BenzCatalogue={family:family,model:model,kind:kind,body:body,filters:filters,matches:matches,chips:chips};
})();
