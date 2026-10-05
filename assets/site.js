(function(){
var menu=document.querySelector('.menu'),nav=document.getElementById('nav');
if(menu&&nav){menu.addEventListener('click',function(){var open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open?'true':'false');});}
var on=document.querySelector('.nav .on');if(on&&nav&&window.innerWidth>860){nav.scrollTop=on.offsetTop-nav.clientHeight/2;}
var data=document.getElementById('index');if(!data){return;}
var idx=JSON.parse(data.textContent),input=document.getElementById('q'),list=document.getElementById('results'),status=document.getElementById('status');
function fold(s){return s.normalize('NFKD').replace(/[̀-ͯ]/g,'').toLowerCase();}
idx.pages.forEach(function(p){p.ft=fold(p.t);p.fk=fold(p.t+' '+p.d+' '+p.k);});
idx.terms.forEach(function(t){t.ft=fold(t.t);});
function score(ft,q){if(ft===q)return 100;if(ft.indexOf(q)===0)return 60;if(ft.indexOf(' '+q)>=0)return 40;if(ft.indexOf(q)>=0)return 20;return 0;}
function run(){
 var q=fold(input.value.trim());list.innerHTML='';
 if(!q){status.textContent='Type a word or a phrase.';return;}
 var hits=[];
 idx.pages.forEach(function(p){var s=score(p.ft,q)*2;if(!s&&p.fk.indexOf(q)>=0)s=15;if(s)hits.push({s:s+5,t:p.t,u:p.u,d:p.d,kind:'Page'});});
 idx.terms.forEach(function(t){var s=score(t.ft,q);if(s)hits.push({s:s,t:t.t,u:t.u,d:'',kind:'Glossary'});});
 hits.sort(function(a,b){return b.s-a.s||a.t.length-b.t.length;});
 var shown=hits.slice(0,80);
 status.textContent=hits.length?(hits.length+' result'+(hits.length===1?'':'s')+(hits.length>80?', showing the best 80':'')):'Nothing found. Try a shorter word.';
 shown.forEach(function(h){var li=document.createElement('li'),a=document.createElement('a');a.href=h.u;a.textContent=h.t;li.appendChild(a);var sm=document.createElement('small');sm.textContent=h.kind+(h.d?' · '+h.d:'');li.appendChild(sm);list.appendChild(li);});
}
var params=new URLSearchParams(location.search);if(params.get('q')){input.value=params.get('q');}
input.addEventListener('input',function(){var u=new URL(location.href);u.searchParams.set('q',input.value);history.replaceState(null,'',u);run();});
run();
})();
