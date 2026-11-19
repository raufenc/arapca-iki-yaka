(function(){
"use strict";
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- üst çubuk ve ilerleme ---------- */
const top=$("#top"), prog=$("#progress");
function onScroll(){
  const y=scrollY, h=document.documentElement.scrollHeight-innerHeight;
  top.classList.toggle("solid",y>innerHeight*0.6);
  prog.style.width=(h>0?y/h*100:0)+"%";
}
addEventListener("scroll",onScroll,{passive:true}); onScroll();

/* ---------- görünme + bir kez çalışan animasyonlar ---------- */
const onceMap=new Map();
function whenSeen(el,fn){ if(!el) return; onceMap.set(el,fn); io.observe(el); }
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting) return;
  e.target.classList.add("in");
  const fn=onceMap.get(e.target); if(fn){fn();onceMap.delete(e.target);}
  io.unobserve(e.target);
}),{threshold:.15,rootMargin:"0px 0px -5% 0px"});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));

/* ---------- 1 · ifade ağacı ---------- */
const REG=["Mısır","Şam","Körfez","Mağrib"];
const P=[
 {tr:"Bu kaça?",f:"بِكَمْ هَذا؟",v:[["بكام ده؟","بِكَمْ + ذا",""],["قدّيش هاد؟","قَدْر + أيّ شيء","ne miktar"],["بكم هذا؟",null,"fasihle aynı"],["بشحال هادا؟","بِـ + شْحال","ne kadar ile"]]},
 {tr:"İstiyorum",f:"أُريدُ",v:[["عايِز","عازَ","ihtiyaç duydu"],["بدّي","بِوُدّي","gönlümde"],["أبغى","بَغى","diledi"],["بغيت","بَغى","diledi"]]},
 {tr:"Ne istiyorsun?",f:"ماذا تُريدُ؟",v:[["عايز إيه؟","أيّ شيء","hangi şey"],["شو بدّك؟","شيء هو",""],["وش تبي؟","أيّ شيء",""],["شنو بغيتي؟","شيء هو",""]]},
 {tr:"Şimdi",f:"الآنَ",v:[["دلوقتي","ذا الوقت","bu vakit"],["هلّق","هالوقت","bu vakit"],["الحين","الحين","fasihte de var"],["دابا",null,"kökeni tartışmalı"]]},
 {tr:"Nerede?",f:"أَيْنَ؟",v:[["فين؟","في أين",""],["وين؟","و + أين",""],["وين؟","و + أين",""],["فين؟","في أين",""]]},
 {tr:"Çok",f:"كَثيرًا",v:[["أوي","قَوِيّ","güçlü"],["كتير","كَثير","ث → ت"],["وايد","واجِد","bol"],["بزاف","بِالجُزاف","ölçüsüzce"]]},
 {tr:"İyi, güzel",f:"جَيِّد",v:[["كويّس","كَيِّس","hoş, akıllı"],["منيح","مَليح","güzel"],["زين","زَيْن","güzellik"],["مزيان","زَيْن","güzellik"]]},
 {tr:"Nasılsın?",f:"كَيْفَ حالُكَ؟",v:[["إزّيك؟","إيش زيّك","halin ne gibi"],["كيفك؟","كَيْفَ + ـكَ",""],["شلونك؟","أيّ لون","rengin nasıl"],["كي داير؟","كَيْفَ دائِر","nasıl dönüyor"]]},
 {tr:"Var",f:"يوجَدُ",v:[["فيه","فيه","içinde"],["في","فيه","içinde"],["فيه","فيه","içinde"],["كاين","كائِن","olan"]]},
 {tr:"Hiçbir şey",f:"لا شَيْءَ",v:[["ولا حاجة","حاجة","ihtiyaç → şey"],["ولا شي","شَيْء",""],["ولا شي","شَيْء",""],["والو",null,"kökeni tartışmalı"]]},
];
let pi=0;
const chips=$("#chips");
P.forEach((p,i)=>{const b=document.createElement("button");b.type="button";b.className="chip";b.textContent=p.tr;b.setAttribute("aria-pressed",i===0);b.onclick=()=>{pi=i;drawTree(true)};chips.appendChild(b)});
function drawTree(anim){
  [...chips.children].forEach((b,i)=>b.setAttribute("aria-pressed",i===pi));
  const p=P[pi], svg=$("#tree"), nar=svg.getBoundingClientRect().width<560;
  const X=nar?[95,265,95,265]:[80,240,400,560], Y=nar?[96,96,286,286]:[120,96,96,120], RX=nar?180:320, RY=nar?560:410;
  svg.setAttribute("viewBox",nar?"0 0 360 640":"0 0 640 480");
  const ammi=css("--ammi"), fas=css("--fasih"), muted=css("--muted"), ink=css("--ink"), line=css("--line");
  let h=`<defs><radialGradient id="rootg" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="${css("--fasih-soft")}"/><stop offset="1" stop-color="${css("--fasih-soft")}" stop-opacity="0"/></radialGradient></defs>`;
  h+=`<ellipse cx="${RX}" cy="${RY}" rx="${nar?170:230}" ry="70" fill="url(#rootg)"/>`;
  X.forEach((x,i)=>{
    const d=nar?`M${RX} ${RY-38} C ${RX} ${RY-120}, ${x} ${Y[i]+170}, ${x} ${Y[i]+58}`:`M320 372 C 320 300, ${x} ${Y[i]+150}, ${x} ${Y[i]+58}`;
    h+=`<path class="br" d="${d}" fill="none" stroke="${ammi}" stroke-width="3" stroke-linecap="round" opacity=".75"/>`;
  });
  h+=`<text x="${RX}" y="${RY+58}" text-anchor="middle" font-size="13" font-weight="700" letter-spacing="2" fill="${fas}">FASİH · KİTAPTA</text>`;
  h+=`<text class="arw" x="${RX}" y="${RY+18}" text-anchor="middle" direction="rtl" font-size="48" fill="${fas}">${esc(p.f)}</text>`;
  X.forEach((x,i)=>{
    const v=p.v[i];
    h+=`<g class="leaf"><circle cx="${x}" cy="${Y[i]+58}" r="6" fill="${ammi}"/>`;
    h+=`<text x="${x}" y="${Y[i]-62}" text-anchor="middle" font-size="12.5" font-weight="700" letter-spacing="1.5" fill="${muted}">${REG[i].toLocaleUpperCase("tr")}</text>`;
    h+=`<text class="arw" x="${x}" y="${Y[i]-18}" text-anchor="middle" direction="rtl" font-size="32" fill="${ammi}">${esc(v[0])}</text>`;
    if(v[1]) h+=`<text class="arw" x="${x}" y="${Y[i]+18}" text-anchor="middle" direction="rtl" font-size="18" fill="${ink}" opacity=".8">${esc(v[1])}</text>`;
    if(v[2]) h+=`<text x="${x}" y="${Y[i]+(v[1]?40:18)}" text-anchor="middle" font-size="12.5" fill="${muted}">${esc(v[2])}</text>`;
    h+=`</g>`;
  });
  svg.innerHTML=h;
  if(anim && !reduce){
    svg.querySelectorAll(".br").forEach(pth=>{const L=pth.getTotalLength();pth.style.strokeDasharray=L;pth.style.strokeDashoffset=L;pth.getBoundingClientRect();pth.style.transition="stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)";pth.style.strokeDashoffset=0});
    svg.querySelectorAll(".leaf").forEach((g,i)=>{g.style.opacity=0;g.style.transition=`opacity .5s ${.35+i*.08}s`;requestAnimationFrame(()=>requestAnimationFrame(()=>g.style.opacity=1))});
  }
}
drawTree(false);
let rzT;addEventListener("resize",()=>{clearTimeout(rzT);rzT=setTimeout(()=>drawTree(false),150)});
whenSeen($("#tree"),()=>drawTree(true));

