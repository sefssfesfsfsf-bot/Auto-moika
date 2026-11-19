var BODY=[["Седан",1],["Кросовер",1.25],["Мінівен",1.5]];
var PACK=[["Експрес",250],["Комплекс",450],["Преміум",750]];
var EXTRA=[["Віск",200],["Мийка двигуна",300],["Озонація",250],["Чистка килимків",200]];
var HOURS=[8,21],CAP=2,KEY="cw_bookings";
var st={b:0,p:1,ex:{},date:"",time:""};
function $(i){return document.getElementById(i)}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}}
function save(a){try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
var mem=load();
function chips(id,arr,key){var c=$(id);c.innerHTML="";arr.forEach(function(x,i){var b=document.createElement("button");b.type="button";b.className="chip"+(st[key]===i?" sel":"");b.textContent=x[0]+(key=="p"?" · "+x[1]+" ₴":"");b.onclick=function(){st[key]=i;draw()};c.appendChild(b)})}
function price(){var p=PACK[st.p][1]*BODY[st.b][1];EXTRA.forEach(function(e,i){if(st.ex[i])p+=e[1]});return Math.round(p/10)*10}
function drawExtras(){var c=$("extras");c.innerHTML="";EXTRA.forEach(function(e,i){var l=document.createElement("label");var k=document.createElement("input");k.type="checkbox";k.checked=!!st.ex[i];k.onchange=function(){st.ex[i]=k.checked;draw()};l.appendChild(k);l.appendChild(document.createTextNode(e[0]+" +"+e[1]+" ₴"));c.appendChild(l)})}
function slots(){var c=$("slots");c.innerHTML="";if(!st.date){c.innerHTML='<span style="color:var(--mut);font-size:14px">Спершу оберіть дату</span>';return}
 var now=new Date(),today=now.toISOString().slice(0,10)===st.date;
 for(var h=HOURS[0];h<HOURS[1];h++){var t=(h<10?"0":"")+h+":00";var n=mem.filter(function(m){return m.date===st.date&&m.time===t}).length;
  var b=document.createElement("button");b.type="button";b.textContent=t;b.className="chip"+(st.time===t?" sel":"");
  if(n>=CAP||(today&&h<=now.getHours()))b.disabled=true;(function(t){b.onclick=function(){st.time=t;slots()}})(t);c.appendChild(b)}}
function draw(){chips("body",BODY,"b");chips("pack",PACK,"p");drawExtras();
 var ex=EXTRA.filter(function(e,i){return st.ex[i]}).map(function(e){return e[0]});
 $("sum").innerHTML=BODY[st.b][0]+" · "+PACK[st.p][0]+(ex.length?"<br>+ "+ex.join(", "):"")+(st.date&&st.time?"<br>"+st.date+" о "+st.time:"");
 tween(price());slots();mine()}
function mine(){var c=$("mine");if(!mem.length){c.innerHTML="<p>Поки немає записів.</p>";return}
 c.innerHTML="";mem.forEach(function(m,i){var d=document.createElement("div");d.className="bk";d.innerHTML="<span>"+m.date+" "+m.time+"<br><small>"+m.pack+" · "+m.total+" ₴</small></span>";var x=document.createElement("button");x.textContent="Скасувати";x.onclick=function(){mem.splice(i,1);save(mem);draw()};d.appendChild(x);c.appendChild(d)})}
var di=$("date"),d0=new Date();d0.setMinutes(d0.getMinutes()-d0.getTimezoneOffset());
di.min=d0.toISOString().slice(0,10);di.onchange=function(){st.date=di.value;st.time="";draw()};
$("f").onsubmit=function(e){e.preventDefault();var n=$("name").value.trim(),p=$("phone").value.replace(/\D/g,""),er=$("err");
 if(!st.date||!st.time)return er.textContent="Оберіть дату та час.";
 if(n.length<2)return er.textContent="Вкажіть ім’я.";
 if(p.length<10||p.length>12)return er.textContent="Вкажіть коректний номер телефону.";
 er.textContent="";var rec={date:st.date,time:st.time,name:n,phone:$("phone").value,car:$("car").value,pack:BODY[st.b][0]+", "+PACK[st.p][0],total:price()};
 mem.push(rec);save(mem);
 $("done").innerHTML='<div class="ok">✅ Дякуємо, '+n.replace(/[<>&]/g,"")+'! Запис на <b>'+rec.date+' о '+rec.time+'</b> збережено. Сума: <b>'+rec.total+' ₴</b>.</div>';
 st.time="";draw();$("f").reset();st.date="";di.value="";slots()};
$("theme").onclick=function(){var r=document.documentElement,d=r.dataset.theme?r.dataset.theme=="dark":matchMedia("(prefers-color-scheme:dark)").matches;r.dataset.theme=d?"light":"dark"};
$("bg").onclick=function(){$("menu").classList.toggle("open")};
$("menu").onclick=function(){$("menu").classList.remove("open")};
(function(){var h=new Date().getHours(),o=h>=HOURS[0]&&h<HOURS[1];$("dot").className="dot"+(o?" on":"");$("open").textContent=o?"Відчинено до 21:00":"Зараз зачинено · працюємо з 08:00"})();
var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches,tv=0,tr=0;
function tween(to){var from=tv;tv=to;cancelAnimationFrame(tr);if(reduce){$("tot").textContent=to+" ₴";return}var t0=performance.now();(function f(n){var k=Math.min(1,(n-t0)/450),e=1-Math.pow(1-k,3);$("tot").textContent=Math.round(from+(to-from)*e)+" ₴";if(k<1)tr=requestAnimationFrame(f)})(t0)}
function count(el){var m=el.textContent.match(/^(\D*)(\d+)(.*)$/);if(!m||reduce)return;var to=+m[2],t0=performance.now();(function f(n){var k=Math.min(1,(n-t0)/900),e=1-Math.pow(1-k,3);el.textContent=m[1]+Math.round(to*e)+m[3];if(k<1)requestAnimationFrame(f)})(t0)}
var bb=$("bubbles");for(var i=0;i<16;i++){var s=document.createElement("span"),z=8+Math.random()*26;s.style.cssText="left:"+Math.random()*100+"%;width:"+z+"px;height:"+z+"px;animation-duration:"+(7+Math.random()*9)+"s;animation-delay:"+(-Math.random()*12)+"s;--x:"+(Math.random()*60-30)+"px";bb.appendChild(s)}
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target;el.classList.add("in");io.unobserve(el);setTimeout(function(){el.style.transitionDelay=""},1200);var p=el.classList.contains("box")&&el.querySelector(".price");if(p)count(p)})},{threshold:.12});
document.querySelectorAll("section.s h2,.sub,.box,details").forEach(function(el){el.classList.add("rv");el.style.transitionDelay=Math.min(Array.prototype.indexOf.call(el.parentNode.children,el),6)*.09+"s";io.observe(el)});
var nv=document.querySelector("nav");addEventListener("scroll",function(){var h=document.documentElement;nv.style.setProperty("--p",(h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight)*100)+"%");nv.classList.toggle("sc",h.scrollTop>10)},{passive:true});
draw();
