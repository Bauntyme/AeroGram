(function () {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isMobile = window.innerWidth < 768;

  // 1. Holiday / Atmosphere FX Preference
  let fxEnabled = localStorage.getItem("aero_ny_fx") !== "off";
  root.setAttribute("data-ny-fx", fxEnabled ? "on" : "off");

  function syncFxButtons() {
    document.querySelectorAll(".ny-fx-toggle").forEach((btn) => {
      btn.setAttribute("aria-pressed", fxEnabled ? "true" : "false");
    });
  }

  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".ny-fx-toggle");
    if (!toggle) return;
    fxEnabled = !fxEnabled;
    localStorage.setItem("aero_ny_fx", fxEnabled ? "on" : "off");
    root.setAttribute("data-ny-fx", fxEnabled ? "on" : "off");
    syncFxButtons();
    if (fxEnabled && !reducedMotion) startSnowLoop();
  });
  syncFxButtons();

  // 2. Santa Cap (Pre-00:00) -> Faceted Cosmic Prism 2027 Emblem (Post-00:00)
  const SANTA_SVG = `<svg class="aero-santa-cap" viewBox="0 0 64 52" fill="none" aria-hidden="true">
    <path d="M12 36C13 17 26 5 46 8C53 9 58 14 57 20C52 17 44 17 38 22C34 26 37 32 41 36H12Z" fill="#DC2626"/>
    <path d="M12 36C16 24 27 14 41 11C34 15 26 24 23 36H12Z" fill="#EF4444"/>
    <rect x="7" y="34" width="38" height="10" rx="5" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
    <circle cx="56" cy="20" r="6" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
  </svg>`;

  const PRISM_2027_SVG = `<svg class="aero-prism-2027" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M24 4L40 20L24 44L8 20L24 4Z" fill="url(#prismCore)" stroke="#E0F2FE" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M24 4L40 20H24V4Z" fill="#22D3EE" fill-opacity="0.45"/>
    <path d="M24 20H40L24 44V20Z" fill="#8B5CF6" fill-opacity="0.5"/>
    <defs><linearGradient id="prismCore" x1="8" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse"><stop stop-color="#22D3EE"/><stop offset="0.55" stop-color="#6366F1"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs>
  </svg>`;

  document.querySelectorAll(".brand-logo, .tv-brand-logo").forEach((el) => {
    if (!el.querySelector(".aero-santa-cap")) el.insertAdjacentHTML("beforeend", SANTA_SVG);
    if (!el.querySelector(".aero-prism-2027")) el.insertAdjacentHTML("beforeend", PRISM_2027_SVG);
  });

  // 3. Reading Progress Bar
  let scrollBar = document.getElementById("aero-scroll-bar");
  if (!scrollBar) {
    scrollBar = document.createElement("div");
    scrollBar.id = "aero-scroll-bar";
    scrollBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(scrollBar);
  }
  function updateScrollBar() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollBar.style.transform = `scaleX(${Math.min(1, Math.max(0, window.scrollY / maxScroll)).toFixed(4)})`;
  }
  window.addEventListener("scroll", updateScrollBar, { passive: true });
  window.addEventListener("resize", updateScrollBar, { passive: true });
  updateScrollBar();

  // 4. Sprite-Cached Snowfall -> Rising 2027 Cosmic Prism Stardust & Bursts (Pauses on TV video play)
  let snowCanvas = document.getElementById("aero-snow-canvas");
  if (!snowCanvas) {
    snowCanvas = document.createElement("canvas");
    snowCanvas.id = "aero-snow-canvas";
    snowCanvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(snowCanvas);
  }

  const sCtx = snowCanvas.getContext("2d");
  const tvVideo = document.getElementById("tv-video");
  let sWidth = 0;
  let sHeight = 0;
  let flakes = [];
  let snowRaf = 0;
  let lastSnowDraw = 0;
  let sprites = [];
  let eraSprites = [];
  let burstParticles = [];
  let tickTime = 0;

  function makeSprite(kind, isLight) {
    const c = document.createElement("canvas");
    c.width = 24;
    c.height = 24;
    const g = c.getContext("2d");
    const col =
      kind === "cyan" ? (isLight ? "14, 165, 233" : "34, 211, 238")
      : kind === "violet" ? (isLight ? "109, 40, 217" : "139, 92, 246")
      : kind === "indigo" ? "99, 102, 241"
      : isLight ? "56, 189, 248" : "224, 242, 254";

    if (kind === "dot") {
      g.fillStyle = `rgba(${col}, 0.65)`;
      g.beginPath();
      g.arc(12, 12, 2.1, 0, Math.PI * 2);
      g.fill();
    } else if (kind === "flake") {
      g.strokeStyle = `rgba(${col}, 0.72)`;
      g.lineWidth = 1.25;
      g.lineCap = "round";
      g.translate(12, 12);
      for (let i = 0; i < 3; i++) {
        const a = (i * Math.PI) / 3;
        g.beginPath();
        g.moveTo(-Math.cos(a) * 5.2, -Math.sin(a) * 5.2);
        g.lineTo(Math.cos(a) * 5.2, Math.sin(a) * 5.2);
        g.stroke();
      }
    } else {
      const grad = g.createRadialGradient(12, 12, 0, 12, 12, 9);
      grad.addColorStop(0, `rgba(${col}, 0.68)`);
      grad.addColorStop(1, `rgba(${col}, 0)`);
      g.fillStyle = grad;
      g.beginPath();
      g.arc(12, 12, 9, 0, Math.PI * 2);
      g.fill();
    }
    return c;
  }

  function rebuildSprites() {
    const isLight = root.getAttribute("data-theme") === "light";
    sprites = [makeSprite("dot", isLight), makeSprite("flake", isLight), makeSprite("cyan", isLight)];
    eraSprites = [makeSprite("cyan", isLight), makeSprite("violet", isLight), makeSprite("indigo", isLight)];
  }

  function spawnFlake(randomY) {
    const r = Math.random();
    const sIdx = r < 0.52 ? 0 : r < 0.84 ? 1 : 2;
    return {
      sIdx,
      x: Math.random() * (sWidth || window.innerWidth),
      y: randomY ? Math.random() * (sHeight || window.innerHeight) : -24,
      vy: sIdx === 0 ? 0.45 + Math.random() * 0.4 : sIdx === 1 ? 0.7 + Math.random() * 0.5 : 0.95 + Math.random() * 0.5,
      vx: (Math.random() - 0.35) * 0.24,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function isTvVideoPlaying() {
    if (!tvVideo) return false;
    const playing = !tvVideo.paused && !tvVideo.ended;
    document.body.classList.toggle("is-tv-playing", playing);
    return playing;
  }

  if (tvVideo) {
    tvVideo.addEventListener("playing", () => {
      document.body.classList.add("is-tv-playing");
      if (snowRaf) { cancelAnimationFrame(snowRaf); snowRaf = 0; }
      sCtx?.clearRect(0, 0, sWidth, sHeight);
    });
    tvVideo.addEventListener("pause", () => {
      document.body.classList.remove("is-tv-playing");
      startSnowLoop();
    });
  }

  function resizeSnow() {
    sWidth = window.innerWidth;
    sHeight = window.innerHeight;
    snowCanvas.width = sWidth;
    snowCanvas.height = sHeight;
    const count = sWidth < 768 ? 14 : 26;
    flakes = Array.from({ length: count }, () => spawnFlake(true));
    rebuildSprites();
  }

  function renderSnowFrame(now) {
    snowRaf = 0;
    if (!fxEnabled || reducedMotion || document.hidden || !sCtx || isTvVideoPlaying()) return;

    const minFrameMs = sWidth < 768 ? 33 : 16;
    if (now - lastSnowDraw < minFrameMs) {
      snowRaf = requestAnimationFrame(renderSnowFrame);
      return;
    }
    lastSnowDraw = now;
    tickTime += 0.02;

    const is2027 = root.getAttribute("data-era") === "2027-live";
    const activeSet = is2027 ? eraSprites : sprites;

    sCtx.clearRect(0, 0, sWidth, sHeight);
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      const wind = Math.sin(tickTime + f.phase) * 0.25;
      f.x += f.vx + wind;
      f.y += is2027 ? -f.vy * 0.85 : f.vy;

      if (is2027 && f.y < -24) {
        flakes[i] = spawnFlake(false);
        flakes[i].y = sHeight + 20;
        continue;
      } else if (!is2027 && f.y > sHeight + 24) {
        flakes[i] = spawnFlake(false);
        continue;
      }
      if (f.x > sWidth + 24) f.x = -20;
      else if (f.x < -24) f.x = sWidth + 20;
      sCtx.drawImage(activeSet[f.sIdx], (f.x - 12) | 0, (f.y - 12) | 0);
    }

    if (burstParticles.length > 0) {
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i];
        p.vy += 0.07;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.015;
        if (p.life <= 0) {
          burstParticles.splice(i, 1);
        } else {
          sCtx.globalAlpha = Math.max(0, p.life);
          sCtx.drawImage(eraSprites[p.sIdx], (p.x - 12) | 0, (p.y - 12) | 0);
          sCtx.globalAlpha = 1;
        }
      }
    }

    snowRaf = requestAnimationFrame(renderSnowFrame);
  }

  function startSnowLoop() {
    if (!snowRaf && fxEnabled && !reducedMotion && !document.hidden && !isTvVideoPlaying()) {
      snowRaf = requestAnimationFrame(renderSnowFrame);
    }
  }

  function trigger2027Fireworks() {
    if (reducedMotion || isTvVideoPlaying()) return;
    const spots = [
      [sWidth * 0.28, sHeight * 0.28, 0],
      [sWidth * 0.72, sHeight * 0.24, 340],
      [sWidth * 0.50, sHeight * 0.34, 720],
    ];
    spots.forEach(([cx, cy, delay], sIdx) => {
      setTimeout(() => {
        const perBurst = isMobile ? 16 : 24;
        for (let i = 0; i < perBurst; i++) {
          const angle = (i / perBurst) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
          const spd = 2.0 + Math.random() * 4.4;
          burstParticles.push({
            sIdx: (i + sIdx) % 3,
            x: cx,
            y: cy,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd - 1.8,
            life: 1,
          });
        }
        startSnowLoop();
      }, delay);
    });
  }

  new MutationObserver(() => rebuildSprites()).observe(root, { attributes: true, attributeFilter: ["data-theme", "data-era"] });
  window.addEventListener("resize", resizeSnow, { passive: true });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) startSnowLoop(); });
  resizeSnow();
  startSnowLoop();

  // 5. Event-Driven Cosmic Catenary Bulbs (0% idle CPU)
  const BULB_COLORS = ["#22D3EE", "#6366F1", "#8B5CF6", "#38BDF8", "#A5B4FC"];
  const bulbSprings = [];
  let bulbRaf = 0;
  let bulbWakeUntil = 0;

  function wakeBulbs(ms) {
    if (reducedMotion) return;
    bulbWakeUntil = Math.max(bulbWakeUntil, performance.now() + ms);
    if (!bulbRaf) bulbRaf = requestAnimationFrame(tickBulbs);
  }
  function tickBulbs(now) {
    bulbRaf = 0;
    if (!fxEnabled || document.hidden || now > bulbWakeUntil) return;
    for (let i = 0; i < bulbSprings.length; i++) {
      const b = bulbSprings[i];
      b.vel = (b.vel - 0.08 * b.angle) * 0.9;
      b.angle += b.vel;
      b.el.style.transform = `rotate(${b.angle.toFixed(2)}deg)`;
    }
    bulbRaf = requestAnimationFrame(tickBulbs);
  }

  document.querySelectorAll(".ny-garland-slot").forEach((slot) => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 1200 64");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.classList.add("ny-garland-svg");
    const count = 15;
    const step = 1200 / (count + 1);
    let pathD = "M 0 6 ";
    const anchors = [];
    for (let i = 1; i <= count; i++) {
      const x = i * step;
      const sag = 10 + Math.sin((i / (count + 1)) * Math.PI) * 12;
      pathD += `Q ${((i - 1) * step + x) / 2} ${sag + 5} ${x} ${sag} `;
      anchors.push({ x, y: sag });
    }
    pathD += "Q 1166 16 1200 6";
    const wire = document.createElementNS(svgNS, "path");
    wire.setAttribute("d", pathD);
    wire.classList.add("ny-wire");
    svg.appendChild(wire);

    anchors.forEach((pt, idx) => {
      const g = document.createElementNS(svgNS, "g");
      g.classList.add("ny-bulb-group");
      g.style.color = BULB_COLORS[idx % BULB_COLORS.length];
      const cap = document.createElementNS(svgNS, "rect");
      cap.setAttribute("x", pt.x - 2.4);
      cap.setAttribute("y", pt.y);
      cap.setAttribute("width", "4.8");
      cap.setAttribute("height", "4.2");
      cap.setAttribute("rx", "1");
      cap.setAttribute("fill", "#64748B");
      const bulb = document.createElementNS(svgNS, "ellipse");
      bulb.setAttribute("cx", pt.x);
      bulb.setAttribute("cy", pt.y + 11);
      bulb.setAttribute("rx", "4.2");
      bulb.setAttribute("ry", "6.4");
      bulb.setAttribute("fill", BULB_COLORS[idx % BULB_COLORS.length]);
      bulb.classList.add("ny-bulb-core");
      g.append(cap, bulb);
      svg.appendChild(g);
      const spring = { el: g, angle: 0, vel: 0 };
      bulbSprings.push(spring);
      g.addEventListener("pointerenter", () => {
        spring.vel += (Math.random() > 0.5 ? 1 : -1) * 5;
        g.classList.add("is-Lit");
        setTimeout(() => g.classList.remove("is-Lit"), 650);
        wakeBulbs(2200);
      });
      g.addEventListener("click", () => {
        wakeBulbs(2400);
        bulbSprings.forEach((b, bIdx) => {
          setTimeout(() => {
            b.vel += (bIdx % 2 === 0 ? 1 : -1) * 4.5;
            b.el.classList.add("is-Lit");
            setTimeout(() => b.el.classList.remove("is-Lit"), 500);
          }, Math.abs(bIdx - idx) * 32);
        });
      });
    });
    slot.appendChild(svg);
  });

  // 6. Lightweight 3D Card Tilt & Magnetic Buttons
  if (finePointer && !reducedMotion && !isMobile) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const rx = (0.5 - (e.clientY - rect.top) / rect.height) * 4.2;
        const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 5.2;
        card.style.transform = `perspective(920px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.14;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
        btn.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }

  // 7. Smooth Grid Accordions
  document.querySelectorAll(".faq-acc-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-acc-item");
      if (!item) return;
      const isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  // 8. Precision Tashkent UTC+5 2027 Countdown -> 40s 3D WebGL + Voice Keynote -> Full-Site Transformation
  const REAL_2027_UTC = Date.UTC(2026, 11, 31, 19, 0, 0);
  const params = new URLSearchParams(window.location.search);
  const demoCdSec = parseInt(params.get("countdown") || "0", 10);
  const force2027 = params.get("ny2027") === "1";
  const forceCinema = params.get("cinema2027") === "1";

  let serverOffsetMs = 0;
  try {
    const t0 = Date.now();
    fetch(window.location.pathname, { method: "HEAD", cache: "no-store" })
      .then((resp) => {
        const hdr = resp.headers.get("date");
        if (hdr) {
          const srv = Date.parse(hdr);
          if (!Number.isNaN(srv)) serverOffsetMs = srv - Math.round((t0 + Date.now()) / 2);
        }
      })
      .catch(() => {});
  } catch (_) {}

  const effectiveTargetUtc = force2027
    ? Date.now() - 1000
    : demoCdSec > 0
      ? Date.now() + Math.min(3600, demoCdSec) * 1000
      : REAL_2027_UTC;

  const CD_I18N = {
    uz: {
      pre_title: "Toshkent 00:00 • 2027 Katta Update’gacha",
      pre_sub: "00:00 da 40 soniyalik 3D taqdimot va mutlaqo yangi Cosmic Prism sayt ochiladi",
      live_title: "2027-Yil Kirib Keldi! • Katta Update Faol",
      live_sub: "Yangi 2027 Cosmic Prism interfeysi, studiya rasmlari va fazoviy panel ochildi",
      live_badge: "▶ 2027 3D FILM (40s)",
      d: "KUN", h: "SOAT", m: "DAQ", s: "SON",
      hero_chip_2027: "AeroGram 2027 • Fazoviy Avlod",
      hero_title_2027: "2027 bilan <em class=\"serif-accent\">Yangi</em><br>Fazoviy Muloqot",
      desk_title_2027: "2027 Noutbuklar uchun<br><em class=\"serif-accent\">Mukammal</em> AeroGram",
      deck: [
        {
          m1_v: "0.08 s", m1_l: "Android ↔ Windows sinxron",
          m2_v: "∞ profil", m2_l: "Cheksiz akkaunt uyasi",
          t: "Yagona Fazoviy Ekotizim",
          d: "Telefon va Windows noutbukingiz o‘rtasida fayllar, chatlar va faol sessiyalar real vaqtda birlashadi."
        },
        {
          m1_v: "PIN + Bio", m1_l: "Ko‘rinmas seyf qulfi",
          m2_v: "Ghost Blur", m2_l: "Bir tugma bilan xiralashish",
          t: "Maxfiy Seyf 2.0 & Ko‘rinmas Qalqon",
          d: "Eng muhim yozishmalaringiz umumiy ro‘yxatdan yashiriladi — faqat qidiruvga PIN yozilgandagina ochiladi."
        },
        {
          m1_v: "29+ kanal", m1_l: "Full HD jonli TV efir",
          m2_v: "60 FPS", m2_l: "Yengil Liquid Motion",
          t: "29+ Hamjamiyat va Jonli TV Markazi",
          d: "O‘zbekistonning barcha yetakchi kanallari va sevimli hamjamiyatlar reklamasiz bitta platformada."
        }
      ]
    },
    ru: {
      pre_title: "Ташкент 00:00 • До Большого 2027 Update",
      pre_sub: "Ровно в 00:00 запустится 40-сек 3D-презентация и полностью новый сайт 2027",
      live_title: "С Новым 2027 Годом! • Grand Update Активен",
      live_sub: "Активирован интерфейс Cosmic Prism, новые фото и платформа 2027",
      live_badge: "▶ 2027 3D ФИЛЬМ (40с)",
      d: "ДНИ", h: "ЧАС", m: "МИН", s: "СЕК",
      hero_chip_2027: "AeroGram 2027 • Новая Архитектура",
      hero_title_2027: "Новый 2027 год —<br><em class=\"serif-accent\">Космический</em> Уровень",
      desk_title_2027: "Новый 2027 AeroGram<br><em class=\"serif-accent\">для</em> Ноутбука и ПК",
      deck: [
        {
          m1_v: "0.08 с", m1_l: "Синхрон Android ↔ Windows",
          m2_v: "∞ аккаунты", m2_l: "Безлимитное переключение",
          t: "Единая Пространственная Экосистема",
          d: "Смартфон и ноутбук работают как одно устройство — диалоги и файлы синхронизируются мгновенно."
        },
        {
          m1_v: "PIN + Био", m1_l: "Невидимый Сейф 2.0",
          m2_v: "Ghost Blur", m2_l: "Мгновенная приватность",
          t: "Секретный Сейф 2.0",
          d: "Важные чаты полностью скрыты из общего списка и открываются только по вашему PIN-коду в поиске."
        },
        {
          m1_v: "29+ каналов", m1_l: "Прямой Full HD эфир",
          m2_v: "60 FPS", m2_l: "Лёгкий Liquid Motion",
          t: "29+ каналов и Платформа 2027",
          d: "Любимые сообщества и прямое телевидение Узбекистана на телефоне и ПК без задержек."
        }
      ]
    },
    en: {
      pre_title: "Tashkent 00:00 • Countdown to 2027 Grand Update",
      pre_sub: "At 00:00 UZT a 40s 3D keynote film & Cosmic Prism 2027 redesign launch automatically",
      live_title: "Welcome to 2027! • Cosmic Prism Edition Live",
      live_sub: "2027 Cosmic Prism UI, new studio photography & spatial hub are now unlocked",
      live_badge: "▶ 2027 3D FILM (40s)",
      d: "DAYS", h: "HRS", m: "MIN", s: "SEC",
      hero_chip_2027: "AeroGram 2027 • Spatial Architecture",
      hero_title_2027: "Step Into <em class=\"serif-accent\">2027</em><br>Without Limits",
      desk_title_2027: "AeroGram 2027 <em class=\"serif-accent\">Built</em><br>for Windows Laptops",
      deck: [
        {
          m1_v: "0.08s", m1_l: "Android ↔ Windows Handoff",
          m2_v: "∞ slots", m2_l: "Unlimited account workspace",
          t: "Unified Spatial Architecture",
          d: "Messages, channels, and active work threads glide instantaneously between mobile and Windows Desktop."
        },
        {
          m1_v: "PIN + Bio", m1_l: "Stealth Vault 2.0 Shield",
          m2_v: "Ghost Blur", m2_l: "One-keyscreen privacy",
          t: "Zero-Trace Secret Vault",
          d: "Conceal sensitive threads completely from search and main lists — revealable solely via PIN entry."
        },
        {
          m1_v: "29+ TV", m1_l: "Live Full HD Broadcast",
          m2_v: "60 FPS", m2_l: "GPU-tuned Liquid Motion",
          t: "29+ Live Channels & Creator Engine",
          d: "High-bitrate Uzbekistan TV channels and redesigned community spaces engineered for silky smoothness."
        }
      ]
    }
  };

  function getLang() {
    const l = (root.getAttribute("lang") || "uz").slice(0, 2);
    return CD_I18N[l] ? l : "uz";
  }

  function getTashkentClockStr(nowUtcMs) {
    const uz = new Date(nowUtcMs + 5 * 3600 * 1000);
    const p = (n) => (n < 10 ? "0" + n : String(n));
    return `${p(uz.getUTCHours())}:${p(uz.getUTCMinutes())}:${p(uz.getUTCSeconds())} UZT`;
  }

  let preloaded2027 = false;
  function preload2027Images() {
    if (preloaded2027) return;
    preloaded2027 = true;
    document.querySelectorAll("img[data-src-2027]").forEach((img) => {
      const loader = new Image();
      loader.src = img.getAttribute("data-src-2027");
    });
  }

  let activeDeckIdx = 0;
  function renderSpatialDeck(idx) {
    activeDeckIdx = idx;
    const deckData = (CD_I18N[getLang()] || CD_I18N.uz).deck;
    const item = deckData[idx] || deckData[0];
    document.querySelectorAll(".cap-tab-btn").forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.deckTab) === idx);
    });
    const m1v = document.getElementById("deck-m1-v");
    const m1l = document.getElementById("deck-m1-l");
    const m2v = document.getElementById("deck-m2-v");
    const m2l = document.getElementById("deck-m2-l");
    const dt = document.getElementById("deck-title");
    const dd = document.getElementById("deck-desc");
    if (m1v) m1v.textContent = item.m1_v;
    if (m1l) m1l.textContent = item.m1_l;
    if (m2v) m2v.textContent = item.m2_v;
    if (m2l) m2l.textContent = item.m2_l;
    if (dt) dt.textContent = item.t;
    if (dd) dd.textContent = item.d;
  }

  let swappedImages = false;
  function apply2027Metamorphosis() {
    const tr = CD_I18N[getLang()];
    if (root.getAttribute("data-era") !== "2027-live") {
      root.setAttribute("data-era", "2027-live");
    }
    if (!root.getAttribute("data-aura")) {
      root.setAttribute("data-aura", "prism");
    }

    if (!swappedImages) {
      swappedImages = true;
      document.querySelectorAll("img[data-src-2027]").forEach((img) => {
        const nextSrc = img.getAttribute("data-src-2027");
        if (!nextSrc || img.getAttribute("src") === nextSrc) return;
        img.classList.add("is-swapping-2027");
        setTimeout(() => {
          img.setAttribute("src", nextSrc);
          img.classList.remove("is-swapping-2027");
        }, 160);
      });
    }

    const chip = document.querySelector(".hero-chip span[data-i18n]");
    if (chip) chip.textContent = tr.hero_chip_2027;
    const h1 = document.querySelector(".hero h1[data-i18n]");
    if (h1) h1.innerHTML = tr.hero_title_2027;
    const deskH1 = document.querySelector(".desk-hero h1[data-desk-i18n]");
    if (deskH1) deskH1.innerHTML = tr.desk_title_2027;

    renderSpatialDeck(activeDeckIdx);
  }

  let cinemaLaunched = false;
  function launch2027Keynote(fromUserReplay) {
    if (window.AeroCinema2027 && typeof window.AeroCinema2027.play === "function") {
      if (!fromUserReplay && cinemaLaunched) return;
      cinemaLaunched = true;
      window.AeroCinema2027.play({
        onBeforeReveal: () => {
          apply2027Metamorphosis();
        },
        onComplete: () => {
          apply2027Metamorphosis();
          trigger2027Fireworks();
        }
      });
    } else {
      apply2027Metamorphosis();
      trigger2027Fireworks();
    }
  }

  let hasTriggeredArrival = false;
  const cdMounts = Array.from(document.querySelectorAll("[data-ny-countdown]"));
  const pad2 = (n) => (n < 10 ? "0" + n : String(n));

  function renderCountdown(isArrivedNow, dStr, hStr, mStr, sStr, uzClock) {
    const tr = CD_I18N[getLang()];
    const curLang = getLang();
    cdMounts.forEach((mount) => {
      let bar = mount.querySelector(".ny-countdown-bar");
      if (!bar || bar.dataset.mode !== (isArrivedNow ? "live" : "pre") || bar.dataset.lang !== curLang) {
        mount.innerHTML = isArrivedNow
          ? `<div class="ny-countdown-bar is-arrived" data-mode="live" data-lang="${curLang}">
              <div class="ny-cd-meta">
                <div class="ny-cd-title-row"><span class="ny-cd-dot"></span><span>${tr.live_title}</span></div>
                <div class="ny-cd-sub-row">
                  <span class="ny-cd-sub">${tr.live_sub}</span>
                  <span class="ny-uz-live-clock">${uzClock}</span>
                </div>
              </div>
              <button type="button" class="ny-arrived-badge" data-replay-cinema>${tr.live_badge}</button>
            </div>`
          : `<div class="ny-countdown-bar" data-mode="pre" data-lang="${curLang}">
              <div class="ny-cd-meta">
                <div class="ny-cd-title-row"><span class="ny-cd-dot"></span><span>${tr.pre_title}</span></div>
                <div class="ny-cd-sub-row">
                  <span class="ny-cd-sub">${tr.pre_sub}</span>
                  <span class="ny-uz-live-clock">${uzClock}</span>
                </div>
              </div>
              <div class="ny-cd-tiles">
                <div class="ny-cd-unit" data-u="d"><strong class="ny-cd-val">${dStr}</strong><small class="ny-cd-lbl">${tr.d}</small></div>
                <div class="ny-cd-unit" data-u="h"><strong class="ny-cd-val">${hStr}</strong><small class="ny-cd-lbl">${tr.h}</small></div>
                <div class="ny-cd-unit" data-u="m"><strong class="ny-cd-val">${mStr}</strong><small class="ny-cd-lbl">${tr.m}</small></div>
                <div class="ny-cd-unit" data-u="s"><strong class="ny-cd-val">${sStr}</strong><small class="ny-cd-lbl">${tr.s}</small></div>
              </div>
            </div>`;
        return;
      }

      const clkEl = bar.querySelector(".ny-uz-live-clock");
      if (clkEl) clkEl.textContent = uzClock;
      if (!isArrivedNow) {
        const nextMap = { d: dStr, h: hStr, m: mStr, s: sStr };
        ["d", "h", "m", "s"].forEach((k) => {
          const unit = bar.querySelector(`.ny-cd-unit[data-u="${k}"]`);
          const valEl = unit?.querySelector(".ny-cd-val");
          if (valEl && valEl.textContent !== nextMap[k]) {
            valEl.textContent = nextMap[k];
            unit.classList.remove("is-tick");
            void unit.offsetWidth;
            unit.classList.add("is-tick");
          }
        });
      }
    });
  }

  function tick2027Clock() {
    const nowUtcMs = Date.now() + (demoCdSec > 0 ? 0 : serverOffsetMs);
    const diffMs = effectiveTargetUtc - nowUtcMs;
    const uzClock = getTashkentClockStr(nowUtcMs);
    if (diffMs <= 20000 || demoCdSec > 0 || force2027 || forceCinema) preload2027Images();

    if (forceCinema && !cinemaLaunched) {
      apply2027Metamorphosis();
      renderCountdown(true, "00", "00", "00", "00", uzClock);
      launch2027Keynote(false);
      return;
    }

    if (diffMs <= 0) {
      renderCountdown(true, "00", "00", "00", "00", uzClock);
      if (!hasTriggeredArrival) {
        hasTriggeredArrival = true;
        if (force2027) {
          apply2027Metamorphosis();
          trigger2027Fireworks();
        } else {
          // 00:00 UZT exact arrival or ?countdown=N reaching zero -> launch 40s 3D WebGL Keynote!
          launch2027Keynote(false);
        }
      }
      return;
    }

    const totalSec = Math.ceil(diffMs / 1000);
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    renderCountdown(false, pad2(days), pad2(hrs), pad2(mins), pad2(secs), uzClock);
  }

  // 9. Interactive 2027 Cosmic Prism Spatial Deck Controls
  document.addEventListener("click", (e) => {
    const auraBtn = e.target.closest(".cap-aura-btn");
    if (auraBtn) {
      const aura = auraBtn.dataset.auraSet || "prism";
      root.setAttribute("data-aura", aura);
      document.querySelectorAll(".cap-aura-btn").forEach((b) => b.classList.toggle("active", b === auraBtn));
      return;
    }
    const tabBtn = e.target.closest(".cap-tab-btn");
    if (tabBtn) {
      renderSpatialDeck(Number(tabBtn.dataset.deckTab || 0));
      return;
    }
    if (e.target.closest("[data-replay-cinema]")) {
      launch2027Keynote(true);
    }
  });

  if (document.getElementById("deck-title")) renderSpatialDeck(0);

  if (cdMounts.length > 0) {
    tick2027Clock();
    setInterval(tick2027Clock, 1000);
    new MutationObserver(() => {
      setTimeout(() => {
        tick2027Clock();
        if (root.getAttribute("data-era") === "2027-live") apply2027Metamorphosis();
      }, 0);
    }).observe(root, { attributes: true, attributeFilter: ["lang"] });
  }

  window.__AERO_FESTIVE__ = {
    syncFxButtons,
    isFxEnabled: () => fxEnabled,
    tick2027Clock,
    playKeynote: () => launch2027Keynote(true),
  };
})();