/* ---------- 2 · harita ---------- */
const G={
 mag:{n:"Mağrib",c:"#3E8E7E",ids:["504","012","788","434","478","732"],q:"شنو بغيتي؟",now:"دابا",t:"Fas, Cezayir, Tunus, Libya, Moritanya. Berberice ve Fransızca etkisi güçlü. Doğudaki Araplar Mağrib ağzını zor anlar; Mağribliler ise Mısır ve Şam ağzını medyadan tanır."},
 egy:{n:"Mısır ve Sudan",c:"#C98A2B",ids:["818","729"],q:"عايز إيه؟",now:"دلوقتي",t:"Arap dünyasında en geniş anlaşılan ağız. Sebebi onlarca yıllık Mısır sineması, dizileri ve şarkıları. El-Kitâb gibi Amerikan ders kitapları Mısır ağzını seçti."},
 lev:{n:"Şam (Levant)",c:"#B5523B",ids:["760","422","400","275"],q:"شو بدّك؟",now:"هلّق",t:"Suriye, Lübnan, Ürdün, Filistin. Türkiye'deki yaklaşık 2,2 milyon Suriyelinin ağzı; Türk izleyici dizilerden tanır. Kelime olarak fasihe yakın. Cornell'in bütünleşik programı bu ağzı seçti."},
 irq:{n:"Irak",c:"#7A5FA8",ids:["368"],q:"شتريد؟",now:"هسّه",t:"Türkiye'nin komşusu; 2025'te Türkiye'ye en çok turist gönderen Arap ülkesi. Güney Irak ağzı Körfez'e, kuzey ağızları Şam'a yaklaşır."},
 gulf:{n:"Körfez ve Yarımada",c:"#3C78B5",ids:["682","414","048","634","784","512","887"],q:"وش تبي؟",now:"الحين",t:"Suudi Arabistan, Kuveyt, Bahreyn, Katar, BAE, Umman, Yemen. Hac ve umre yolculuğunun ve iş dünyasının ağzı. Hicaz ağzı, Necid ve Yemen ağızları kendi içinde farklıdır."},
};
const TR={"504":"Fas","012":"Cezayir","788":"Tunus","434":"Libya","478":"Moritanya","732":"Batı Sahra","818":"Mısır","729":"Sudan","760":"Suriye","422":"Lübnan","400":"Ürdün","275":"Filistin","368":"Irak","682":"Suudi Arabistan","414":"Kuveyt","048":"Bahreyn","634":"Katar","784":"BAE","512":"Umman","887":"Yemen","792":"Türkiye"};
const idG={}; Object.entries(G).forEach(([k,g])=>g.ids.forEach(i=>idG[i]=k));
let selG="lev";
const glist=$("#glist");
Object.entries(G).forEach(([k,g])=>{
  const b=document.createElement("button");b.type="button";b.className="gbtn";b.dataset.g=k;
  b.innerHTML=`<i style="background:${g.c}"></i><span>${g.n}</span><span class="ar">${g.q}</span>`;
  b.onclick=()=>{selG=k;paintMap()};glist.appendChild(b);
});
function info(){
  const g=G[selG];
  $("#ginfo").innerHTML=`<div class="eyebrow" style="color:${g.c}">${g.n}</div>
  <div style="display:flex;gap:28px;flex-wrap:wrap;align-items:baseline"><div><div class="src">Ne istiyorsun?</div><div class="ar" style="font-size:34px;color:${g.c}">${g.q}</div></div><div><div class="src">Şimdi</div><div class="ar" style="font-size:34px;color:${g.c}">${g.now}</div></div><div><div class="src">Fasih</div><div class="ar f" style="font-size:34px">ماذا تريد؟</div></div></div>
  <p class="small">${g.t}</p>`;
}
let mapPaths=null;
function paintMap(){
  glist.querySelectorAll(".gbtn").forEach(b=>b.setAttribute("aria-pressed",b.dataset.g===selG));
  if(mapPaths) mapPaths.attr("opacity",d=>{const k=idG[d.id];return !k?1:(k===selG?1:.42)});
  info();
}
paintMap();
(async function(){
  if(!window.d3||!window.topojson) return;
  let topo; try{ topo=await (await fetch("data/countries-50m.json")).json(); }catch(e){ $("#mapbox").insertAdjacentHTML("beforeend",'<p class="small" style="padding:16px">Harita yüklenemedi.</p>'); return; }
  const all=topojson.feature(topo,topo.objects.countries).features;
  const focus={type:"FeatureCollection",features:all.filter(f=>idG[f.id]||f.id==="792")};
  const svg=d3.select("#map"), W=960,H=560;
  const proj=d3.geoMercator().fitExtent([[18,18],[W-18,H-18]],focus);
  const path=d3.geoPath(proj);
  const land=css("--line"), paper=css("--paper"), sea=css("--bg");
  svg.append("rect").attr("width",W).attr("height",H).attr("fill",sea);
  const defs=svg.append("defs");
  defs.append("pattern").attr("id","hatch").attr("width",8).attr("height",8).attr("patternUnits","userSpaceOnUse").attr("patternTransform","rotate(45)")
    .append("rect").attr("width",3).attr("height",8).attr("fill","#1F3D6B").attr("opacity",.55);
  svg.append("g").selectAll("path").data(all.filter(f=>!idG[f.id]&&f.id!=="792")).join("path").attr("d",path).attr("fill",land).attr("stroke",paper).attr("stroke-width",.6);
  const tr=all.find(f=>f.id==="792");
  if(tr){svg.append("path").datum(tr).attr("d",path).attr("fill","url(#hatch)").attr("stroke","#1F3D6B").attr("stroke-width",1.4);
    const c=path.centroid(tr);svg.append("text").attr("x",c[0]).attr("y",c[1]+5).attr("text-anchor","middle").attr("font-size",16).attr("font-weight",800).attr("fill","#1F3D6B").style("paint-order","stroke").attr("stroke",paper).attr("stroke-width",4).text("TÜRKİYE · öğrencimiz");}
  const tip=$("#tip"), box=$("#mapbox");
  mapPaths=svg.append("g").selectAll("path").data(all.filter(f=>idG[f.id])).join("path")
    .attr("d",path).attr("fill",d=>G[idG[d.id]].c).attr("stroke",paper).attr("stroke-width",.9).style("cursor","pointer").style("transition","opacity .3s")
    .on("mousemove",(ev,d)=>{const r=box.getBoundingClientRect();tip.textContent=`${TR[d.id]||d.properties.name} · ${G[idG[d.id]].n}`;tip.style.left=(ev.clientX-r.left+12)+"px";tip.style.top=(ev.clientY-r.top-34)+"px";tip.style.opacity=1})
    .on("mouseleave",()=>tip.style.opacity=0)
    .on("click",(ev,d)=>{selG=idG[d.id];paintMap()});
  // aile etiketleri
  Object.entries(G).forEach(([k,g])=>{
    const fs=all.filter(f=>g.ids.includes(f.id)); if(!fs.length) return;
    const big=fs.reduce((a,f)=>path.area(f)>path.area(a)?f:a,fs[0]); const cc=path.centroid(big);
    svg.append("text").attr("x",cc[0]).attr("y",cc[1]).attr("text-anchor","middle").attr("font-size",14).attr("font-weight",800).attr("fill","#fff").attr("pointer-events","none").style("paint-order","stroke").attr("stroke","rgba(0,0,0,.35)").attr("stroke-width",3).text(g.n.toLocaleUpperCase("tr"));
  });
  paintMap();
})();

