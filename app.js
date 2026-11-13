(function(){
  var $=function(q,r){return (r||document).querySelector(q)}, $$=function(q,r){return [].slice.call((r||document).querySelectorAll(q))};
  var app=$('#app'), tabbar=$('#tabbar'), stack=['splash'];

  /* ---------- skala layar ---------- */
  function fit(){
    var vw=window.innerWidth, vh=window.innerHeight, mobile=vw<=540;
    document.body.classList.toggle('mobile',mobile);
    if(mobile){var s=vw/412; app.style.height=(vh/s)+'px'; app.style.transform='scale('+s+')';}
    else{var s2=Math.min(1,(vh-24)/917); app.style.height='917px'; app.style.transform='scale('+s2+')';}
  }
  window.addEventListener('resize',fit); fit();

  /* ---------- navigasi ---------- */
  function show(id){
    $$('.screen').forEach(function(el){el.classList.toggle('on',el.id===id)});
    var sc=$('#'+id), tab=sc.getAttribute('data-tab');
    tabbar.classList.toggle('show',!!tab);
    $$('a',tabbar).forEach(function(a){a.classList.toggle('on',a.getAttribute('data-tabgo')===tab)});
    document.body.classList.toggle('light-sb',id==='lens');
    var b=$('.body',sc); if(b) b.scrollTop=0;
    if(id==='rute') renderRoutes();
    if(id==='rekomendasi') $('#whoChip').textContent=$('#vulTog').checked?'Kelompok Rentan':'Umum';
    try{history.replaceState(null,'','#'+id)}catch(e){}
  }
  function go(id){ if(stack[stack.length-1]!==id) stack.push(id); show(id); }
  function back(){ if(stack.length>1) stack.pop(); show(stack[stack.length-1]); }
  function reset(id){ stack=[id]; show(id); }

  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-go],[data-back],[data-tabgo],[data-toast]'); if(!t) return;
    if(t.hasAttribute('data-toast')) return toast(t.getAttribute('data-toast'));
    if(t.hasAttribute('data-back')) return back();
    if(t.hasAttribute('data-tabgo')) return reset(t.getAttribute('data-tabgo'));
    var id=t.getAttribute('data-go');
    if(t.hasAttribute('data-reset')||t.hasAttribute('data-reset-to')) reset(id); else go(id);
  });

  var tt; function toast(m){var el=$('#toast'); el.textContent=m; el.classList.add('show'); clearTimeout(tt); tt=setTimeout(function(){el.classList.remove('show')},2200);}

  /* ---------- onboarding ---------- */
  var track=$('#onbTrack'), dots=$$('#onbDots i'), texts=[
    'Dapatkan Informasi kualitas udara terkini di lokasi anda dan sekitarnya',
    'Temukan rute perjalanan dengan paparan polusi paling rendah untuk perjalanan yang lebih sehat',
    'Dapatkan notifikasi saat kualitas udara memburuk agar Anda bisa bersiap lebih awal'];
  function setSlide(i){dots.forEach(function(d,k){d.classList.toggle('on',k===i)}); $('#onbText').textContent=texts[i];}
  track.addEventListener('scroll',function(){setSlide(Math.round(track.scrollLeft/track.clientWidth))});
  dots.forEach(function(d,i){d.addEventListener('click',function(){track.scrollTo({left:i*track.clientWidth,behavior:'smooth'})})});

  /* ---------- parameter udara ---------- */
  var info={'PM2.5':'Partikel halus ≤2,5 µm. 18 µg/m³ — masih di bawah ambang 55 µg/m³.','PM10':'Partikel debu ≤10 µm. 32 µg/m³ — kategori baik.','CO':'Karbon monoksida 0,8 ppm — aman.','NO₂':'Nitrogen dioksida 21 µg/m³ — aman.','SO₂':'Sulfur dioksida 12 µg/m³ — aman.','O₃':'Ozon permukaan 48 µg/m³ — aman.'};
  $$('#paramList li').forEach(function(li){li.addEventListener('click',function(){toast(info[li.getAttribute('data-p')])})});

  /* ---------- rute ---------- */
  var pref='aman';
  var R={
    aman:{t:'Rute Aman (Polusi Terendah)',c:'#1fb36b',ispu:42,l:'Baik',lc:'#1fb36b',km:'12,6 km',mn:'24 mnt',badge:'✓ Terbaik',bb:'#dff5e8',pos:17,d:'M22 60 L60 130 L98 96 L150 70 L205 58 L232 110 L290 128 L330 118 L352 40'},
    cepat:{t:'Rute Tercepat',c:'#2f6bf0',ispu:58,l:'sedang',lc:'#e09a08',km:'10,8 km',mn:'18 mnt',badge:'⚡ Tercepat',bb:'#2f6bf0',pos:27,d:'M22 60 L70 112 L120 84 L175 104 L240 112 L300 122 L352 60'},
    pendek:{t:'RuteTerpendek',c:'#f2791e',ispu:64,l:'sedang',lc:'#e09a08',km:'9,5 km',mn:'20 mnt',badge:'★ Terpendek',bb:'#fdebd8',pos:29,d:'M22 70 L55 112 L95 82 L140 112 L190 78 L225 56 L262 98 L300 86 L352 122'}
  };
  var names={aman:'Cari Rute Aman',cepat:'Cari Rute Cepat',pendek:'Cari Rute Pendek'};
  $$('#modes button').forEach(function(b){b.addEventListener('click',function(){$$('#modes button').forEach(function(x){x.classList.toggle('on',x===b)})})});
  $$('#prefs label').forEach(function(l){l.addEventListener('click',function(){pref=l.getAttribute('data-k'); $$('#prefs label').forEach(function(x){x.classList.toggle('on',x===l)}); $('#cariRute').textContent=names[pref];})});
  $('#cariRute').addEventListener('click',function(){go('rute')});
  function renderRoutes(){
    var order=[pref].concat(['aman','cepat','pendek'].filter(function(k){return k!==pref}));
    $('#ruteList').innerHTML=order.map(function(k,i){var r=R[k], best=i===0;
      return '<a class="rc'+(best?' best':'')+'" data-route="'+k+'" style="--c:'+(best?r.c:'transparent')+'"><div class="rc-h">'+r.t+'<svg><use href="#i-chev"/></svg></div>'+
      '<div class="rc-map"><div class="roads"></div><svg viewBox="0 0 374 176" preserveAspectRatio="none"><path d="'+r.d+'" fill="none" stroke="'+r.c+'" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'+
      '<g fill="#fff" stroke="'+r.c+'" stroke-width="2.500"><circle cx="'+r.d.split(' ')[0].slice(1)+'" cy="'+r.d.split(' ')[1]+'" r="5"/><circle cx="352" cy="'+r.d.split(' ').pop()+'" r="5"/></g></svg></div>'+
      '<div class="rc-s"><div>ISPU Rata-rata<b style="color:'+r.lc+'">'+r.ispu+'</b><small style="color:'+r.lc+'">'+r.l+'</small></div><div>Jarak<b>'+r.km+'</b></div><div>Waktu<b>'+r.mn+'</b></div>'+
      (best?'<span class="badge" style="background:'+r.bb+';color:'+(k==='cepat'?'#fff':r.c)+'">'+r.badge+'</span>':'')+'</div></a>';}).join('');
  }
  $('#ruteList').addEventListener('click',function(e){var a=e.target.closest('[data-route]'); if(!a) return; var r=R[a.getAttribute('data-route')];
    $('#naviIspu').textContent=r.ispu; $('#naviLbl').textContent=r.l.charAt(0).toUpperCase()+r.l.slice(1); $('#naviIspu').parentNode.style.color=r.lc;
    $('#naviDot').style.left=r.pos+'%'; $('#naviTime').textContent=r.mn; $('#naviDist').textContent=r.km+' · 11:09 WIB'; $('#naviPath').style.stroke=r.c; go('navi');});

  /* ---------- profil & keluarga ---------- */
  var fam=[{a:'👦',n:'Rizky (7 th)'},{a:'🧓',n:'Budi (65 th)'},{a:'👩',n:'Rina (20 th)',x:'Penyakit : ISPA'},{a:'👶',n:'Aisya (5 bln)'}];
  function renderFam(){ $('#famList').innerHTML=fam.map(function(m,i){return '<div class="fam"><span class="ava">'+m.a+'</span><b>'+esc(m.n)+'</b>'+(m.x?'<small>'+esc(m.x)+'</small>':'')+'<button data-rm="'+i+'" aria-label="Hapus">×</button></div>'}).join(''); }
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  $('#famList').addEventListener('click',function(e){var b=e.target.closest('[data-rm]'); if(!b) return; fam.splice(+b.getAttribute('data-rm'),1); renderFam();});
  renderFam();
  var vt=$('#vulTog'); function vul(){ $('.vul').classList.toggle('off',!vt.checked); }
  vt.addEventListener('change',function(){vul(); toast(vt.checked?'Mode Kelompok Rentan aktif — ambang notifikasi diturunkan':'Mode Kelompok Rentan nonaktif');}); vul();

  $('#saveProfile').addEventListener('click',function(){
    var n=$('#eName').value.trim()||'Daffa'; $('#pName').textContent=n; $('#sName').textContent=n;
    $('#pMail').textContent=$('#eMail').value; $('#sMail').textContent=$('#eMail').value; $('#pLoc').textContent=$('#eLoc').value;
    toast('Perubahan disimpan'); back();});

  var cat=null;
  $$('#cats label').forEach(function(l){l.addEventListener('click',function(){cat=l; $$('#cats label').forEach(function(x){x.classList.toggle('on',x===l)})})});
  $('#catNext').addEventListener('click',function(){ if(!cat) return toast('Pilih kategori terlebih dahulu');
    $('#mAva').textContent=cat.getAttribute('data-a'); $('#mInfo').style.display=cat.getAttribute('data-s')==='1'?'flex':'none';
    $('#mName').value='';$('#mAge').value='';$('#mNote').value='';$('#mWho').textContent='anggota ini'; go('tambah2');});
  $('#mName').addEventListener('input',function(){$('#mWho').textContent=this.value.trim()||'anggota ini'});
  $('#saveMember').addEventListener('click',function(){ var n=$('#mName').value.trim(); if(!n) return toast('Isi nama anggota');
    var age=$('#mAge').value.trim(); if(age&&/^\d+$/.test(age)) age+=' th';
    fam.push({a:$('#mAva').textContent,n:n+(age?' ('+age+')':''),x:$('#mNote').value.trim()}); renderFam();
    if(!vt.checked){vt.checked=true;vul();}
    toast(n+' ditambahkan'); reset('profile');});

  /* ---------- mulai ---------- */
  window.addEventListener('hashchange',function(){var x=location.hash.slice(1); if(x&&x!==stack[stack.length-1]&&document.getElementById(x)&&document.getElementById(x).classList.contains('screen')) go(x);});
  var h=location.hash.slice(1); if(h&&document.getElementById(h)&&$('#'+h).classList.contains('screen')){stack=[h]; show(h);} else show('splash');
})();
