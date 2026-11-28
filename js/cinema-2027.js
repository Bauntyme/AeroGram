(function () {
  'use strict';

  var TOTAL_DUR = 40.0;

  function detectAssetBase() {
    var p = (window.location && window.location.pathname) ? window.location.pathname : '/';
    if (p.indexOf('/desktop') !== -1 || p.indexOf('/tv') !== -1) return '../';
    return '';
  }

  function getLang() {
    try {
      var stored = localStorage.getItem('aero_lang_v1');
      if (stored === 'uz' || stored === 'ru' || stored === 'en') return stored;
    } catch (_) {}
    var htmlLang = (document.documentElement.lang || 'uz').toLowerCase().slice(0, 2);
    return (htmlLang === 'ru' || htmlLang === 'en') ? htmlLang : 'uz';
  }

  var COPY = {
    uz: {
      badge: 'AEROGRAM KEYNOTE · 2027',
      skip: 'O‘tkazib yuborish →',
      soundOn: 'Ovoz yoniq',
      soundOff: 'Ovoz o‘chiq',
      unlockHint: 'Ovozli taqdimotni yoqish uchun bosing',
      acts: [
        { start: 0, end: 8.0, kicker: 'I BOB · YANGI DAVR', title: '2027 Fazoviy Uyqudan Uyg‘onish', sub: 'Ikki ming yigirma yettinchi yilga xush kelibsiz... AeroGram uchun mutlaqo yangi davr boshlandi.' },
        { start: 8.0, end: 16.5, kicker: 'II BOB · EKOTIZIM', title: 'Android + Windows Birlashtirilgan Fazo', sub: 'Android va Windows ekotizimi endi yagona fazoda birlashdi. Telefoningiz va noutbukingiz lahzada sinxronlashadi.' },
        { start: 16.5, end: 25.0, kicker: 'III BOB · MAXFIY SEYF', title: 'Ko‘rinmas Qalqon va To‘liq Nazorat', sub: 'Yangilangan Maxfiy Seyf suhbatlaringizni ko‘rinmas qalqon ostida asraydi. Nazorat to‘liq sizning qo‘lingizda.' },
        { start: 25.0, end: 33.5, kicker: 'IV BOB · HAMJAMIYAT', title: '29+ Kanal va Jonli Liquid Motion', sub: 'Yigirma to‘qqizdan ortiq hamjamiyat va jonli dizayn bitta platformada jamlandi.' },
        { start: 33.5, end: 40.0, kicker: 'V BOB · AEROGRAM 2027', title: 'Chegarasiz Muloqot Olamiga Xush Kelibsiz', sub: 'Chegaralarsiz muloqotga tayyor bo‘ling... AeroGram ikki ming yigirma yetti, hozir boshlanadi.' }
      ]
    },
    ru: {
      badge: 'ПРЕЗЕНТАЦИЯ AEROGRAM · 2027',
      skip: 'Пропустить →',
      soundOn: 'Звук вкл',
      soundOff: 'Без звука',
      unlockHint: 'Нажмите, чтобы включить озвучку',
      acts: [
        { start: 0, end: 8.0, kicker: 'АКТ I · НОВАЯ ЭРА', title: 'Пробуждение AeroGram 2027', sub: 'Добро пожаловать в 2027 год... Для AeroGram начинается совершенно новая эпоха.' },
        { start: 8.0, end: 16.5, kicker: 'АКТ II · ЭКОСИСТЕМА', title: 'Единое пространство Android + Windows', sub: 'Экосистемы Android и Windows теперь объединены. Смартфон и ноутбук синхронизируются мгновенно.' },
        { start: 16.5, end: 25.0, kicker: 'АКТ III · ТАЙНЫЙ СЕЙФ', title: 'Невидимая защита и полный контроль', sub: 'Обновлённый Тайный Сейф хранит ваши самые важные чаты под невидимым щитом.' },
        { start: 25.0, end: 33.5, kicker: 'АКТ IV · ПЛАТФОРМА', title: '29+ сообществ и живой Liquid Motion', sub: 'Более двадцати девяти каналов, живая физика интерфейса и безграничные возможности в одной платформе.' },
        { start: 33.5, end: 40.0, kicker: 'АКТ V · AEROGRAM 2027', title: 'Общение без границ начинается сейчас', sub: 'Приготовьтесь к новому измерению связи. AeroGram 2027... начинается прямо сейчас.' }
      ]
    },
    en: {
      badge: 'AEROGRAM KEYNOTE · 2027',
      skip: 'Skip film →',
      soundOn: 'Audio On',
      soundOff: 'Muted',
      unlockHint: 'Tap anywhere to enable voice narration',
      acts: [
        { start: 0, end: 8.0, kicker: 'ACT I · THE AWAKENING', title: 'AeroGram 2027 Spatial Architecture', sub: 'Welcome to 2027... A completely new era for AeroGram begins right now.' },
        { start: 8.0, end: 16.5, kicker: 'ACT II · UNIFIED ENGINE', title: 'Android + Windows Native Synergy', sub: 'Android and Windows are now united in a single spatial core. Phone and laptop sync in an instant.' },
        { start: 16.5, end: 25.0, kicker: 'ACT III · STEALTH VAULT', title: 'Zero-Trace Crystal Security', sub: 'The upgraded Secret Vault shields your private conversations beneath an invisible fortress.' },
        { start: 25.0, end: 33.5, kicker: 'ACT IV · ECOSYSTEM', title: '29+ Channels & Living Liquid Motion', sub: 'Twenty-nine curated channels, precision UI physics, and limitless speed converge on one stage.' },
        { start: 33.5, end: 40.0, kicker: 'ACT V · AEROGRAM 2027', title: 'Welcome to Communication Without Limits', sub: 'Get ready for effortless connection. AeroGram 2027... starts now.' }
      ]
    }
  };

  function makeRoundedRectShape(w, h, r) {
    var shape = new THREE.Shape();
    var x = -w / 2;
    var y = -h / 2;
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
  }

  function makeScreenTexture(mode) {
    var c = document.createElement('canvas');
    c.width = 512;
    c.height = mode === 'phone' ? 960 : 512;
    var ctx = c.getContext('2d');
    var g = ctx.createLinearGradient(0, 0, c.width, c.height);
    g.addColorStop(0, '#09102b');
    g.addColorStop(1, '#040613');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);

    // Subtle glass header
    ctx.fillStyle = 'rgba(34, 211, 238, 0.14)';
    ctx.fillRect(28, 36, c.width - 56, 56);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('AeroGram 2027', 48, 74);

    var rows = mode === 'phone' ? 7 : 4;
    for (var i = 0; i < rows; i++) {
      var y = 128 + i * 102;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(99, 102, 241, 0.18)' : 'rgba(30, 41, 68, 0.48)';
      ctx.fillRect(28, y, c.width - 56, 78);
      ctx.fillStyle = i % 2 === 0 ? '#22d3ee' : '#8b5cf6';
      ctx.beginPath();
      ctx.arc(72, y + 39, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(241, 245, 249, 0.85)';
      ctx.fillRect(110, y + 22, 190, 12);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.fillRect(110, y + 46, 280, 9);
    }

    var tex = new THREE.CanvasTexture(c);
    if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }

  function createAudioBed() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      var ctx = new AC();
      var master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);

      // Deep warm cosmic sub pad + shimmer fifth
      var osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 65.41; // C2

      var osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = 196.0; // G3
      var g2 = ctx.createGain();
      g2.gain.value = 0.18;

      var filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 460;

      osc1.connect(filter);
      osc2.connect(g2);
      g2.connect(filter);
      filter.connect(master);

      osc1.start();
      osc2.start();

      return {
        ctx: ctx,
        master: master,
        filter: filter,
        setLevel: function (v) {
          var now = ctx.currentTime;
          master.gain.setTargetAtTime(Math.max(0.0001, v), now, 0.25);
        },
        swell: function (freqHz) {
          filter.frequency.setTargetAtTime(freqHz, ctx.currentTime, 0.4);
        },
        dispose: function () {
          try { osc1.stop(); osc2.stop(); ctx.close(); } catch (_) {}
        }
      };
    } catch (_) {
      return null;
    }
  }

  function buildOverlay(strings) {
    var existing = document.getElementById('aero-cinema-2027');
    if (existing) existing.remove();

    var root = document.createElement('div');
    root.id = 'aero-cinema-2027';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', strings.badge);
    root.innerHTML = [
      '<canvas id="cinema-webgl-stage"></canvas>',
      '<div class="cinema-vignette"></div>',
      '<div class="cinema-top-bar">',
        '<div class="cinema-brand-pill">',
          '<span class="cinema-prism-dot" aria-hidden="true"></span>',
          '<span class="cinema-brand-label">' + strings.badge + '</span>',
          '<span class="cinema-timecode" id="cinema-tc">00:00 / 00:40</span>',
        '</div>',
        '<div class="cinema-controls">',
          '<button type="button" class="cinema-btn" id="cinema-mute-btn">',
            '<span class="cinema-eq is-playing" id="cinema-eq"><i></i><i></i><i></i></span>',
            '<span id="cinema-mute-label">' + strings.soundOn + '</span>',
          '</button>',
          '<button type="button" class="cinema-btn cinema-btn-primary" id="cinema-skip-btn">' + strings.skip + '</button>',
        '</div>',
      '</div>',
      '<div class="cinema-bottom-hud">',
        '<button type="button" class="cinema-audio-prompt" id="cinema-audio-unlock">' + strings.unlockHint + '</button>',
        '<div class="cinema-sub-card">',
          '<div class="cinema-act-kicker" id="cinema-kicker">' + strings.acts[0].kicker + '</div>',
          '<h2 class="cinema-act-title" id="cinema-title">' + strings.acts[0].title + '</h2>',
          '<p class="cinema-subtitle" id="cinema-sub">' + strings.acts[0].sub + '</p>',
        '</div>',
        '<div class="cinema-timeline" aria-hidden="true">',
          '<div class="cinema-seg"><span class="cinema-seg-fill" data-seg="0"></span></div>',
          '<div class="cinema-seg"><span class="cinema-seg-fill" data-seg="1"></span></div>',
          '<div class="cinema-seg"><span class="cinema-seg-fill" data-seg="2"></span></div>',
          '<div class="cinema-seg"><span class="cinema-seg-fill" data-seg="3"></span></div>',
          '<div class="cinema-seg"><span class="cinema-seg-fill" data-seg="4"></span></div>',
        '</div>',
      '</div>'
    ].join('');

    document.body.appendChild(root);
    return root;
  }

  function createWebGLDirector(canvas) {
    if (typeof window.THREE === 'undefined') return null;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance', alpha: false });
    } catch (_) {
      return null;
    }

    var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color('#030510');
    scene.fog = new THREE.FogExp2('#040718', 0.032);

    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / Math.max(1, window.innerHeight), 0.1, 160);
    camera.position.set(0, 0.35, 16);

    // Lights
    scene.add(new THREE.AmbientLight('#818cf8', 0.55));
    var keyLight = new THREE.DirectionalLight('#ffffff', 1.45);
    keyLight.position.set(6, 9, 10);
    scene.add(keyLight);

    var cyanLight = new THREE.PointLight('#22d3ee', 3.4, 34);
    cyanLight.position.set(-5.5, 2.5, 6);
    scene.add(cyanLight);

    var violetLight = new THREE.PointLight('#8b5cf6', 3.2, 34);
    violetLight.position.set(5.5, -2.0, 5);
    scene.add(violetLight);

    var disposables = [];
    function trackGeo(g) { disposables.push(g); return g; }
    function trackMat(m) { disposables.push(m); return m; }

    // 1. Deep Cosmic Starfield (1400 points)
    var starCount = 1400;
    var starPos = new Float32Array(starCount * 3);
    var starCol = new Float32Array(starCount * 3);
    var cCyan = new THREE.Color('#22d3ee');
    var cIndigo = new THREE.Color('#6366f1');
    var cViolet = new THREE.Color('#c4b5fd');
    for (var s = 0; s < starCount; s++) {
      var r = 7 + Math.random() * 44;
      var th = Math.random() * Math.PI * 2;
      starPos[s * 3] = Math.cos(th) * r;
      starPos[s * 3 + 1] = Math.sin(th) * r;
      starPos[s * 3 + 2] = (Math.random() - 0.5) * 90;
      var pick = s % 3 === 0 ? cCyan : (s % 3 === 1 ? cIndigo : cViolet);
      starCol[s * 3] = pick.r;
      starCol[s * 3 + 1] = pick.g;
      starCol[s * 3 + 2] = pick.b;
    }
    var starGeo = trackGeo(new THREE.BufferGeometry());
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    var starMat = trackMat(new THREE.PointsMaterial({ size: 0.14, vertexColors: true, transparent: true, opacity: 0.88 }));
    var stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 2. Act I + V: Tunnel Portal Rings & Faceted Prism Core
    var tunnelGroup = new THREE.Group();
    scene.add(tunnelGroup);
    var portalRings = [];
    var ringGeo = trackGeo(new THREE.TorusGeometry(4.2, 0.025, 10, 80));
    for (var ri = 0; ri < 16; ri++) {
      var ringMat = trackMat(new THREE.MeshBasicMaterial({
        color: ri % 2 === 0 ? '#22d3ee' : '#8b5cf6',
        transparent: true,
        opacity: 0.36
      }));
      var rm = new THREE.Mesh(ringGeo, ringMat);
      rm.position.z = 12 - ri * 2.8;
      tunnelGroup.add(rm);
      portalRings.push(rm);
    }

    var prismGroup = new THREE.Group();
    scene.add(prismGroup);
    var coreGeo = trackGeo(new THREE.OctahedronGeometry(1.45, 0));
    var coreMat = trackMat(new THREE.MeshPhysicalMaterial({
      color: '#67e8f9',
      emissive: '#312e81',
      emissiveIntensity: 0.72,
      roughness: 0.14,
      metalness: 0.25,
      transparent: true,
      opacity: 0.92
    }));
    var coreMesh = new THREE.Mesh(coreGeo, coreMat);
    var cageGeo = trackGeo(new THREE.IcosahedronGeometry(2.05, 0));
    var cageMat = trackMat(new THREE.MeshBasicMaterial({ color: '#a5b4fc', wireframe: true, transparent: true, opacity: 0.42 }));
    var cageMesh = new THREE.Mesh(cageGeo, cageMat);
    prismGroup.add(coreMesh);
    prismGroup.add(cageMesh);

    // 3. Act II: 3D Smartphone + 3D Ultrabook + Sync Data Arc
    var devicesGroup = new THREE.Group();
    devicesGroup.visible = false;
    scene.add(devicesGroup);

    var phoneBodyGeo = trackGeo(new THREE.ExtrudeGeometry(makeRoundedRectShape(1.55, 3.05, 0.22), {
      depth: 0.14, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3
    }));
    phoneBodyGeo.center();
    var titaniumMat = trackMat(new THREE.MeshStandardMaterial({ color: '#14192b', roughness: 0.32, metalness: 0.84 }));
    var phoneGroup = new THREE.Group();
    phoneGroup.add(new THREE.Mesh(phoneBodyGeo, titaniumMat));
    var phoneTex = trackMat(makeScreenTexture('phone'));
    var phoneScr = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(1.38, 2.84)),
      trackMat(new THREE.MeshBasicMaterial({ map: phoneTex }))
    );
    phoneScr.position.z = 0.105;
    phoneGroup.add(phoneScr);
    phoneGroup.position.set(-2.65, 0.05, 0.8);
    devicesGroup.add(phoneGroup);

    var laptopGroup = new THREE.Group();
    var laptopBase = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(3.4, 0.11, 2.25)),
      titaniumMat
    );
    laptopBase.position.set(0, -1.0, 0.65);
    laptopGroup.add(laptopBase);

    var laptopLid = new THREE.Group();
    laptopLid.position.set(0, -0.94, -0.44);
    laptopLid.rotation.x = -0.24;
    var lidBack = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.4, 2.15, 0.09)), titaniumMat);
    lidBack.position.set(0, 1.08, 0);
    laptopLid.add(lidBack);

    var deskTex = trackMat(makeScreenTexture('desktop'));
    var lidScr = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(3.16, 1.92)),
      trackMat(new THREE.MeshBasicMaterial({ map: deskTex }))
    );
    lidScr.position.set(0, 1.08, 0.052);
    laptopLid.add(lidScr);
    laptopGroup.add(laptopLid);
    laptopGroup.position.set(2.35, 0.05, -0.2);
    devicesGroup.add(laptopGroup);

    var syncCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.95, 0.4, 0.9),
      new THREE.Vector3(-0.3, 1.85, 1.6),
      new THREE.Vector3(1.1, 0.45, 0.4)
    ]);
    var syncTube = new THREE.Mesh(
      trackGeo(new THREE.TubeGeometry(syncCurve, 48, 0.03, 8, false)),
      trackMat(new THREE.MeshBasicMaterial({ color: '#22d3ee', transparent: true, opacity: 0.72 }))
    );
    devicesGroup.add(syncTube);

    var syncPhotons = [];
    var photonGeo = trackGeo(new THREE.SphereGeometry(0.11, 14, 14));
    var photonMat = trackMat(new THREE.MeshBasicMaterial({ color: '#a5f3fc' }));
    for (var pi = 0; pi < 5; pi++) {
      var ph = new THREE.Mesh(photonGeo, photonMat);
      devicesGroup.add(ph);
      syncPhotons.push(ph);
    }

    // 4. Act III: Vault Triple Gimbal Assembly
    var vaultGroup = new THREE.Group();
    vaultGroup.visible = false;
    scene.add(vaultGroup);

    var gimbalMat1 = trackMat(new THREE.MeshStandardMaterial({ color: '#22d3ee', emissive: '#0891b2', emissiveIntensity: 0.45, metalness: 0.88, roughness: 0.2 }));
    var gimbalMat2 = trackMat(new THREE.MeshStandardMaterial({ color: '#8b5cf6', emissive: '#5b21b6', emissiveIntensity: 0.45, metalness: 0.88, roughness: 0.2 }));
    var gRingA = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(2.65, 0.06, 16, 90)), gimbalMat1);
    var gRingB = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(2.25, 0.055, 16, 84)), gimbalMat2);
    var gRingC = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.85, 0.05, 16, 76)), gimbalMat1);
    var vaultGem = new THREE.Mesh(
      trackGeo(new THREE.IcosahedronGeometry(1.05, 0)),
      trackMat(new THREE.MeshPhysicalMaterial({ color: '#38bdf8', emissive: '#4338ca', emissiveIntensity: 0.85, roughness: 0.1, metalness: 0.3 }))
    );
    vaultGroup.add(gRingA, gRingB, gRingC, vaultGem);

    // 5. Act IV: 29 Channel Monolith Orbit
    var orbitGroup = new THREE.Group();
    orbitGroup.visible = false;
    scene.add(orbitGroup);

    var monoliths = [];
    var cardGeo = trackGeo(new THREE.BoxGeometry(0.86, 1.24, 0.08));
    for (var mi = 0; mi < 29; mi++) {
      var mMat = trackMat(new THREE.MeshStandardMaterial({
        color: mi % 3 === 0 ? '#0ea5e9' : (mi % 3 === 1 ? '#6366f1' : '#8b5cf6'),
        emissive: mi % 2 === 0 ? '#164e63' : '#312e81',
        emissiveIntensity: 0.52,
        roughness: 0.22,
        metalness: 0.72
      }));
      var card = new THREE.Mesh(cardGeo, mMat);
      var angle = (mi / 29) * Math.PI * 4;
      var rad = 4.6 + (mi % 3) * 0.75;
      var yy = ((mi / 28) - 0.5) * 4.4;
      card.position.set(Math.cos(angle) * rad, yy, Math.sin(angle) * rad);
      card.lookAt(0, yy * 0.35, 0);
      orbitGroup.add(card);
      monoliths.push(card);
    }

    var parallax = { x: 0, y: 0, tx: 0, ty: 0 };
    function onPointer(e) {
      var pt = e.touches && e.touches[0] ? e.touches[0] : e;
      if (!pt) return;
      parallax.tx = ((pt.clientX / Math.max(1, window.innerWidth)) - 0.5) * 1.1;
      parallax.ty = ((pt.clientY / Math.max(1, window.innerHeight)) - 0.5) * -0.7;
    }
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('touchmove', onPointer, { passive: true });

    function onResize() {
      var w = window.innerWidth;
      var h = Math.max(1, window.innerHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    window.addEventListener('resize', onResize);

    return {
      update: function (t) {
        parallax.x += (parallax.tx - parallax.x) * 0.06;
        parallax.y += (parallax.ty - parallax.y) * 0.06;

        stars.rotation.z = t * 0.035;
        stars.position.z = ((t * 2.2) % 30) - 10;

        cyanLight.position.x = Math.cos(t * 0.7) * 6.0;
        violetLight.position.x = Math.sin(t * 0.55) * 6.0;

        // Act visibility choreography across 40 seconds
        var isAct1 = t < 8.6;
        var isAct2 = t >= 7.6 && t < 17.2;
        var isAct3 = t >= 16.0 && t < 25.8;
        var isAct4 = t >= 24.4 && t < 34.4;
        var isAct5 = t >= 33.0;

        tunnelGroup.visible = isAct1 || isAct5;
        prismGroup.visible = isAct1 || isAct4 || isAct5;
        devicesGroup.visible = isAct2;
        vaultGroup.visible = isAct3;
        orbitGroup.visible = isAct4;

        if (tunnelGroup.visible) {
          for (var i = 0; i < portalRings.length; i++) {
            var rMesh = portalRings[i];
            rMesh.position.z += isAct5 ? 0.16 : 0.11;
            if (rMesh.position.z > 14) rMesh.position.z = -30;
            rMesh.rotation.z = t * (i % 2 === 0 ? 0.25 : -0.18);
          }
        }

        if (prismGroup.visible) {
          coreMesh.rotation.y = t * 0.85;
          coreMesh.rotation.x = Math.sin(t * 0.5) * 0.35;
          cageMesh.rotation.y = -t * 0.45;
          cageMesh.rotation.z = t * 0.3;
          var pScale = isAct5 ? 1.0 + Math.max(0, t - 33.5) * 0.16 : (isAct4 ? 0.68 : 1.0);
          prismGroup.scale.setScalar(pScale);
        }

        if (devicesGroup.visible) {
          var p2 = Math.min(1, Math.max(0, (t - 8.0) / 2.2));
          devicesGroup.scale.setScalar(0.55 + p2 * 0.45);
          phoneGroup.rotation.y = 0.28 + Math.sin(t * 0.9) * 0.14;
          phoneGroup.position.y = Math.sin(t * 1.4) * 0.16;
          laptopGroup.rotation.y = -0.34 + Math.cos(t * 0.75) * 0.1;
          laptopGroup.position.y = Math.cos(t * 1.2) * 0.14;
          for (var j = 0; j < syncPhotons.length; j++) {
            var u = (t * 0.65 + j * 0.2) % 1;
            syncPhotons[j].position.copy(syncCurve.getPointAt(u));
          }
        }

        if (vaultGroup.visible) {
          var p3 = Math.min(1, Math.max(0, (t - 16.5) / 1.8));
          vaultGroup.scale.setScalar(0.45 + p3 * 0.55);
          gRingA.rotation.set(t * 0.8, t * 0.4, 0);
          gRingB.rotation.set(-t * 0.55, t * 0.95, 0.6);
          gRingC.rotation.set(t * 0.4, -t * 1.1, t * 0.5);
          vaultGem.rotation.y = t * 1.25;
          vaultGem.rotation.x = Math.sin(t * 0.9) * 0.4;
        }

        if (orbitGroup.visible) {
          orbitGroup.rotation.y = (t - 25.0) * 0.48;
          for (var m = 0; m < monoliths.length; m++) {
            monoliths[m].position.y += Math.sin(t * 1.8 + m) * 0.0025;
          }
        }

        // Smooth camera arc across all 5 acts
        var cz = 12.2;
        var cx = 0;
        var cy = 0.25;
        if (t < 8.0) {
          cz = 14.5 - (t / 8.0) * 5.2;
        } else if (t < 16.5) {
          cx = Math.sin((t - 8.0) * 0.35) * 0.8;
          cz = 9.2;
        } else if (t < 25.0) {
          cz = 8.4 - Math.sin(((t - 16.5) / 8.5) * Math.PI) * 1.2;
        } else if (t < 33.5) {
          cz = 10.6;
          cy = 0.8 - ((t - 25.0) / 8.5) * 0.9;
        } else {
          cz = 9.8 - ((t - 33.5) / 6.5) * 6.4; // Dramatic portal fly-in
        }

        camera.position.set(cx + parallax.x * 0.85, cy + parallax.y * 0.65, cz);
        camera.lookAt(parallax.x * 0.2, parallax.y * 0.15, 0);
        renderer.render(scene, camera);
      },
      dispose: function () {
        window.removeEventListener('pointermove', onPointer);
        window.removeEventListener('touchmove', onPointer);
        window.removeEventListener('resize', onResize);
        for (var i = 0; i < disposables.length; i++) {
          if (disposables[i] && typeof disposables[i].dispose === 'function') {
            try { disposables[i].dispose(); } catch (_) {}
          }
        }
        try {
          renderer.dispose();
          if (renderer.forceContextLoss) renderer.forceContextLoss();
        } catch (_) {}
      }
    };
  }

  function createFallback2DDirector(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return { update: function () {}, dispose: function () {} };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    return {
      update: function (t) {
        var w = canvas.width;
        var h = canvas.height;
        var cx = w / 2;
        var cy = h / 2;
        ctx.fillStyle = '#030510';
        ctx.fillRect(0, 0, w, h);
        for (var i = 0; i < 16; i++) {
          var rad = (((t * 55 + i * 28) % 380) + 18) * (Math.min(w, h) / 720);
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(34,211,238,0.28)' : 'rgba(139,92,246,0.24)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();
        }
      },
      dispose: function () {
        window.removeEventListener('resize', resize);
      }
    };
  }

  var activeController = null;

  function playCinema(opts) {
    opts = opts || {};
    if (activeController) return activeController;

    var lang = getLang();
    var strings = COPY[lang] || COPY.uz;
    var root = buildOverlay(strings);
    var canvas = document.getElementById('cinema-webgl-stage');
    var tcEl = document.getElementById('cinema-tc');
    var kickerEl = document.getElementById('cinema-kicker');
    var titleEl = document.getElementById('cinema-title');
    var subEl = document.getElementById('cinema-sub');
    var segFills = root.querySelectorAll('.cinema-seg-fill');
    var muteBtn = document.getElementById('cinema-mute-btn');
    var muteLabel = document.getElementById('cinema-mute-label');
    var eqEl = document.getElementById('cinema-eq');
    var skipBtn = document.getElementById('cinema-skip-btn');
    var unlockBtn = document.getElementById('cinema-audio-unlock');

    var base = detectAssetBase();
    var voiceAudio = new Audio(base + 'assets/audio/aerogram-2027-uz.mp3');
    voiceAudio.preload = 'auto';
    voiceAudio.volume = 0.96;

    var audioBed = createAudioBed();
    var isMuted = false;
    var voiceStarted = false;
    var beforeRevealFired = false;
    var exiting = false;
    var finished = false;
    var lastActIdx = -1;
    var rafId = 0;
    var director = createWebGLDirector(canvas) || createFallback2DDirector(canvas);

    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(function () {
      root.classList.add('is-active');
    });

    var startWallMs = performance.now();
    var pauseWallOffsetMs = 0;

    function currentElapsed() {
      return Math.min(TOTAL_DUR, (performance.now() - startWallMs - pauseWallOffsetMs) / 1000);
    }

    function tryStartAudio(atSec) {
      if (isMuted) return;
      if (audioBed && audioBed.ctx.state === 'suspended') {
        audioBed.ctx.resume().catch(function () {});
      }
      if (audioBed) audioBed.setLevel(0.11);

      if (!voiceStarted && atSec < 37.5) {
        try {
          if (Math.abs(voiceAudio.currentTime - Math.max(0, atSec - 0.5)) > 0.8) {
            voiceAudio.currentTime = Math.max(0, atSec - 0.5);
          }
          var p = voiceAudio.play();
          if (p && typeof p.then === 'function') {
            p.then(function () {
              voiceStarted = true;
              unlockBtn.classList.remove('is-visible');
            }).catch(function () {
              unlockBtn.classList.add('is-visible');
            });
          } else {
            voiceStarted = true;
          }
        } catch (_) {
          unlockBtn.classList.add('is-visible');
        }
      }
    }

    function applyMuteUI() {
      if (isMuted) {
        eqEl.classList.remove('is-playing');
        eqEl.classList.add('is-muted');
        muteLabel.textContent = strings.soundOff;
        voiceAudio.muted = true;
        if (audioBed) audioBed.setLevel(0.0001);
      } else {
        eqEl.classList.add('is-playing');
        eqEl.classList.remove('is-muted');
        muteLabel.textContent = strings.soundOn;
        voiceAudio.muted = false;
        tryStartAudio(currentElapsed());
      }
    }

    muteBtn.addEventListener('click', function () {
      isMuted = !isMuted;
      applyMuteUI();
    });

    function onUnlockClick() {
      isMuted = false;
      voiceStarted = false;
      applyMuteUI();
      unlockBtn.classList.remove('is-visible');
    }
    unlockBtn.addEventListener('click', onUnlockClick);
    root.addEventListener('pointerdown', function (e) {
      if (e.target === canvas || e.target.classList.contains('cinema-vignette')) {
        if (unlockBtn.classList.contains('is-visible')) onUnlockClick();
      }
    });

    function triggerRevealPrep() {
      if (beforeRevealFired) return;
      beforeRevealFired = true;
      if (typeof opts.onBeforeReveal === 'function') {
        try { opts.onBeforeReveal(); } catch (_) {}
      }
    }

    function finishCinema(wasSkipped) {
      if (finished) return;
      finished = true;
      triggerRevealPrep();
      root.classList.add('is-exiting');
      if (audioBed) audioBed.setLevel(0.0001);
      try { voiceAudio.pause(); } catch (_) {}

      document.body.style.overflow = prevOverflow;
      document.body.classList.add('era-2027-entering');

      window.setTimeout(function () {
        cancelAnimationFrame(rafId);
        director.dispose();
        if (audioBed) audioBed.dispose();
        root.remove();
        document.removeEventListener('keydown', onKeyDown);
        activeController = null;
        if (typeof opts.onComplete === 'function') {
          try { opts.onComplete(wasSkipped); } catch (_) {}
        }
      }, wasSkipped ? 750 : 1380);

      window.setTimeout(function () {
        document.body.classList.remove('era-2027-entering');
      }, 2800);
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') finishCinema(true);
    }
    document.addEventListener('keydown', onKeyDown);
    skipBtn.addEventListener('click', function () {
      finishCinema(true);
    });

    // Attempt initial playback immediately (works cleanly on button-click replay & relaxed contexts)
    tryStartAudio(0);

    function tick() {
      if (finished) return;
      var t = currentElapsed();

      // Update WebGL 3D scene
      director.update(t);

      // Update timecode
      var secInt = Math.min(40, Math.floor(t));
      var ss = secInt < 10 ? '0' + secInt : '' + secInt;
      tcEl.textContent = '00:' + ss + ' / 00:40';

      // Start ElevenLabs narration right at 0.45s
      if (t >= 0.45 && !voiceStarted && !isMuted && !unlockBtn.classList.contains('is-visible')) {
        tryStartAudio(t);
      }

      // Sync ambient filter sweep per act
      if (audioBed && !isMuted) {
        if (t > 33.5) audioBed.swell(880);
        else if (t > 16.5) audioBed.swell(560);
      }

      // Update act titles, subtitles, and 5-segment progress bar
      for (var i = 0; i < strings.acts.length; i++) {
        var act = strings.acts[i];
        var segPct = Math.max(0, Math.min(1, (t - act.start) / (act.end - act.start)));
        if (segFills[i]) segFills[i].style.width = (segPct * 100).toFixed(1) + '%';
        if (t >= act.start && (t < act.end || i === strings.acts.length - 1)) {
          if (lastActIdx !== i) {
            lastActIdx = i;
            kickerEl.textContent = act.kicker;
            titleEl.textContent = act.title;
            subEl.textContent = act.sub;
          }
        }
      }

      // Seamlessly upgrade DOM underneath veil at 37.6s
      if (t >= 37.6 && !beforeRevealFired) {
        triggerRevealPrep();
      }

      // Begin 1.35s exit dissolve cleanly at 38.65s
      if (t >= 38.65 && !exiting) {
        exiting = true;
        finishCinema(false);
        return;
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    activeController = {
      skip: function () { finishCinema(true); },
      isPlaying: function () { return !finished; }
    };
    return activeController;
  }

  window.AeroCinema2027 = {
    play: playCinema,
    isPlaying: function () { return !!activeController; }
  };
})();