/* ---------- 3 · alanlar ve süreklilik ---------- */
$("#domF").innerHTML=["Kur'an, hadis, dua","Hutbe ve vaaz","Haber bülteni","Gazete, kitap","Resmî konuşma","Çizgi film dublajı"].map(x=>`<span class="dom F">${x}</span>`).join("");
$("#domA").innerHTML=["Aile, ev","Çarşı, taksi","Dizi ve film","Şarkılar","Sosyal medya","Talk show (karma)"].map((x,i)=>`<span class="dom ${i===5?"O":"A"}">${x}</span>`).join("");
const C=[
 {n:"Turâs fasihi",ar:"فصحى التراث",c:"#9DBDF0",ex:"ماذا تُريدُ يا أَخي؟",d:"Klasik metinlerin ve din âlimlerinin dili. Bütün i'rab harekeleri söylenir.",w:"Kur'an, hadis, klasik fıkıh, hutbe"},
 {n:"Asır fasihi",ar:"فصحى العصر",c:"#9DBDF0",ex:"ماذا تريد؟",d:"Modern yazı dili. Konuşulurken cümle sonları çoğu zaman vakıfla söylenir. Okul kitabının gövdesi.",w:"Haber, gazete, ders kitabı, resmî yazışma"},
 {n:"Aydınların ammicesi",ar:"عامية المثقفين",c:"#7FD0C1",ex:"شو بتريد؟",d:"Fasih kelimelerle dolu, lehçe dil bilgisiyle konuşulan karma kayıt.",w:"Talk show, panel, öğretmenler odası"},
 {n:"Okumuşların ammicesi",ar:"عامية المتنورين",c:"#F0B45E",ex:"شو بدّك؟",d:"Okumuş kişinin ev, iş ve çarşı dili. Fasih kelimeler azalır.",w:"Ev, arkadaş, çarşı, dizi"},
 {n:"Ümmîlerin ammicesi",ar:"عامية الأميين",c:"#F0B45E",ex:"شو بدّك يا زلمة؟",d:"Yalnız yerel ağız; fasih etkisi en az. Yabancı öğrencinin hedefi olamaz.",w:"Köy, yerel pazar"},
];
const rng=$("#contRange"), ticks=$("#contTicks");
C.forEach((c,i)=>{const b=document.createElement("button");b.type="button";b.textContent=c.n;b.onclick=()=>{rng.value=i;drawC()};ticks.appendChild(b)});
function drawC(){
  const k=+rng.value,c=C[k];
  $("#contDot").style.left=(k/4*100)+"%"; $("#contDot").style.borderColor=c.c;
  [...ticks.children].forEach((b,i)=>b.setAttribute("aria-pressed",i===k));
  $("#contOut").innerHTML=`<div class="ar big" style="color:${c.c}">${esc(c.ex)}</div><div style="display:grid;gap:10px"><div class="eyebrow" style="color:${c.c}">${k+1}. seviye · ${c.n} · <span class="ar" style="font-size:1.2em;letter-spacing:0">${c.ar}</span></div><p>${c.d}</p><p class="small muted"><b>Nerede duyulur:</b> ${c.w}</p></div>`;
}
rng.addEventListener("input",drawC); drawC();

