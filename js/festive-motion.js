(function () {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isMobile = window.innerWidth < 768;

  // 1. Holiday FX Preference
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

  // 2. Santa Cap (Pre-00:00) & Golden 2027 Crown (Post-00:00) on Top-Left Brand Logo
  const SANTA_SVG = `<svg class="aero-santa-cap" viewBox="0 0 64 52" fill="none" aria-hidden="true">
    <path d="M12 36C13 17 26 5 46 8C53 9 58 14 57 20C52 17 44 17 38 22C34 26 37 32 41 36H12Z" fill="#DC2626"/>
    <path d="M12 36C16 24 27 14 41 11C34 15 26 24 23 36H12Z" fill="#EF4444"/>
    <rect x="7" y="34" width="38" height="10" rx="5" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
    <circle cx="56" cy="20" r="6" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
  </svg>`;

  const CROWN_2027_SVG = `<svg class="aero-crown-2027" viewBox="0 0 64 46" fill="none" aria-hidden="true">
    <path d="M8 38L4 12L20 24L32 6L44 24L60 12L56 38H8Z" fill="url(#crownGold)" stroke="#FEF3C7" stroke-width="2" stroke-linejoin="round"/>
    <rect x="8" y="37" width="48" height="6" rx="3" fill="#F59E0B"/>
    <circle cx="32" cy="5" r="4" fill="#FEF3C7"/>
    <circle cx="4" cy="11" r="3" fill="#34D399"/>
    <circle cx="60" cy="11" r="3" fill="#34D399"/>
    <defs><linearGradient id="crownGold" x1="8" y1="6" x2="56" y2="40" gradientUnits="userSpaceOnUse"><stop stop-color="#FDE68A"/><stop offset="1" stop-color="#D97706"/></linearGradient></defs>
  </svg>`;

  document.querySelectorAll(".brand-logo, .tv-brand-logo").forEach((el) => {
    if (!el.querySelector(".aero-santa-cap")) el.insertAdjacentHTML("beforeend", SANTA_SVG);
    if (!el.querySelector(".aero-crown-2027")) el.insertAdjacentHTML("beforeend", CROWN_2027_SVG);
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

  // 4. Sprite-Cached Snowfall -> Rising 2027 Stardust & Fireworks (Pauses on TV video play)
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

  function makeSprite(type, isGold, isLight) {
    const c = document.createElement("canvas");
    c.width = 24;
    c.height = 24;
    const g = c.getContext("2d");
    const col = isGold
      ? isLight ? "217, 119, 6" : "253, 230, 138"
      : type === 3 ? "52, 211, 153" : isLight ? "14, 165, 233" : "224, 242, 254";
    if (type === 0) {
      g.fillStyle = `rgba(${col}, 0.65)`;
      g.beginPath();
      g.arc(12, 12, 2.1, 0, Math.PI * 2);
      g.fill();
    } else if (type === 1) {
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
      grad.addColorStop(0, `rgba(${col}, 0.62)`);
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
    sprites = [makeSprite(0, false, isLight), makeSprite(1, false, isLight), makeSprite(2, true, isLight)];
    eraSprites = [makeSprite(2, true, isLight), makeSprite(3, false, isLight), makeSprite(2, true, isLight)];
  }

  function spawnFlake(randomY) {
    const r = Math.random();
    const sIdx = r < 0.55 ? 0 : r < 0.85 ? 1 : 2;
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
    const count = sWidth < 768 ? 14 : 28;
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
        p.life -= 0.014;
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
      [sWidth * 0.72, sHeight * 0.24, 380],
      [sWidth * 0.50, sHeight * 0.34, 820],
    ];
    spots.forEach(([cx, cy, delay], sIdx) => {
      setTimeout(() => {
        const perBurst = isMobile ? 16 : 26;
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

  // 5. Event-Driven Holiday Garland Physics (0% idle CPU!)
  const BULB_COLORS = ["#F59E0B", "#38BDF8", "#10B981", "#F43F5E", "#FDE68A"];
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

  // 6. Lightweight 3D Card Tilt & Magnetic Buttons (Desktop Fine Pointer)
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

  // 8. Precision Tashkent UTC+5 2027 Countdown & 00:00 Full-Site Metamorphosis
  // Uzbekistan has permanent UTC+05:00 with no DST -> 2027-01-01 00:00:00 UZT === Date.UTC(2026, 11, 31, 19, 0, 0)
  const REAL_2027_UTC = Date.UTC(2026, 11, 31, 19, 0, 0);
  const params = new URLSearchParams(window.location.search);
  const demoCdSec = parseInt(params.get("countdown") || "0", 10);
  const force2027 = params.get("ny2027") === "1";

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
      pre_sub: "00:00 da yangi 2027 dizayn, rasmlar va kapsula avtomatik ochiladi",
      live_title: "2027-Yil Kirib Keldi! • Katta 2027 Update Faol",
      live_sub: "Yangi 2027 dizayni, oltin mavzu va Tabriknoma studiyasi ochildi",
      live_badge: "2027 LIVE • UPDATE ON",
      d: "KUN", h: "SOAT", m: "DAQ", s: "SON",
      hero_chip_2027: "2027-Yil Muborak • Yangi Avlod v2027",
      hero_title_2027: "2027 bilan <em class=\"serif-accent\">Yangi</em><br>Darajaga Ko‘tariling",
      desk_title_2027: "2027 Noutbuklar uchun<br><em class=\"serif-accent\">Kuchli</em> va Maxfiy AeroGram",
      card_title: "Yangi 2027 Yil Muborak!",
      card_sub: "AeroGram bilan cheksiz tezlik, ishonch va yorqin g‘alabalar yili bo‘lsin.",
      card_stamp: "Toshkent • 01.01.2027",
    },
    ru: {
      pre_title: "Ташкент 00:00 • До Большого 2027 Update",
      pre_sub: "В 00:00 автоматически откроются новый дизайн, арт и капсула 2027",
      live_title: "С Новым 2027 Годом! • Большой Update Активен",
      live_sub: "Включён новый облик 2027 года и генератор открыток",
      live_badge: "2027 LIVE • UPDATE ON",
      d: "ДНИ", h: "ЧАС", m: "МИН", s: "СЕК",
      hero_chip_2027: "С Новым 2027 Годом • Эра v2027",
      hero_title_2027: "Новый 2027 год —<br><em class=\"serif-accent\">Новый</em> Уровень Общения",
      desk_title_2027: "Новый 2027 AeroGram<br><em class=\"serif-accent\">для</em> Ноутбука и ПК",
      card_title: "С Новым 2027 Годом!",
      card_sub: "Скорости без границ, приватности и больших побед вместе с AeroGram.",
      card_stamp: "Ташкент • 01.01.2027",
    },
    en: {
      pre_title: "Tashkent 00:00 • Countdown to 2027 Grand Update",
      pre_sub: "At 00:00 UZT new artwork, 2027 UI & interactive capsule unlock automatically",
      live_title: "Happy New Year 2027! • Grand 2027 Update Live",
      live_sub: "All 2027 visual redesign, custom aura & card studio are now unlocked",
      live_badge: "2027 LIVE • UPDATE ON",
      d: "DAYS", h: "HRS", m: "MIN", s: "SEC",
      hero_chip_2027: "Happy 2027 Edition • Next-Gen Release",
      hero_title_2027: "Step Into <em class=\"serif-accent\">2027</em><br>Without Limits",
      desk_title_2027: "AeroGram 2027 <em class=\"serif-accent\">Built</em><br>for Windows Laptops",
      card_title: "Happy New Year 2027!",
      card_sub: "Wishing you effortless speed, privacy and milestones with AeroGram.",
      card_stamp: "Tashkent • 01.01.2027",
    },
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

  let swappedImages = false;
  function apply2027Metamorphosis() {
    const tr = CD_I18N[getLang()];
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

    const chip = document.querySelector(".hero-chip span[data-i18n], .hero-chip span[data-desk-i18n]");
    if (chip && chip.getAttribute("data-i18n")) chip.textContent = tr.hero_chip_2027;
    const h1 = document.querySelector(".hero h1[data-i18n]");
    if (h1) h1.innerHTML = tr.hero_title_2027;
    const deskH1 = document.querySelector(".desk-hero h1[data-desk-i18n]");
    if (deskH1) deskH1.innerHTML = tr.desk_title_2027;

    if (typeof draw2027GreetingCard === "function") draw2027GreetingCard();
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
              <div class="ny-arrived-badge">${tr.live_badge}</div>
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
    if (diffMs <= 20000 || demoCdSec > 0 || force2027) preload2027Images();

    if (diffMs <= 0) {
      if (root.getAttribute("data-era") !== "2027-live") {
        root.setAttribute("data-era", "2027-live");
        if (!root.getAttribute("data-aura")) root.setAttribute("data-aura", "emerald");
      }
      renderCountdown(true, "00", "00", "00", "00", uzClock);
      apply2027Metamorphosis();
      if (!hasTriggeredArrival) {
        hasTriggeredArrival = true;
        trigger2027Fireworks();
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

  // 9. Interactive 2027 Capsule: Personalized Greeting Card Canvas + Live Aura + Chime
  const cardCanvas = document.getElementById("card2027-canvas");
  const cardNameInput = document.getElementById("card2027-name");
  const cardDlBtn = document.getElementById("card2027-dl");
  const chimeBtn = document.getElementById("chime2027-btn");
  let cardPalette = "emerald";

  const PALETTES = {
    emerald: { bg1: "#041612", bg2: "#0A2B23", accent: "#10B981", gold: "#FBBF24" },
    gold: { bg1: "#161004", bg2: "#2C1E06", accent: "#F59E0B", gold: "#FDE68A" },
    royal: { bg1: "#080B20", bg2: "#151B42", accent: "#6366F1", gold: "#FBBF24" },
  };

  function draw2027GreetingCard() {
    if (!cardCanvas) return;
    const ctx = cardCanvas.getContext("2d");
    const w = cardCanvas.width;
    const h = cardCanvas.height;
    const pal = PALETTES[cardPalette] || PALETTES.emerald;
    const tr = CD_I18N[getLang()];
    const recipient = (cardNameInput?.value || "AeroGram").trim() || "AeroGram";

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, pal.bg1);
    grad.addColorStop(1, pal.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle radial aurora glows
    const g1 = ctx.createRadialGradient(w * 0.8, h * 0.2, 10, w * 0.8, h * 0.2, 340);
    g1.addColorStop(0, pal.gold + "44");
    g1.addColorStop(1, "transparent");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    const g2 = ctx.createRadialGradient(w * 0.18, h * 0.82, 10, w * 0.18, h * 0.82, 300);
    g2.addColorStop(0, pal.accent + "44");
    g2.addColorStop(1, "transparent");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);

    // Double chamfered frame
    ctx.strokeStyle = pal.gold + "88";
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, w - 48, h - 48);

    // Header badge
    ctx.fillStyle = pal.gold;
    ctx.font = "700 22px 'JetBrains Mono', monospace";
    ctx.fillText("AEROGRAM • 2027", 56, 86);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "600 18px 'JetBrains Mono', monospace";
    ctx.fillText(tr.card_stamp, w - 260, 86);

    // Main Headline & Recipient
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 54px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(tr.card_title, 56, 190);

    ctx.fillStyle = pal.gold;
    ctx.font = "italic 60px Georgia, serif";
    ctx.fillText(recipient, 56, 272);

    ctx.fillStyle = "#CBD5E1";
    ctx.font = "400 23px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(tr.card_sub.slice(0, 56), 56, 354);
    if (tr.card_sub.length > 56) {
      ctx.fillText(tr.card_sub.slice(56), 56, 388);
    }

    ctx.fillStyle = pal.accent;
    ctx.font = "700 20px 'JetBrains Mono', monospace";
    ctx.fillText("aerogram.website", 56, h - 54);
  }

  cardNameInput?.addEventListener("input", draw2027GreetingCard);
  document.querySelectorAll(".cap-pal-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      cardPalette = btn.dataset.pal || "emerald";
      document.querySelectorAll(".cap-pal-btn").forEach((b) => b.classList.toggle("active", b === btn));
      draw2027GreetingCard();
    });
  });

  cardDlBtn?.addEventListener("click", () => {
    if (!cardCanvas) return;
    draw2027GreetingCard();
    const a = document.createElement("a");
    a.download = "AeroGram-2027-Tabrik.png";
    a.href = cardCanvas.toDataURL("image/png");
    a.click();
  });

  document.querySelectorAll(".cap-aura-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const aura = btn.dataset.auraSet || "emerald";
      root.setAttribute("data-aura", aura);
      document.querySelectorAll(".cap-aura-btn").forEach((b) => b.classList.toggle("active", b === btn));
      cardPalette = aura;
      document.querySelectorAll(".cap-pal-btn").forEach((b) => b.classList.toggle("active", b.dataset.pal === aura));
      draw2027GreetingCard();
    });
  });

  chimeBtn?.addEventListener("click", () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ac = new AudioCtx();
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const start = ac.currentTime + idx * 0.12;
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.11, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.1);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(start);
        osc.stop(start + 1.15);
      });
    } catch (_) {}
  });

  if (cardCanvas) draw2027GreetingCard();

  if (cdMounts.length > 0) {
    tick2027Clock();
    setInterval(tick2027Clock, 1000);
    new MutationObserver(() => {
      setTimeout(() => tick2027Clock(), 0);
    }).observe(root, { attributes: true, attributeFilter: ["lang"] });
  }

  window.__AERO_FESTIVE__ = {
    syncFxButtons,
    isFxEnabled: () => fxEnabled,
    tick2027Clock,
    draw2027GreetingCard,
  };
})();
