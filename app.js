(function(){
  var $=function(q,r){return (r||document).querySelector(q)}, $$=function(q,r){return [].slice.call((r||document).querySelectorAll(q))};
  var app=$('#app'), tabbar=$('#tabbar'), stack=['splash'], guest=false;
  var GATED={tujuan:1,ruteset:1,rute:1,navi:1,lens:1,verif:1,profile:1,edit:1,setting:1,tambah:1,tambah2:1};
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function ic(n){return '<svg><use href="#'+n+'"/></svg>'}

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
    if(id==='kualitas') renderLoc();
    if(id==='lokasi') renderLok();
    if(id==='lens') $('#finder').className='finder '+(lensTry?'clear':'blur');
    if(id==='verif') startVerif();
    if(id==='rekomendasi') $('#whoChip').textContent=$('#vulTog').checked?'Kelompok Rentan':'Umum';
    closeOv();
    if(guest&&GATED[id]) $('#ovGate').classList.add('on');
    try{history.replaceState(null,'','#'+id)}catch(e){}
  }
  function go(id){ if(stack[stack.length-1]!==id) stack.push(id); show(id); }
  function back(){ if(stack.length>1){stack.pop(); show(stack[stack.length-1]);} else reset('home'); }
  function reset(id){ stack=[id]; show(id); }
  function closeOv(){ $$('.ov').forEach(function(o){o.classList.remove('on')}); }

  document.addEventListener('click',function(e){
    var ov=e.target.classList&&e.target.classList.contains('ov')?e.target:null;
    if(ov){ if(ov.id==='ovGate'){closeOv(); back();} else closeOv(); return; }
    var t=e.target.closest('[data-go],[data-back],[data-tabgo],[data-toast],[data-loc],[data-sheet],[data-login],[data-ok],[data-close]'); if(!t) return;
    if(t.hasAttribute('data-close')) return closeOv();
    if(t.hasAttribute('data-toast')) return toast(t.getAttribute('data-toast'));
    if(t.hasAttribute('data-sheet')) return $('#ovFilter').classList.add('on');
    if(t.hasAttribute('data-back')) return back();
    if(t.hasAttribute('data-tabgo')) return reset(t.getAttribute('data-tabgo'));
    if(t.hasAttribute('data-login')){ guest=false; return reset('home'); }
    if(t.hasAttribute('data-ok')) return ok(t.getAttribute('data-ok'));
    if(t.hasAttribute('data-loc')){ curLoc=t.getAttribute('data-loc'); return go('kualitas'); }
    var id=t.getAttribute('data-go');
    if(t.hasAttribute('data-reset')) reset(id); else go(id);
  });
  $('#guestBtn').addEventListener('click',function(){guest=true; reset('home');});
  $('#gateBtn').addEventListener('click',function(){closeOv(); reset('signin');});
  $('#logout').addEventListener('click',function(){guest=false; reset('onb');});

  var tt; function toast(m){var el=$('#toast'); el.textContent=m; el.classList.add('show'); clearTimeout(tt); tt=setTimeout(function(){el.classList.remove('show')},2200);}

  /* ---------- onboarding ---------- */
  var track=$('#onbTrack'), dots=$$('#onbDots i'), texts=[
    'Dapatkan Informasi kualitas udara terkini di lokasi anda dan sekitarnya',
    'Temukan rute perjalanan dengan paparan polusi paling rendah untuk perjalanan yang lebih sehat',
    'Dapatkan notifikasi saat kualitas udara memburuk agar Anda bisa bersiap lebih awal'];
  function setSlide(i){dots.forEach(function(d,k){d.classList.toggle('on',k===i)}); $('#onbText').textContent=texts[i];}
  track.addEventListener('scroll',function(){setSlide(Math.round(track.scrollLeft/track.clientWidth))});
  dots.forEach(function(d,i){d.addEventListener('click',function(){track.scrollTo({left:i*track.clientWidth,behavior:'smooth'})})});

  /* ---------- lokasi & kualitas udara ---------- */
  var LOC={
    selatan:{n:'Bekasi Selatan',v:64,l:'Sedang',k:'sedang',p:[18,32,0.8,21,12,48],t:'10:42 WIB',d:'3.1 Km',ic:'b'},
    barat:{n:'Bekasi Barat',v:58,l:'Baik',k:'baik',p:[16,22,0.6,16,10,32],t:'10:40 WIB',d:'4.6 Km',ic:'g'},
    timur:{n:'Bekasi Timur',v:131,l:'Tidak Sehat',k:'buruk',p:[21,40,0.9,42,18,67],t:'10:39 WIB',d:'6.2 Km',ic:'y'},
    utara:{n:'Bekasi Utara',v:46,l:'Baik',k:'baik',p:[12,19,0.5,14,8,28],t:'10:35 WIB',d:'9.6 km',ic:'g'},
    mustika:{n:'Mustika Jelatri',v:101,l:'Tidak Sehat',k:'buruk',p:[20,37,0.9,38,16,60],t:'10:31 WIB',d:'8.1 km',ic:'y'},
    jaya:{n:'Bekasi Jaya',v:231,l:'Sangat Tidak Sehat',k:'parah',p:[38,72,1.4,66,29,95],t:'10:30 WIB',d:'13.1 km',ic:'r'},
    tambun:{n:'Tambun',v:72,l:'Sedang',k:'sedang',p:[19,34,0.8,23,13,50],t:'10:28 WIB',d:'13.5 km',ic:'b'}
  };
  var KIND={
    baik:{c:'#2fae5f',bg:'#e8f9ef',img:'m_sun',tx:'Kualitas udara masih dapat diterima untuk sebagian besar kegiatan luar ruangan.'},
    sedang:{c:'#3b6fe0',bg:'#dce7fb',img:'m_sedang',tx:'Kualitas udara sedang.masih aman untuk beraktivitas di luar ruangan.'},
    buruk:{c:'#e5533a',bg:'#fff6e5',img:'m_mask',tx:'Kualitas udara tidak sehat.Kurangi aktivitas diluar ruangan dan gunakan masker jika perlu.',tc:'#f2791e'},
    parah:{c:'#c9321e',bg:'#fde9e4',img:'m_mask',tx:'Kualitas udara sangat tidak sehat.Hindari aktivitas di luar ruangan dan gunakan masker.',tc:'#c9321e'}
  };
  var PN=['PM2.5','PM10','CO','NO₂','SO₂','O₃'], PC=['#3b6fe0','#8a6fe0','#2bb5a0','#f2c81d','#f28a1d','#e5403a'];
  var curLoc='selatan';
  function renderLoc(){
    var L=LOC[curLoc]||LOC.selatan, K=KIND[L.k];
    $('#kName').textContent=L.n; $('#kVal').textContent=L.v; $('#kLbl').textContent=L.l.charAt(0)+L.l.slice(1).toLowerCase(); $('#kLbl').style.color=K.c;
    $('#kPm').textContent=L.p[0]+' µg/m³';
    $('#gArc').setAttribute('stroke-dasharray',Math.min(96,28+L.v/2.15)+' 100');
    $('#paramList').innerHTML=PN.map(function(n,i){return '<li data-p="'+i+'"><i style="background:'+PC[i]+'"></i><b>'+n+'</b><hr><strong>'+L.p[i]+'</strong><em>'+(i===2?'ppm':'µg/m³')+'</em><span>›</span></li>'}).join('');
    var m=$('#kMean'); m.style.background=K.bg; $('h4',m).style.color=K.tc||(L.k==='sedang'?'#3d8df5':K.c); $('#kTxt').textContent=K.tx; $('#kMasc').src='assets/'+K.img+'.png';
  }
  var PINFO=['Partikel halus berukuran ≤2,5 µm, paling mudah masuk ke paru-paru.','Partikel debu berukuran ≤10 µm.','Karbon monoksida dari pembakaran tidak sempurna.','Nitrogen dioksida, umumnya dari asap kendaraan.','Sulfur dioksida, umumnya dari industri.','Ozon permukaan, terbentuk saat terik matahari.'];
  $('#paramList').addEventListener('click',function(e){var li=e.target.closest('li'); if(li) toast(PINFO[+li.getAttribute('data-p')]);});
  function renderLok(){
    var q=$('#lokQ').value.trim().toLowerCase();
    var cls={baik:'gr',sedang:'bl',buruk:'yl',parah:'rd'};
    $('#lokList').innerHTML=Object.keys(LOC).filter(function(k){return LOC[k].n.toLowerCase().indexOf(q)>=0}).map(function(k){var L=LOC[k];
      return '<a data-loc="'+k+'"><span class="ic '+L.ic+'">'+ic('i-antenna')+'</span><div><b>SPKU '+L.n+'</b><p class="'+cls[L.k]+'"><strong>ISPU '+L.v+'</strong><em>'+L.l+'</em></p><small>'+L.t+' &nbsp; '+L.d+'</small></div><span class="go">'+ic('i-chev')+'</span></a>';}).join('')||'<p class="empty">Lokasi tidak ditemukan</p>';
  }
  $('#lokQ').addEventListener('input',renderLok);

  /* ---------- filter peta ---------- */
  $('#ckAll').addEventListener('change',function(){var c=this.checked; $$('#ovFilter .src input').forEach(function(i){i.checked=c})});
  $('#fReset').addEventListener('click',function(){$$('#ovFilter input').forEach(function(i){i.checked=false})});
  $('#fApply').addEventListener('click',function(){var n=$$('#ovFilter input:checked').length; closeOv(); toast(n?'Filter diterapkan':'Menampilkan semua data');});

  /* ---------- tujuan & rute ---------- */
  var DEST='Summarecon Mall Bekasi';
  $('#tujX').addEventListener('click',function(){$('#tujQ').value=''; $('#tujQ').focus();});
  $('#tujSug').addEventListener('click',function(){$('#tujQ').value=DEST;});
  $('#cariTujuan').addEventListener('click',function(){var v=$('#tujQ').value.trim(); if(!v) return toast('Isi tujuan terlebih dahulu'); $('#odDest').textContent=v; go('ruteset');});
  var pref='aman', sel='aman';
  var R={
    aman:{n:'Rute aman',v:42,l:'Baik',c:'#1fa36b',bg:'#e8f6ef',km:'13,6 km',mn:'24 mnt',bd:'Terbaik',bi:'i-leaf',note:'Polusi 35% lebih rendah',ni:'i-trend',nc:'#1b8a5a',btn:'Mulai Navigasi Rute Aman',pos:14},
    cepat:{n:'Rute Tercepat',v:64,l:'Sedang',c:'#2e6bff',bg:'#e6eeff',km:'10,6 km',mn:'16 mnt',bd:'Tercepat',bi:'i-bolt',note:'8 mnt lebih cepat dari rute aman',ni:'i-time',nc:'#1c4fd6',btn:'Mulai Navigasi Rute Cepat',pos:22},
    pendek:{n:'Rute Terpendek',v:70,l:'Sedang',c:'#f2791e',bg:'#fdebdc',km:'9,5 km',mn:'20 mnt',bd:'Terpendek',bi:'i-ruler',note:'4,1 km lebih dekat dari rute aman',ni:'i-ruler',nc:'#b5451b',btn:'Mulai Navigasi Rute Pendek',pos:24}
  };
  var names={aman:'Cari Rute Aman',cepat:'Cari Rute Cepat',pendek:'Cari Rute Pendek'};
  $$('#modes button').forEach(function(b){b.addEventListener('click',function(){$$('#modes button').forEach(function(x){x.classList.toggle('on',x===b)})})});
  $$('#prefs label').forEach(function(l){l.addEventListener('click',function(){pref=l.getAttribute('data-k'); $$('#prefs label').forEach(function(x){x.classList.toggle('on',x===l)}); $('#cariRute').textContent=names[pref];})});
  $('#cariRute').addEventListener('click',function(){sel=pref; go('rute')});
  function renderRoutes(){
    $('#ruteList').innerHTML=['aman','cepat','pendek'].map(function(k){var r=R[k], on=k===sel;
      return '<a class="ro'+(on?' on':'')+'" data-route="'+k+'" style="--c:'+r.c+';--bg:'+r.bg+'"><div class="ro-l"><span class="ro-n"><i></i>'+r.n+'</span><b>'+r.v+'</b><span class="ro-i">ISPU rata-rata <em class="'+(r.l==='Baik'?'g':'y')+'">'+r.l+'</em></span><span class="ro-x" style="color:'+r.nc+'">'+ic(r.ni)+r.note+'</span></div>'+
        '<div class="ro-r"><span class="ro-b">'+ic(r.bi)+r.bd+'</span><span>'+ic('i-dist')+r.km+'</span><span>'+ic('i-time')+r.mn+'</span></div></a>';}).join('');
    $$('#rute .rl').forEach(function(p){p.classList.toggle('on',p.getAttribute('data-k')===sel)});
    var on=$('#rute .rl.on'); on.parentNode.insertBefore(on,$('#rute .rmap circle'));
    var b=$('#mulaiNavi'); b.textContent=R[sel].btn; b.style.background=R[sel].c; b.style.boxShadow='0 10px 18px '+R[sel].c+'55';
  }
  $('#ruteList').addEventListener('click',function(e){var a=e.target.closest('[data-route]'); if(!a) return; sel=a.getAttribute('data-route'); renderRoutes();});
  $('#mulaiNavi').addEventListener('click',function(){var r=R[sel];
    $('#naviIspu').textContent=r.v; $('#naviLbl').textContent=r.l; $('#naviIspu').parentNode.style.color=r.l==='Baik'?'#1fb36b':'#e09a08';
    $('#naviDot').style.left=r.pos+'%'; $('#naviTime').textContent=r.mn; $('#naviDist').textContent=r.km+' · 11:09 WIB'; go('navi');});

  /* ---------- lens & verifikasi AI ---------- */
  var lensTry=0, vt0;
  $('#shutter').addEventListener('click',function(){go('verif')});
  function startVerif(){
    var pass=lensTry>0, ph=$('#vPhoto');
    ph.className='vphoto '+(pass?'clear':'blur')+' load'; $('#vBadge').innerHTML=''; $('#vRes').innerHTML='';
    var bar=$('#vBar'); bar.style.display='block'; bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run');
    clearTimeout(vt0); vt0=setTimeout(function(){
      if(!$('#verif').classList.contains('on')) return;
      ph.classList.remove('load'); bar.style.display='none';
      function li(okk,t){return '<li>'+ic(okk?'i-okc':'i-noc')+t+'</li>'}
      if(pass){
        $('#vBadge').className='vbadge ok'; $('#vBadge').innerHTML=ic('i-shield')+'Foto asli';
        $('#vRes').innerHTML='<div class="card vcheck"><h4>Pemeriksaan AI</h4><ul>'+li(1,'Diambil langsung dari kamera Lens')+li(1,'Lokasi dan waktu cocok')+li(1,'Objek dapat dikenali')+li(1,'Sensor terdekat ikut naik')+'</ul></div>'+
          '<div class="vfound"><b>Pembakaran sampah</b><span>Asap sedang · Bekasi Timur · 10.43 WIB</span></div><button class="btn pill mid" id="vSend">Kirim Laporan</button>';
        $('#vSend').addEventListener('click',function(){lensTry=0; ok('laporan');});
      }else{
        $('#vBadge').className='vbadge no'; $('#vBadge').innerHTML=ic('i-warn')+'Tidak Lolos Verifikasi';
        $('#vRes').innerHTML='<div class="card vcheck"><h4>Pemeriksaan AI</h4><ul>'+li(0,'Foto Buram')+li(0,'Objek sulit dikenali')+li(1,'Lokasi GPS Cocok')+'</ul></div>'+
          '<div class="box tips what"><h4><i>i</i>Tips Foto Lebih Jelas</h4><p>Dekatkan kamera ke objek, tahan beberapa detik, pastikan cahaya cukup.</p></div><button class="btn pill mid" id="vRetry">Ambil Ulang</button>';
        $('#vRetry').addEventListener('click',function(){lensTry=1; back();});
      }
    },2300);
  }

  /* ---------- layar berhasil ---------- */
  function ok(kind,x){
    var T=$('#okT'),P=$('#okP'),X=$('#okX'),B=$('#okB'); X.innerHTML='';
    if(kind==='akun'){ guest=false; T.textContent='Akun berhasil di buat'; T.className='thanks sm'; P.innerHTML='<p>Selamat datang di Respira!<br>tahu lebih awal, jaga lebih cepat</p>'; B.innerHTML='<div class="okgap"></div><button class="btn pill mid" data-go="home" data-reset>Mulai sekarang</button>'; }
    if(kind==='laporan'){ T.textContent='Terima kasih!'; T.className='thanks'; P.innerHTML='<p>Laporan Anda telah berhasil diterima!</p><p>Laporan Anda membantu warga untuk mendapatkan udara yang lebih bersih.</p>'; B.innerHTML='<button class="btn pill mid" data-tabgo="map">Lihat di Peta</button><a class="textbtn" data-tabgo="home">Kembali ke Home</a>'; }
    if(kind==='profil'){ T.textContent='Berhasil disimpan!'; T.className='thanks'; P.innerHTML='<p>Profile anda telah berhasil diperbarui.</p>'; B.innerHTML='<button class="btn pill mid soft" data-tabgo="profile">Lanjutkan</button>'; }
    if(kind==='anggota'){ T.textContent='Anggota berhasil ditambahkan!'; T.className='thanks'; P.innerHTML='<p>Informasi anggota keluarga telah berhasil ditambahkan dan akan digunakan untuk rekomendasi notifikasi</p>';
      X.innerHTML='<div class="card mcard"><span class="ava" style="background-image:url(assets/'+x.a+'.png)"></span><div><b>'+esc(x.name)+'</b><p>'+(x.age?'Usia '+esc(x.age)+' &nbsp; ':'')+esc(x.cat)+'</p><p>'+esc(x.x||'Tanpa Kondisi Khusus')+'</p></div><em class="'+x.c+'">'+x.b+'</em></div>';
      B.innerHTML='<button class="btn pill mid soft" data-tabgo="profile">Lanjutkan</button>'; }
    reset('ok');
  }

  /* ---------- profil & keluarga ---------- */
  var fam=[{a:'a_anak',n:'Rizky (7 th)'},{a:'a_lansia',n:'Budi (65 th)'},{a:'a_rina',n:'Rina (20 th)',x:'Penyakit : ISPA'},{a:'a_hamil',n:'Aisya (5 bln)'}];
  function renderFam(){ $('#famList').innerHTML=fam.map(function(m,i){return '<div class="fam"><span class="ava" style="background-image:url(assets/'+m.a+'.png)"></span><b>'+esc(m.n)+'</b>'+(m.x?'<small>'+esc(m.x)+'</small>':'')+'<button data-rm="'+i+'" aria-label="Hapus">×</button></div>'}).join(''); }
  $('#famList').addEventListener('click',function(e){var b=e.target.closest('[data-rm]'); if(!b) return; fam.splice(+b.getAttribute('data-rm'),1); renderFam();});
  renderFam();
  var vt=$('#vulTog');
  vt.addEventListener('change',function(){toast(vt.checked?'Mode Kelompok Rentan aktif — ambang notifikasi diturunkan':'Mode Kelompok Rentan nonaktif');});

  $('#saveProfile').addEventListener('click',function(){
    var rows=[['Nama',$('#eName').value],['Username',$('#eUser').value],['Email',$('#eMail').value],['Password','•'.repeat(Math.min(12,$('#ePass').value.length))],['Lokasi',$('#eLoc').value]];
    $('#confList').innerHTML=rows.map(function(r){return '<dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd>'}).join('');
    $('#ovConfirm').classList.add('on');
  });
  $('#confYes').addEventListener('click',function(){
    var n=$('#eName').value.trim()||'Daffa'; $('#pName').textContent=n; $('#sName').textContent=n;
    $('#pMail').textContent=$('#eMail').value; $('#sMail').textContent=$('#eMail').value; $('#pLoc').textContent=$('#eLoc').value;
    ok('profil');
  });
  $$('#edit .in2 i').forEach(function(i){i.addEventListener('click',function(){var inp=$('input',i.parentNode); inp.value=''; inp.focus();})});
  $('#edit .eye').addEventListener('click',function(){var p=$('#ePass'); p.type=p.type==='password'?'text':'password';});

  var cat=null;
  $$('#cats label').forEach(function(l){l.addEventListener('click',function(){cat=l; $$('#cats label').forEach(function(x){x.classList.toggle('on',x===l)})})});
  $('#catNext').addEventListener('click',function(){ if(!cat) return toast('Pilih kategori terlebih dahulu');
    $('#mAva').style.backgroundImage='url(assets/'+cat.getAttribute('data-a')+'.png)';
    $('#mInfo').style.display=cat.getAttribute('data-s')==='1'?'flex':'none';
    $('#mName').value='';$('#mAge').value='';$('#mNote').value='';$('#mWho').textContent='anggota ini'; go('tambah2');});
  $('#mName').addEventListener('input',function(){$('#mWho').textContent=this.value.trim()||'anggota ini'});
  $('#saveMember').addEventListener('click',function(){ var n=$('#mName').value.trim(); if(!n) return toast('Isi nama anggota');
    var age=$('#mAge').value.trim(), short=age, long=age; if(age&&/^\d+$/.test(age)){short=age+' th'; long=age+' tahun';}
    var note=$('#mNote').value.trim(), a=cat.getAttribute('data-a');
    fam.push({a:a,n:n+(short?' ('+short+')':''),x:note}); renderFam();
    ok('anggota',{a:a,name:n,age:long,cat:cat.getAttribute('data-n'),x:note,c:cat.getAttribute('data-c'),b:cat.getAttribute('data-b')});});

  /* ---------- mulai ---------- */
  function valid(x){var el=x&&document.getElementById(x); return el&&el.classList.contains('screen')&&x!=='ok';}
  window.addEventListener('hashchange',function(){var x=location.hash.slice(1); if(valid(x)&&x!==stack[stack.length-1]) go(x);});
  var h=location.hash.slice(1); if(valid(h)){stack=[h]; show(h);} else show('splash');
})();