/* ---------- 4 · grafikler ---------- */
function lexChart(){
  const svg=d3.select("#lexChart"); if(!window.d3) return;
  const data=[{k:"Fasihle aynı",v:21.2,c:css("--fasih")},{k:"Akraba (ses farkıyla)",v:40.6,c:css("--orta")},{k:"Yalnız ammicede",v:38.2,c:css("--ammi")}];
  const g=svg.append("g").attr("transform","translate(125,125)");
  const pie=d3.pie().value(d=>d.v).sort(null), arc=d3.arc().innerRadius(68).outerRadius(112).cornerRadius(4).padAngle(.012);
  g.selectAll("path").data(pie(data)).join("path").attr("fill",d=>d.data.c)
   .transition().duration(reduce?0:1100).delay((d,i)=>i*180).attrTween("d",d=>{const i=d3.interpolate({startAngle:d.startAngle,endAngle:d.startAngle},d);return t=>arc(i(t))});
  g.append("text").attr("text-anchor","middle").attr("y",-4).attr("font-size",34).attr("font-weight",800).attr("fill",css("--ink")).text("%62");
  g.append("text").attr("text-anchor","middle").attr("y",20).attr("font-size",12.5).attr("fill",css("--muted")).text("bağlantılı");
  data.forEach((d,i)=>{const y=58+i*66;svg.append("rect").attr("x",270).attr("y",y-18).attr("width",12).attr("height",12).attr("rx",3).attr("fill",d.c);
    svg.append("text").attr("x",292).attr("y",y-7).attr("font-size",14).attr("fill",css("--muted")).text(d.k);
    svg.append("text").attr("x",292).attr("y",y+28).attr("font-size",34).attr("font-weight",800).attr("fill",d.c).text("%"+String(d.v).replace(".",","));});
}
function fsiChart(){
  const svg=d3.select("#fsiChart"); if(!window.d3) return;
  const data=[["1. grup","İspanyolca, Fransızca",750],["2. grup","Almanca",900],["3. grup","Türkçe, Rusça",1100],["4. grup","Arapça, Çince",2200]];
  const x=d3.scaleLinear().domain([0,2200]).range([0,300]);
  data.forEach((d,i)=>{const y=14+i*58, hl=i===3;
    svg.append("text").attr("x",0).attr("y",y+12).attr("font-size",14).attr("font-weight",700).attr("fill",hl?css("--ammi"):css("--ink")).text(d[0]);
    svg.append("text").attr("x",0).attr("y",y+30).attr("font-size",12).attr("fill",css("--muted")).text(d[1]);
    svg.append("rect").attr("x",130).attr("y",y).attr("height",32).attr("rx",6).attr("fill",css("--line")).attr("width",300);
    svg.append("rect").attr("x",130).attr("y",y).attr("height",32).attr("rx",6).attr("fill",hl?css("--ammi"):css("--fasih-2")).attr("opacity",hl?1:.55).attr("width",0)
      .transition().duration(reduce?0:1000).delay(i*120).attr("width",x(d[2]));
    svg.append("text").attr("x",442).attr("y",y+22).attr("font-size",17).attr("font-weight",800).attr("fill",hl?css("--ammi"):css("--ink")).text(d[2].toLocaleString("tr-TR")+" s");
  });
}
whenSeen($("#lexChart"),lexChart);
whenSeen($("#fsiChart"),fsiChart);

/* ---------- 5 · DLIFLC ---------- */
const DS=[[100,"Lehçede dinleme","#F0B45E"],[100,"Lehçede konuşma","#F0B45E"],[75,"Fasihte okuma","#9DBDF0"]];
$("#dliStats").innerHTML=DS.map((d,i)=>`<div class="stat"><b style="color:${d[2]}" data-n="${d[0]}">%0</b><span>${d[1]} hedefine ulaşan</span><div class="meter"><i style="background:${d[2]}"></i></div></div>`).join("");
whenSeen($("#dliStats"),()=>{
  $("#dliStats").querySelectorAll(".stat").forEach((s,i)=>{
    const b=s.querySelector("b"),n=+b.dataset.n,bar=s.querySelector(".meter i");
    setTimeout(()=>{bar.style.width=n+"%"},i*150);
    if(reduce){b.textContent="%"+n;return}
    const t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/1300);b.textContent="%"+Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0);
  });
});

/* ---------- 6 · yaklaşımlar ---------- */
const A=[
 {t:"Yalnız fasih",s:"Türkiye, İran, Pakistan, Malezya",f:100,o:0,a:0,w:"Türkiye, İran, Pakistan, Malezya okulları; Medine kitapları; CIMA ve Hamza sınavları",p:"Dinî metin, sınav ve öğretmen kadrosuyla tam uyum.",m:"Konuşma sokakta yapay kalır."},
 {t:"Fasih + seçmeli lehçe",s:"Middlebury, SOAS",f:85,o:0,a:15,w:"Middlebury Arapça Okulu: günde 5 saat fasih, isteğe bağlı Şam/Mısır/Fas oturumları. SOAS: yurt dışı yılında konuşma dili.",p:"Gövde bozulmaz, isteyen lehçe alır.",m:"Lehçe kısmı zayıf kalıyor (öğrenci tanıklıkları)."},
 {t:"Konuşma fasihi",s:"Ryding / FSI",f:70,o:30,a:0,w:"Karin Ryding'in FSI için geliştirdiği Formal Spoken Arabic (1990, 2005).",p:"Her ülkede anlaşılan, saygın bir konuşma biçimi.",m:"Kimsenin ana dili değil; tam doğal duyulmaz."},
 {t:"Paralel ayrı dersler",s:"Qasid (Amman), eski CASA",f:55,o:0,a:45,w:"Qasid: klasik, fasih, Şam ağzı ve (2026'dan beri) Körfez ayrı programlar. CASA'nın eski müfredatı.",p:"Her çeşit kendi kitabıyla, net sınırlarla.",m:"İki ayrı dil gibi algılanır; saat ikiye katlanır."},
 {t:"Bütünleşik",s:"Cornell, el-Kitâb, Leiden",f:45,o:10,a:45,w:"Cornell'de Munther Younes (Şam ağzı), el-Kitâb 3. baskı (Mısır + Şam), Leiden lisans 1. yıl (fasih + Mısır).",p:"Ana dili Arapça olanların kullanımını taklit eder: konuşma lehçe, okuma-yazma fasih.",m:"Hangi lehçe sorusu; öğretmen ve materyal yükü."},
 {t:"Önce lehçe",s:"DLIFLC 2009 sonrası",f:25,o:0,a:75,w:"ABD Savunma Dil Enstitüsü pilot sınıfları.",p:"Konuşma ve dinleme hızla kazanılır.",m:"Fasih okuma geriler; günde 1 saat fasih eklendi."},
];
$("#appr").innerHTML=A.map((x,i)=>`<div class="appr-row" role="button" tabindex="0" aria-expanded="false" data-i="${i}"><div class="appr-name">${x.t}<small>${x.s}</small></div><div class="appr-bar"><i data-w="${x.f}" style="background:var(--fasih-2)"></i><i data-w="${x.o}" style="background:var(--orta)"></i><i data-w="${x.a}" style="background:var(--ammi-2)"></i></div><span class="muted" style="font-family:var(--f-display);font-weight:700">+</span></div>
<div class="appr-detail" id="ad${i}"><div class="card"><span class="tag O">Artı</span><p class="small">${x.p}</p></div><div class="card"><span class="tag W">Bedel</span><p class="small">${x.m}</p></div><p class="small muted" style="grid-column:1/-1"><b>Kim uyguluyor:</b> ${x.w}</p></div>`).join("");
$("#appr").querySelectorAll(".appr-row").forEach(r=>{
  const tog=()=>{const o=r.getAttribute("aria-expanded")==="true";r.setAttribute("aria-expanded",!o);$("#ad"+r.dataset.i).classList.toggle("open",!o);r.lastElementChild.textContent=o?"+":"−"};
  r.addEventListener("click",tog); r.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();tog()}});
});
whenSeen($("#appr"),()=>$("#appr").querySelectorAll(".appr-bar i").forEach((b,i)=>setTimeout(()=>b.style.width=b.dataset.w+"%",Math.floor(i/3)*90)));

/* ---------- 7 · CEFR basamakları ---------- */
const L=[
 ["A1","En basit nezaket kalıplarıyla (selam, tanışma, lütfen, teşekkür, özür) temel sosyal temas kurar.","Can establish basic social contact by using the simplest everyday polite forms…","Bu kalıplar fasihte ve lehçelerde neredeyse ortak: السلام عليكم، شكرًا، من فضلك"],
 ["A2","Temel dil işlevlerini yerine getirir; en yaygın ifadelerle basit ama etkili sohbet eder.","Can socialise simply but effectively using the simplest common expressions…","Ortak çekirdek kelimelerle vakıflı fasih yeter."],
 ["B1","Geniş bir işlev yelpazesini en yaygın karşılıklarıyla, nötr kayıtta yerine getirir.","…using their most common exponents in a neutral register.","Nötr kayıt = sade, vakıflı konuşma fasihi.",1],
 ["B2","Duruma uygun resmî ya da gayriresmî kayıtta kendini ifade eder; ikisi arasında bir ölçüde ayrım yapar.","Can express themselves … in a formal or informal register appropriate to the situation…","Ammiceyi tanıma ve birkaç kalıbı yerinde kullanma burada başlar.",1],
 ["C1","Resmî, gayriresmî ya da gündelik konuşmaya göre kaydını ayarlar.","…formal, informal or colloquial as appropriate…","A1–B2 programının dışında."],
];
$("#steps").innerHTML=L.map(l=>`<div class="step rv${l[4]?" key":""}"><div class="lv" style="color:${l[4]?"var(--orta)":"var(--fasih)"}">${l[0]}</div><div><b>${l[1]}</b><q lang="en">${esc(l[2])}</q><div class="imp">→ ${l[3]}</div></div></div>`).join("")+`<p class="src">CEFR Ek Cilt, "Toplumdilsel uygunluk" ölçeği (2018 metni, 2020'de korunmuş). Türkçeler özet çeviridir.</p>`;
$("#steps").querySelectorAll(".rv").forEach(el=>io.observe(el));

/* ---------- 8 · muhataplar ---------- */
const N=[
 ["muhatap_din","F","Fasih","Kur'an, hadis, dua","Birinci motivasyon","İmam Hatip öğrencisinin dile yaklaşma sebebi. Klasik ve fasih Arapça."],
 ["muhatap_haber","F","Fasih","Haber, akademi","İlahiyat: en az B1","Haber kanalları, gazete, üniversite. İlahiyat hazırlık sınıfları fasih öğretiyor."],
 ["muhatap_suriyeli","A","Şam ağzı","Türkiye'deki Suriyeliler","≈2,2 milyon","Geçici koruma altındaki Suriyeli sayısı (Ekim 2026) ve düşüyor. Sokakta en sık duyulan Arapça."],
 ["muhatap_hac","A","Hicaz / Körfez","Hac ve umre","≈85 bin hacı/yıl","Türkiye'nin hac kotası. Esnaf ve görevlilerle konuşma Hicaz ve Körfez ağzıyla."],
];
$("#needs").innerHTML=N.map(n=>`<div class="pcard"><div class="figure"><img src="img/${n[0]}.jpg" alt="${esc(n[3])}" loading="lazy"></div><div class="body"><span class="tag ${n[1]}">${n[2]}</span><h3 style="font-size:20px">${n[3]}</h3><div class="big ${n[1]==="F"?"f":"a"}">${n[4]}</div><p class="small muted">${n[5]}</p></div></div>`).join("");

/* ---------- 9 · karar aracı ---------- */
const K=[["Dinî metne erişim",5],["Gerçek hayatta konuşma",4],["Mevzuat uyumu (KRT 6.2.4)",4],["Öğretmen ve materyal hazırlığı",4],["Öğrenci yükü (hafif)",3],["Sınav ve sertifika uyumu",3],["Türkiye'deki Arap muhataplar",2]];
const O=[["A · Yalnız fasih",[5,1,5,5,5,5,1],"--fasih-2"],["B · Fasih gövde + ammice penceresi",[5,3,4,4,4,5,3],"--orta"],["C · Tam bütünleşik",[3,5,2,2,2,3,5],"--muted"],["D · Önce ammice",[1,5,1,1,3,1,5],"--ammi-2"]];
$("#weights").innerHTML=`<div class="eyebrow">Ölçütlerin ağırlığı (0–5)</div>`+K.map((k,i)=>`<div class="wrow"><label for="w${i}">${k[0]}</label><input type="range" id="w${i}" min="0" max="5" value="${k[1]}"><output id="wo${i}">${k[1]}</output></div>`).join("");
function drawK(){
  const w=K.map((k,i)=>{const v=+$("#w"+i).value;$("#wo"+i).textContent=v;return v});
  const tot=w.reduce((a,b)=>a+b,0)||1;
  const sc=O.map(o=>({n:o[0],c:o[2],s:Math.round(o[1].reduce((a,v,i)=>a+v*w[i],0)/(tot*5)*100)})).sort((a,b)=>b.s-a.s);
  $("#results").innerHTML=sc.map((s,i)=>`<div class="resrow"><div><div class="name">${i===0?"<b>":""}${s.n}${i===0?"</b>":""}</div><div class="track"><div class="fill" style="width:${s.s}%;background:var(${s.c})"></div></div></div><b>${s.s}</b></div>`).join("");
  const a=sc.find(s=>s.n[0]==="A").s,b=sc.find(s=>s.n[0]==="B").s;
  $("#resNote").textContent=b>=a?"B, A'nın güçlü yanlarını korurken konuşma ve gerçek muhatap ölçütlerinde puan topluyor.":"Bu ağırlıklarla mevcut durum (A) önde. Konuşma ya da muhatap ağırlığını artırınca B öne geçiyor.";
}
K.forEach((k,i)=>$("#w"+i).addEventListener("input",drawK)); drawK();

/* ---------- 10 · matris ---------- */
const LV=["Pre-A1 / A1","A2","B1","B2"], SK=["Dinleme / İzleme","Okuma","Konuşma","Yazma","Aracılık"];
const M=[
 [["F","Fasih","doğal hız, vakıflı","Öğrenci fasihi kitap okur gibi değil, konuşma hızında ve vakıflı duyar. Yeni kelime ilk kez dinlemede çıkar."],["F","Fasih","tam harekeli","Başlangıçta tam hareke; seviye ilerledikçe azalır."],["F","Konuşma fasihi","ezber kalıplar","Selam, tanışma, teşekkür: fasihte ve lehçelerde neredeyse aynı kalıplar. Öğrenci ilk günden sokakta da işe yarayanı öğrenir."],["F","Fasih","harf, kelime, kısa cümle","Yazı tamamen fasih."],null],
 [["A","Fasih + pencere","ammiceyi tanıma","Her ünitede bir kulak penceresi: ünitedeki sahnenin Şam ağzıyla kaydı. Öğrenci fiyatı, yeri ya da kararı işaretler, sonra fasih biçimle eşler (كثير ← كتير). Ölçme dışı."],["F","Fasih","","Okuma metinleri fasih. Pencere metni yazılı verilirse ayrı çerçevede, 'dinleme metni' etiketiyle."],["F","Konuşma fasihi","ortak çekirdek kelimeler","Çarşı, yol sorma, randevu: ortak kelimelerle vakıflı fasih."],["F","Fasih","",""],["O","Basit aktarma","görsel ve Türkçe destekli","Bir ilan ya da menüdeki bilgiyi arkadaşına Türkçe aktarmak."]],
 [["A","Fasih + geniş pencere","kısa sahne, şarkı, dizi kesiti","Pencere genişler: dizi sahnesi, sesli mesaj. Mısır ağzından birkaç medya örneği tanıma için eklenebilir."],["F","Fasih","kısmi hareke",""],["F","Nötr kayıtta fasih","CEFR B1 ile örtüşür","CEFR B1: 'en yaygın karşılıklarıyla nötr kayıtta.' Arapçada nötr kayıt sade konuşma fasihidir."],["F","Fasih","",""],["O","Ammiceden Türkçeye","özetleme","'Ammice kısa bir sesli mesajı dinler, ana fikrini Türkçe aktarır.' CEFR'in iki çeşit arasında aracılık notuna dayanır."]],
 [["O","Fasih + ammice anlama","haber, tartışma, sohbet","Fasih haber ve tartışma programları; yavaş ve açık ammice sohbeti anlama."],["F","Fasih","harekesiz",""],["O","Resmî fasih + birkaç ammice kalıbı","kayıt bilinci","CEFR B2: resmî ya da gayriresmî kayıtta konuşur, ikisini bir ölçüde ayırır. Sunumda fasih; gayriresmî ortamda birkaç ortak ammice kalıbı."],["F","Fasih","resmî ve gayriresmî tür","Mesaj ve e-posta türlerinde bile fasih; kayıt farkı üslupla gösterilir."],["O","Ammiceden fasihe","aktarma","Ammice bir röportajın özetini fasih yazmak."]],
];
let sel=[1,0];
function drawM(){
  let h="<thead><tr><th>Seviye</th>"+SK.map(s=>`<th>${s}</th>`).join("")+"</tr></thead><tbody>";
  M.forEach((row,r)=>{h+=`<tr><th>${LV[r]}</th>`+row.map((c,k)=>c?`<td><button type="button" class="${c[0]}" data-r="${r}" data-k="${k}" aria-pressed="${sel[0]===r&&sel[1]===k}">${c[1]}${c[2]?`<small>${c[2]}</small>`:""}</button></td>`:`<td style="color:var(--on-night-muted)">—</td>`).join("")+"</tr>"});
  $("#mx").innerHTML=h+"</tbody>";
  $("#mx").querySelectorAll("button").forEach(b=>b.onclick=()=>{sel=[+b.dataset.r,+b.dataset.k];drawM()});
  const c=M[sel[0]][sel[1]];
  $("#mxDetail").innerHTML=`<div class="eyebrow">${LV[sel[0]]} · ${SK[sel[1]]}</div><h3 style="font-size:24px;margin:8px 0 10px">${c[1]}</h3><p style="color:var(--on-night-muted)">${c[3]||"Gövde fasih; bu hücrede özel bir değişiklik yok."}</p>`;
}
drawM();

/* ---------- 12 · saat ---------- */
const GL=[["A1",95],["A2",190],["B1",375],["B2",550]];
function drawH(){
  const w=+$("#cW").value||0,k=+$("#cK").value||0,y=+$("#cY").value||0,m=Math.max(1,+$("#cM").value||1.5);
  const t=w*k*y, need=GL.map(g=>[g[0],Math.round(g[1]*m)]);
  const max=Math.max(need[3][1]*1.12,t*1.06), X=v=>40+v/max*820;
  let reached="A1 altı"; need.forEach(n=>{if(t>=n[1])reached=n[0]});
  const ink=css("--ink"),mut=css("--muted"),ln=css("--line"),or=css("--orta");
  let h=`<rect x="40" y="96" width="820" height="40" rx="8" fill="${ln}"/>`;
  h+=`<rect x="40" y="96" width="${Math.max(0,X(Math.min(t,max))-40)}" height="40" rx="8" fill="${or}" style="transition:width .5s"/>`;
  need.forEach(n=>{const x=X(n[1]),on=t>=n[1];
    h+=`<line x1="${x}" x2="${x}" y1="70" y2="160" stroke="${on?or:mut}" stroke-width="2" stroke-dasharray="${on?"":"4 4"}"/>`;
    h+=`<text x="${x}" y="58" text-anchor="middle" font-size="22" font-weight="800" fill="${on?or:ink}">${n[0]}</text>`;
    h+=`<text x="${x}" y="182" text-anchor="middle" font-size="13" fill="${mut}">≈${n[1].toLocaleString("tr-TR")} s</text>`;});
  h+=`<text x="40" y="218" font-size="17" fill="${ink}">Toplam <tspan font-weight="800">${t.toLocaleString("tr-TR")} saat</tspan> → tahmini seviye: <tspan font-weight="800" fill="${or}">${reached}</tspan></text>`;
  $("#hourChart").innerHTML=h;
}
["cW","cK","cY","cM"].forEach(i=>$("#"+i).addEventListener("input",drawH)); drawH();

/* ---------- 13 · sözlük ---------- */
const S=[
 ["Fasih (fushâ)","فصحى","Yazının ve resmî konuşmanın Arapçası. Klasik (Kur'an, turâs) ve modern standart (MSA) diye ikiye ayrılır."],
 ["Modern Standart Arapça","العربية المعاصرة","Bugünün gazete, haber ve kitap dili. Dil bilgisi klasikle ortak; kelime ve üslup modern."],
 ["Ammice ('âmmiyye)","عامية","Gündelik konuşma dili; ülkeye ve bölgeye göre değişir. Mağrib'de 'dârice' denir."],
 ["Diglosi","ازدواجية لغوية","Bir dilin iki çeşidinin toplumda farklı işlerle paylaşılması (Ferguson 1959)."],
 ["Eğitimli konuşma Arapçası","عامية المثقفين","Fasih kelimelerle dolu, lehçe dil bilgisiyle konuşulan karma kayıt. Badavî'nin 3. seviyesi."],
 ["Vakıf","الوقف","Kelime sonunda i'rab harekesini söylemeden durmak. Konuşma fasihinin doğal duyulmasının anahtarı."],
 ["Kayıt (register)","مستوى الكلام","Duruma göre seçilen dil biçimi: resmî, nötr, gayriresmî. CEFR'de B1 nötr, B2 resmî/gayriresmî."],
 ["Aracılık (mediation)","الوساطة","Duyduğunu ya da okuduğunu başkası için aktarmak, özetlemek. CEFR'e göre aynı dilin iki çeşidi arasında da olabilir."],
 ["Alımlama / üretim","التلقي والإنتاج","Dinleme ve okuma alımlama; konuşma ve yazma üretim. Ammice penceresi yalnız alımlamada."],
 ["Akraba kelime","كلمات متجانسة","Aynı kökten gelip sesi değişmiş kelime: كثير ← كتير، ثلاثة ← تلاتة."],
 ["Kod değiştirme","التناوب اللغوي","Konuşma içinde fasihten ammiceye geçip dönme; hutbe, ders ve tartışmalarda sık görülür."],
 ["KRT 6.2.4","","MEB ders kitabı inceleme ölçütü: kitap, programda 'temel alınan lehçe'ye uygun olmalı."],
];
$("#gloss").innerHTML=S.map(s=>`<div class="card"><h3 style="font-size:19px">${s[0]}</h3>${s[1]?`<div class="ar f" style="font-size:26px;line-height:1.4">${s[1]}</div>`:""}<p class="small muted">${s[2]}</p></div>`).join("");
})();
